const path = require("path");
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || "";

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname)));

let db = null;

async function connectDb() {
  if (!MONGODB_URI) {
    console.log("MONGODB_URI not set. Running in static/localStorage mode.");
    return;
  }
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db("gst_billing");
    console.log("Connected to MongoDB Atlas (database: gst_billing)");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    db = null;
  }
}

function requireDb(req, res, next) {
  if (!db) {
    return res.status(503).json({ error: "Database not connected" });
  }
  return next();
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, dbConnected: Boolean(db) });
});

app.get("/api/sync", requireDb, async (req, res) => {
  try {
    const [items, parties, bizDoc, bills] = await Promise.all([
      db.collection("items").find({}, { projection: { _id: 0 } }).toArray(),
      db.collection("parties").find({}, { projection: { _id: 0 } }).toArray(),
      db.collection("business_settings").findOne({ id: "default" }, { projection: { _id: 0 } }),
      db.collection("invoices").find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(100).toArray(),
    ]);
    res.json({ items, parties, business: bizDoc || null, bills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/items", requireDb, async (req, res) => {
  try {
    const rows = Array.isArray(req.body) ? req.body : [req.body];
    const col = db.collection("items");
    await Promise.all(
      rows.map((item) =>
        col.updateOne({ id: item.id }, { $set: item }, { upsert: true })
      )
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/items/:id", requireDb, async (req, res) => {
  try {
    await db.collection("items").deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/parties", requireDb, async (req, res) => {
  try {
    const rows = Array.isArray(req.body) ? req.body : [req.body];
    const col = db.collection("parties");
    await Promise.all(
      rows.map((party) =>
        col.updateOne({ id: party.id }, { $set: party }, { upsert: true })
      )
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/parties/:id", requireDb, async (req, res) => {
  try {
    await db.collection("parties").deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/business", requireDb, async (req, res) => {
  try {
    const doc = { ...req.body, id: "default" };
    await db.collection("business_settings").updateOne(
      { id: "default" },
      { $set: doc },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bills", requireDb, async (req, res) => {
  try {
    const bill = { ...req.body, createdAt: new Date().toISOString() };
    await db.collection("invoices").updateOne(
      { id: bill.id },
      { $set: bill },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/bills/:id", requireDb, async (req, res) => {
  try {
    await db.collection("invoices").deleteOne({ id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

connectDb().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
