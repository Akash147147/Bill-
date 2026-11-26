const path = require("path");
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL || "";

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname)));

let pool = null;
let dbConnected = false;

async function initDb() {
  if (!DATABASE_URL) {
    console.log("DATABASE_URL not set. Running in localStorage mode.");
    return;
  }

  try {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await pool.query(`
      create table if not exists items (
        id text primary key,
        name text not null,
        hsn text not null default '',
        uom text not null default '',
        rate numeric not null default 0,
        cgst numeric not null default 9,
        sgst numeric not null default 9,
        igst numeric not null default 18,
        created_at timestamptz not null default now()
      );

      create table if not exists parties (
        id text primary key,
        name text not null,
        address text not null default '',
        gstin text not null default '',
        state text not null default 'AP',
        state_code text not null default '37',
        created_at timestamptz not null default now()
      );

      create table if not exists business_settings (
        id text primary key,
        name text not null,
        phone text not null default '',
        address text not null default '',
        gstin text not null default '',
        state text not null default 'Andhra Pradesh',
        state_code text not null default '37',
        bank_name text not null default '',
        bank_branch text not null default '',
        bank_acc text not null default '',
        bank_ifsc text not null default '',
        email text not null default '',
        terms jsonb not null default '[]'::jsonb,
        updated_at timestamptz not null default now()
      );

      create table if not exists invoices (
        id text primary key,
        invoice_no text not null default '',
        invoice_date text not null default '',
        bill_name text not null default '',
        total_amount numeric not null default 0,
        data jsonb not null,
        created_at timestamptz not null default now()
      );
    `);

    dbConnected = true;
    console.log("Connected to Neon PostgreSQL and verified tables.");
  } catch (err) {
    console.error("Neon PostgreSQL connection error:", err.message);
    dbConnected = false;
  }
}

function requireDb(req, res, next) {
  if (!dbConnected || !pool) {
    return res.status(503).json({ error: "Database not connected" });
  }
  return next();
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, dbConnected });
});

app.get("/api/sync", requireDb, async (req, res) => {
  try {
    const [itemsRes, partiesRes, bizRes, billsRes] = await Promise.all([
      pool.query("select id, name, hsn, uom, rate, cgst, sgst, igst from items order by created_at asc"),
      pool.query("select id, name, address, gstin, state, state_code from parties order by created_at asc"),
      pool.query("select * from business_settings where id = 'default'"),
      pool.query("select id, invoice_no, invoice_date, bill_name, total_amount, data from invoices order by created_at desc limit 100"),
    ]);

    const items = itemsRes.rows.map((r) => ({
      id: r.id,
      name: r.name,
      hsn: r.hsn,
      uom: r.uom,
      rate: Number(r.rate),
      cgst: Number(r.cgst),
      sgst: Number(r.sgst),
      igst: Number(r.igst),
    }));

    const parties = partiesRes.rows.map((r) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      gstin: r.gstin,
      state: r.state,
      stateCode: r.state_code,
    }));

    const b = bizRes.rows[0];
    const business = b
      ? {
          name: b.name,
          phone: b.phone,
          address: b.address,
          gstin: b.gstin,
          state: b.state,
          stateCode: b.state_code,
          bankName: b.bank_name,
          bankBranch: b.bank_branch,
          bankAcc: b.bank_acc,
          bankIfsc: b.bank_ifsc,
          email: b.email,
          terms: Array.isArray(b.terms) ? b.terms : [],
        }
      : null;

    const bills = billsRes.rows.map((r) => ({
      id: r.id,
      invoiceNo: r.invoice_no,
      invoiceDate: r.invoice_date,
      billName: r.bill_name,
      totalAmount: Number(r.total_amount),
      data: r.data,
    }));

    res.json({ items, parties, business, bills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/items", requireDb, async (req, res) => {
  try {
    const rows = Array.isArray(req.body) ? req.body : [req.body];
    for (const item of rows) {
      await pool.query(
        `insert into items (id, name, hsn, uom, rate, cgst, sgst, igst)
         values ($1, $2, $3, $4, $5, $6, $7, $8)
         on conflict (id) do update set
           name = excluded.name,
           hsn = excluded.hsn,
           uom = excluded.uom,
           rate = excluded.rate,
           cgst = excluded.cgst,
           sgst = excluded.sgst,
           igst = excluded.igst`,
        [item.id, item.name, item.hsn || "", item.uom || "", item.rate || 0, item.cgst || 0, item.sgst || 0, item.igst || 0]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/items/:id", requireDb, async (req, res) => {
  try {
    await pool.query("delete from items where id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/parties", requireDb, async (req, res) => {
  try {
    const rows = Array.isArray(req.body) ? req.body : [req.body];
    for (const p of rows) {
      await pool.query(
        `insert into parties (id, name, address, gstin, state, state_code)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (id) do update set
           name = excluded.name,
           address = excluded.address,
           gstin = excluded.gstin,
           state = excluded.state,
           state_code = excluded.state_code`,
        [p.id, p.name, p.address || "", p.gstin || "", p.state || "AP", p.stateCode || p.state_code || "37"]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/parties/:id", requireDb, async (req, res) => {
  try {
    await pool.query("delete from parties where id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/business", requireDb, async (req, res) => {
  try {
    const b = req.body;
    await pool.query(
      `insert into business_settings
         (id, name, phone, address, gstin, state, state_code, bank_name, bank_branch, bank_acc, bank_ifsc, email, terms, updated_at)
       values ('default', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, now())
       on conflict (id) do update set
         name = excluded.name,
         phone = excluded.phone,
         address = excluded.address,
         gstin = excluded.gstin,
         state = excluded.state,
         state_code = excluded.state_code,
         bank_name = excluded.bank_name,
         bank_branch = excluded.bank_branch,
         bank_acc = excluded.bank_acc,
         bank_ifsc = excluded.bank_ifsc,
         email = excluded.email,
         terms = excluded.terms,
         updated_at = now()`,
      [
        b.name || "",
        b.phone || "",
        b.address || "",
        b.gstin || "",
        b.state || "Andhra Pradesh",
        b.stateCode || b.state_code || "37",
        b.bankName || b.bank_name || "",
        b.bankBranch || b.bank_branch || "",
        b.bankAcc || b.bank_acc || "",
        b.bankIfsc || b.bank_ifsc || "",
        b.email || "",
        JSON.stringify(b.terms || []),
      ]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bills", requireDb, async (req, res) => {
  try {
    const bill = req.body;
    await pool.query(
      `insert into invoices (id, invoice_no, invoice_date, bill_name, total_amount, data)
       values ($1, $2, $3, $4, $5, $6::jsonb)
       on conflict (id) do update set
         invoice_no = excluded.invoice_no,
         invoice_date = excluded.invoice_date,
         bill_name = excluded.bill_name,
         total_amount = excluded.total_amount,
         data = excluded.data`,
      [
        bill.id,
        bill.invoiceNo || bill.invoice_no || "",
        bill.invoiceDate || bill.invoice_date || "",
        bill.billName || bill.bill_name || "",
        bill.totalAmount || bill.total_amount || 0,
        JSON.stringify(bill.data || bill),
      ]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/bills/:id", requireDb, async (req, res) => {
  try {
    await pool.query("delete from invoices where id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

initDb().finally(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
