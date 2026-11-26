(() => {
  "use strict";

  const STORAGE_KEYS = {
    BUSINESS: "gst_bill_business_v1",
    CATALOG: "gst_bill_catalog_v1",
    PARTIES: "gst_bill_parties_v1",
    INVOICE: "gst_bill_current_v1",
    SAVED_BILLS: "gst_bill_saved_bills_v1",
  };

  const INDIAN_STATES = [
    { code: "37", name: "Andhra Pradesh", short: "AP" },
    { code: "36", name: "Telangana", short: "TS" },
    { code: "33", name: "Tamil Nadu", short: "TN" },
    { code: "29", name: "Karnataka", short: "KA" },
    { code: "32", name: "Kerala", short: "KL" },
    { code: "27", name: "Maharashtra", short: "MH" },
    { code: "24", name: "Gujarat", short: "GJ" },
    { code: "07", name: "Delhi", short: "DL" },
    { code: "09", name: "Uttar Pradesh", short: "UP" },
    { code: "19", name: "West Bengal", short: "WB" },
    { code: "21", name: "Odisha", short: "OD" },
    { code: "23", name: "Madhya Pradesh", short: "MP" },
    { code: "08", name: "Rajasthan", short: "RJ" },
    { code: "03", name: "Punjab", short: "PB" },
    { code: "06", name: "Haryana", short: "HR" },
    { code: "10", name: "Bihar", short: "BR" },
    { code: "18", name: "Assam", short: "AS" },
    { code: "34", name: "Puducherry", short: "PY" },
  ];

  const PRESET_LISTS = {
    hsn: ["3302", "2106", "1701", "0804", "3923", "2202"],
    uom: ["5kg", "1kg", "500g", "250g", "10kg", "25kg", "Box", "Nos", "Pcs", "Ltr"],
    rates: ["2250", "3150", "2600", "650", "500", "1000", "1500", "2000", "3000"],
    transportModes: [
      "Kaleswari Lorry",
      "Navata Transport",
      "VRL Logistics",
      "Kranthi Transport",
      "Self Pickup",
      "Auto / Van",
    ],
    vehicleNos: ["", "AP 16 TX 1234", "AP 39 UB 5678", "TS 08 UA 9012"],
    placesOfSupply: [
      "VJA",
      "Gajuwaka",
      "Visakhapatnam",
      "Guntur",
      "Rajahmundry",
      "Hyderabad",
      "Tirupati",
    ],
  };

  const DEFAULT_BUSINESS = {
    name: "SRI SADGURU AGENCIES",
    phone: "9440137411",
    address: "D.No. 32-30-2/1, Behind Ravindra Bharathi School, Maruthi Nagar, Eluru Road, VIJAYAWADA - 520 004.",
    gstin: "37BAGPK7811N1Z9",
    state: "Andhra Pradesh",
    stateCode: "37",
    bankName: "UNION BANK OF INDIA",
    bankBranch: "Seetharampuram, VJA",
    bankAcc: "051011100002485",
    bankIfsc: "UBIN0805106",
    email: "kemburu_1977@rediffmail.com",
    terms: [
      "Goods once sold cannot be taken back",
      "All disputes are subject to Vijayawada Jurisdiction.",
    ],
  };

  const DEFAULT_CATALOG = [
    {
      id: "item-pineapple",
      name: "Pineapple (INT Emu KP 1504)",
      hsn: "3302",
      uom: "5kg",
      rate: 2250,
      cgst: 9,
      sgst: 9,
      igst: 18,
    },
    {
      id: "item-grape",
      name: "Grape SPL",
      hsn: "3302",
      uom: "5kg",
      rate: 3150,
      cgst: 9,
      sgst: 9,
      igst: 18,
    },
    {
      id: "item-mango",
      name: "Mango Essence SPL",
      hsn: "3302",
      uom: "5kg",
      rate: 2600,
      cgst: 9,
      sgst: 9,
      igst: 18,
    },
    {
      id: "item-orange",
      name: "Orange Flavour Conc.",
      hsn: "3302",
      uom: "1kg",
      rate: 650,
      cgst: 9,
      sgst: 9,
      igst: 18,
    },
  ];

  const DEFAULT_PARTIES = [
    {
      id: "party-varaprasad",
      name: "K. Varaprasad",
      address: "GAJUWAKA",
      gstin: "",
      state: "AP",
      stateCode: "37",
    },
    {
      id: "party-sri-lakshmi",
      name: "Sri Lakshmi Traders",
      address: "Governorpet, VIJAYAWADA",
      gstin: "37AABCU9603R1ZM",
      state: "AP",
      stateCode: "37",
    },
  ];

  function formatShortDate(dateObj) {
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yy = String(dateObj.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  }

  function createSampleInvoice() {
    return {
      invoiceNo: "634",
      invoiceDate: "31/10/26",
      payMode: "Cash / Credit",
      reverseCharge: "No",
      transportMode: "Kaleswari Lorry",
      vehicleNo: "",
      supplyDate: "31/10/26",
      placeOfSupply: "VJA",
      billName: "K. Varaprasad",
      billAddress: "GAJUWAKA",
      billGstin: "",
      billStateCode: "37",
      sameAsBilled: true,
      shipName: "K. Varaprasad",
      shipAddress: "GAJUWAKA",
      shipGstin: "",
      shipState: "AP",
      shipStateCode: "37",
      roundOffMode: "0",
      roundOff: 0,
      minRows: 13,
      items: [
        {
          name: "Pineapple (INT Emu KP 1504)",
          hsn: "3302",
          uom: "5kg",
          qty: 10,
          rate: 2250,
          gstType: "cgst_sgst",
          cgst: 9,
          sgst: 9,
          igst: 0,
        },
        {
          name: "Grape SPL",
          hsn: "3302",
          uom: "5kg",
          qty: 4,
          rate: 3150,
          gstType: "cgst_sgst",
          cgst: 9,
          sgst: 9,
          igst: 0,
        },
      ],
    };
  }

  function createBlankInvoice() {
    const todayStr = formatShortDate(new Date());
    return {
      invoiceNo: "",
      invoiceDate: todayStr,
      payMode: "Cash / Credit",
      reverseCharge: "No",
      transportMode: "Kaleswari Lorry",
      vehicleNo: "",
      supplyDate: todayStr,
      placeOfSupply: "VJA",
      billName: "",
      billAddress: "",
      billGstin: "",
      billStateCode: "37",
      sameAsBilled: true,
      shipName: "",
      shipAddress: "",
      shipGstin: "",
      shipState: "AP",
      shipStateCode: "37",
      roundOffMode: "0",
      roundOff: 0,
      minRows: 13,
      items: [],
    };
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : structuredClone(fallback);
    } catch {
      return structuredClone(fallback);
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage quota errors
    }
  }

  let business = loadJson(STORAGE_KEYS.BUSINESS, DEFAULT_BUSINESS);
  let catalog = loadJson(STORAGE_KEYS.CATALOG, DEFAULT_CATALOG);
  let parties = loadJson(STORAGE_KEYS.PARTIES, DEFAULT_PARTIES);
  let invoice = loadJson(STORAGE_KEYS.INVOICE, createSampleInvoice());
  let savedBills = loadJson(STORAGE_KEYS.SAVED_BILLS, []);
  let dbConnected = false;

  const $ = (id) => document.getElementById(id);

  function setDbStatusBadge(connected, label) {
    dbConnected = connected;
    const badge = $("dbStatusBadge");
    if (!badge) return;
    badge.classList.toggle("db-connected", connected);
    badge.classList.toggle("db-local", !connected);
    badge.textContent = label || (connected ? "DB: Neon" : "DB: Local");
  }

  async function apiRequest(path, options = {}) {
    const res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }

  function mapTableToEndpoint(table) {
    if (table === "items") return "/api/items";
    if (table === "parties") return "/api/parties";
    if (table === "business_settings") return "/api/business";
    if (table === "invoices") return "/api/bills";
    return `/api/${table}`;
  }

  async function dbUpsert(table, rows) {
    if (!dbConnected) return;
    try {
      const endpoint = mapTableToEndpoint(table);
      const payload = table === "business_settings" ? rows[0] : rows;
      await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn(`DB upsert failed for ${table}:`, err.message);
    }
  }

  async function dbDelete(table, id) {
    if (!dbConnected) return;
    try {
      const endpoint = mapTableToEndpoint(table);
      await apiRequest(`${endpoint}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn(`DB delete failed for ${table}:`, err.message);
    }
  }

  async function syncFromDatabase() {
    try {
      const health = await apiRequest("/api/health");
      if (!health || !health.dbConnected) {
        setDbStatusBadge(false, "DB: Local");
        return false;
      }

      const data = await apiRequest("/api/sync");
      if (Array.isArray(data.items) && data.items.length > 0) {
        catalog = data.items;
        saveJson(STORAGE_KEYS.CATALOG, catalog);
        renderCatalogDropdown();
      }
      if (Array.isArray(data.parties) && data.parties.length > 0) {
        parties = data.parties;
        saveJson(STORAGE_KEYS.PARTIES, parties);
        renderPartyDropdowns();
      }
      if (data.business) {
        business = data.business;
        saveJson(STORAGE_KEYS.BUSINESS, business);
        renderBusinessDetails();
      }
      if (Array.isArray(data.bills)) {
        savedBills = data.bills;
        saveJson(STORAGE_KEYS.SAVED_BILLS, savedBills);
      }

      setDbStatusBadge(true, "DB: Neon");
      return true;
    } catch {
      setDbStatusBadge(false, "DB: Local");
      return false;
    }
  }

  async function pushAllLocalToDb() {
    await apiRequest("/api/items", { method: "POST", body: JSON.stringify(catalog) });
    await apiRequest("/api/parties", { method: "POST", body: JSON.stringify(parties) });
    await apiRequest("/api/business", { method: "POST", body: JSON.stringify(business) });
    return true;
  }

  function formatMoney(num, decimals = 2) {
    const value = Number(num) || 0;
    return value.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  function formatCompact(num) {
    const value = Number(num) || 0;
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }

  function numberToIndianWords(amount) {
    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ];
    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];

    function twoDigits(n) {
      if (n < 20) return ones[n];
      const t = Math.floor(n / 10);
      const o = n % 10;
      return tens[t] + (o ? " " + ones[o] : "");
    }

    function threeDigits(n) {
      const h = Math.floor(n / 100);
      const rem = n % 100;
      let str = "";
      if (h) str += ones[h] + " hundred";
      if (rem) str += (str ? " " : "") + twoDigits(rem);
      return str;
    }

    const rounded = Math.round((Number(amount) || 0) * 100) / 100;
    const whole = Math.floor(rounded);
    const paise = Math.round((rounded - whole) * 100);

    if (whole === 0 && paise === 0) return "Zero only";

    let n = whole;
    const parts = [];

    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    if (crore) parts.push(twoDigits(crore) + " crore");

    const lakh = Math.floor(n / 100000);
    n %= 100000;
    if (lakh) parts.push(twoDigits(lakh) + " lakh");

    const thousand = Math.floor(n / 1000);
    n %= 1000;
    if (thousand) parts.push(twoDigits(thousand) + " thousand");

    if (n) parts.push(threeDigits(n));

    let result = parts.join(" ");
    if (paise > 0) {
      result += (result ? " and " : "") + twoDigits(paise) + " paise";
    }
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase() + " only";
  }

  /**
   * Populates a <select> with string options + "+ Custom..." and wires a custom input.
   */
  function initSmartDropdown(selectId, customInputId, options, customLabel, onValueChange) {
    const sel = $(selectId);
    const customInput = $(customInputId);

    sel.innerHTML = "";
    options.forEach((val) => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val === "" ? "(None)" : val;
      sel.appendChild(opt);
    });

    const customOpt = document.createElement("option");
    customOpt.value = "__custom__";
    customOpt.textContent = customLabel;
    sel.appendChild(customOpt);

    sel.addEventListener("change", () => {
      const isCustom = sel.value === "__custom__";
      customInput.classList.toggle("hidden", !isCustom);
      if (isCustom) {
        customInput.focus();
      }
      onValueChange(getSmartValue(selectId, customInputId));
    });

    customInput.addEventListener("input", () => {
      onValueChange(getSmartValue(selectId, customInputId));
    });
  }

  function getSmartValue(selectId, customInputId) {
    const sel = $(selectId);
    if (sel.value === "__custom__") {
      return $(customInputId).value;
    }
    return sel.value;
  }

  function setSmartValue(selectId, customInputId, value) {
    const sel = $(selectId);
    const customInput = $(customInputId);
    const strVal = value == null ? "" : String(value);
    const hasOption = Array.from(sel.options).some(
      (opt) => opt.value !== "__custom__" && opt.value === strVal
    );

    if (hasOption) {
      sel.value = strVal;
      customInput.classList.add("hidden");
    } else {
      sel.value = "__custom__";
      customInput.value = strVal;
      customInput.classList.remove("hidden");
    }
  }

  function populateStateDropdown(selectId) {
    const sel = $(selectId);
    sel.innerHTML = "";
    INDIAN_STATES.forEach((st) => {
      const opt = document.createElement("option");
      opt.value = st.code;
      opt.textContent = `${st.code} - ${st.name} (${st.short})`;
      sel.appendChild(opt);
    });
  }

  function findStateByCode(code) {
    return INDIAN_STATES.find((s) => s.code === String(code)) || INDIAN_STATES[0];
  }

  function renderBusinessDetails() {
    $("viewCompanyPhone").textContent = business.phone;
    $("viewCompanyName").textContent = business.name;
    $("viewCompanyAddress").textContent = business.address;
    $("viewCompanyGstin").textContent = business.gstin;
    $("viewCompanyState").textContent = business.state;
    $("viewCompanyStateCode").textContent = business.stateCode;
    $("viewBankName").textContent = business.bankName;
    $("viewBankBranch").textContent = business.bankBranch;
    $("viewBankAcc").textContent = business.bankAcc;
    $("viewBankIfsc").textContent = business.bankIfsc;
    $("viewCompanyEmail").textContent = business.email;
    $("viewSignatoryCompany").textContent = business.name;

    const termsList = $("viewTermsList");
    termsList.innerHTML = "";
    (business.terms || []).forEach((line) => {
      if (!line.trim()) return;
      const li = document.createElement("li");
      li.textContent = line.trim();
      termsList.appendChild(li);
    });
  }

  function renderCatalogDropdown() {
    const select = $("itemSelect");
    const prevVal = select.value;
    select.innerHTML = '<option value="">-- Choose an item --</option>';

    catalog.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = `${item.name} (${item.uom}) - ₹${item.rate}`;
      select.appendChild(opt);
    });

    if (catalog.some((i) => i.id === prevVal)) {
      select.value = prevVal;
    }
  }

  function renderPartyDropdowns() {
    ["partySelect", "shipPartySelect"].forEach((selectId) => {
      const select = $(selectId);
      const prevVal = select.value;
      select.innerHTML = '<option value="">-- Choose saved party --</option>';

      parties.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.name} - ${p.address}`;
        select.appendChild(opt);
      });

      if (parties.some((p) => p.id === prevVal)) {
        select.value = prevVal;
      }
    });
  }

  function renderCatalogTable() {
    const tbody = $("catalogTableBody");
    tbody.innerHTML = "";

    catalog.forEach((item, index) => {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = item.name;

      const tdHsn = document.createElement("td");
      tdHsn.textContent = item.hsn;

      const tdUom = document.createElement("td");
      tdUom.textContent = item.uom;

      const tdRate = document.createElement("td");
      tdRate.textContent = `₹${formatMoney(item.rate)}`;

      const tdGst = document.createElement("td");
      tdGst.textContent = `${item.cgst}% / ${item.sgst}% / ${item.igst}%`;

      const tdAct = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn-danger-sm";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => {
        const removed = catalog.splice(index, 1)[0];
        saveJson(STORAGE_KEYS.CATALOG, catalog);
        renderCatalogDropdown();
        renderCatalogTable();
        if (removed) dbDelete("items", removed.id);
      });
      tdAct.appendChild(delBtn);

      tr.append(tdName, tdHsn, tdUom, tdRate, tdGst, tdAct);
      tbody.appendChild(tr);
    });
  }

  function renderPartiesTable() {
    const tbody = $("partiesTableBody");
    tbody.innerHTML = "";

    parties.forEach((p, index) => {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = p.name;

      const tdAddr = document.createElement("td");
      tdAddr.textContent = p.address;

      const tdGstin = document.createElement("td");
      tdGstin.textContent = p.gstin || "-";

      const tdCode = document.createElement("td");
      tdCode.textContent = `${p.stateCode} (${p.state})`;

      const tdAct = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn-danger-sm";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => {
        const removed = parties.splice(index, 1)[0];
        saveJson(STORAGE_KEYS.PARTIES, parties);
        renderPartyDropdowns();
        renderPartiesTable();
        if (removed) dbDelete("parties", removed.id);
      });
      tdAct.appendChild(delBtn);

      tr.append(tdName, tdAddr, tdGstin, tdCode, tdAct);
      tbody.appendChild(tr);
    });
  }

  function renderSavedBillsTable() {
    const tbody = $("savedBillsTableBody");
    tbody.innerHTML = "";

    if (savedBills.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "No saved bills yet. Click 'Save Bill' to store the current bill.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    savedBills.forEach((b, index) => {
      const tr = document.createElement("tr");

      const tdNo = document.createElement("td");
      tdNo.textContent = b.invoiceNo || "-";

      const tdDate = document.createElement("td");
      tdDate.textContent = b.invoiceDate || "-";

      const tdName = document.createElement("td");
      tdName.textContent = b.billName || "-";

      const tdAmt = document.createElement("td");
      tdAmt.textContent = `₹${formatMoney(b.totalAmount || 0)}`;

      const tdAct = document.createElement("td");
      tdAct.style.display = "flex";
      tdAct.style.gap = "6px";

      const loadBtn = document.createElement("button");
      loadBtn.type = "button";
      loadBtn.className = "btn-mini";
      loadBtn.textContent = "Load";
      loadBtn.addEventListener("click", () => {
        invoice = structuredClone(b.data);
        syncFormInputsFromInvoice();
        renderInvoice();
        $("billsModal").classList.add("hidden");
      });

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn-danger-sm";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => {
        const removed = savedBills.splice(index, 1)[0];
        saveJson(STORAGE_KEYS.SAVED_BILLS, savedBills);
        renderSavedBillsTable();
        if (removed) dbDelete("invoices", removed.id);
      });

      tdAct.append(loadBtn, delBtn);
      tr.append(tdNo, tdDate, tdName, tdAmt, tdAct);
      tbody.appendChild(tr);
    });
  }

  function renderGstinBoxes(gstinStr) {
    const container = $("viewBillGstinBoxes");
    container.innerHTML = "";
    const clean = (gstinStr || "").toUpperCase().padEnd(15, " ").slice(0, 15);
    for (let i = 0; i < 15; i += 1) {
      const box = document.createElement("span");
      box.className = "gstin-cell";
      box.textContent = clean[i].trim();
      container.appendChild(box);
    }
  }

  function syncFormInputsFromInvoice() {
    $("inputInvoiceNo").value = invoice.invoiceNo;

    // Invoice Date Preset
    const todayStr = formatShortDate(new Date());
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const yestStr = formatShortDate(yest);

    if (invoice.invoiceDate === todayStr) {
      $("invoiceDatePreset").value = "today";
      $("inputInvoiceDatePicker").classList.add("hidden");
    } else if (invoice.invoiceDate === yestStr) {
      $("invoiceDatePreset").value = "yesterday";
      $("inputInvoiceDatePicker").classList.add("hidden");
    } else if (invoice.invoiceDate === "31/10/26") {
      $("invoiceDatePreset").value = "sample";
      $("inputInvoiceDatePicker").classList.add("hidden");
    } else {
      $("invoiceDatePreset").value = "__custom__";
      $("inputInvoiceDatePicker").classList.remove("hidden");
    }

    $("inputPayMode").value = invoice.payMode;
    $("inputReverseCharge").value = invoice.reverseCharge;

    setSmartValue("transportModeSelect", "transportModeCustom", invoice.transportMode);
    setSmartValue("vehicleNoSelect", "vehicleNoCustom", invoice.vehicleNo);
    setSmartValue("placeOfSupplySelect", "placeOfSupplyCustom", invoice.placeOfSupply);

    if (invoice.supplyDate === invoice.invoiceDate) {
      $("supplyDatePreset").value = "same";
      $("supplyDateCustom").classList.add("hidden");
    } else {
      $("supplyDatePreset").value = "__custom__";
      $("supplyDateCustom").value = invoice.supplyDate;
      $("supplyDateCustom").classList.remove("hidden");
    }

    $("inputBillName").value = invoice.billName;
    $("inputBillAddress").value = invoice.billAddress;
    $("inputBillGstin").value = invoice.billGstin;
    $("billStateSelect").value = invoice.billStateCode || "37";

    $("sameAsBilledToggle").checked = invoice.sameAsBilled;
    $("shippedToFields").classList.toggle("hidden", invoice.sameAsBilled);

    $("inputShipName").value = invoice.shipName;
    $("inputShipAddress").value = invoice.shipAddress;
    $("inputShipGstin").value = invoice.shipGstin;
    $("shipStateSelect").value = invoice.shipStateCode || "37";

    $("roundOffMode").value = invoice.roundOffMode || "0";
    $("inputRoundOffCustom").classList.toggle("hidden", $("roundOffMode").value !== "__custom__");
    $("inputRoundOffCustom").value = invoice.roundOff || 0;
    $("inputEmptyRows").value = String(invoice.minRows || 13);
  }

  function renderInvoice() {
    saveJson(STORAGE_KEYS.INVOICE, invoice);

    $("viewPayMode").textContent = invoice.payMode;
    $("viewInvoiceNo").textContent = invoice.invoiceNo;
    $("viewInvoiceDate").textContent = invoice.invoiceDate;
    $("viewReverseCharge").textContent = `(${invoice.reverseCharge})`;
    $("viewTransportMode").textContent = invoice.transportMode;
    $("viewVehicleNo").textContent = invoice.vehicleNo;
    $("viewSupplyDate").textContent = invoice.supplyDate;
    $("viewPlaceOfSupply").textContent = invoice.placeOfSupply;

    $("viewBillName").textContent = invoice.billName;
    $("viewBillAddress").textContent = invoice.billAddress;
    renderGstinBoxes(invoice.billGstin);
    $("viewBillStateCode").textContent = invoice.billStateCode;

    const billStateObj = findStateByCode(invoice.billStateCode);
    const shipName = invoice.sameAsBilled ? invoice.billName : invoice.shipName;
    const shipAddress = invoice.sameAsBilled ? invoice.billAddress : invoice.shipAddress;
    const shipGstin = invoice.sameAsBilled ? invoice.billGstin : invoice.shipGstin;
    const shipState = invoice.sameAsBilled ? billStateObj.short : invoice.shipState;
    const shipStateCode = invoice.sameAsBilled ? invoice.billStateCode : invoice.shipStateCode;

    $("viewShipName").textContent = shipName;
    $("viewShipAddress").textContent = shipAddress;
    $("viewShipGstin").textContent = shipGstin;
    $("viewShipState").textContent = shipState;
    $("viewShipStateCode").textContent = shipStateCode;

    const tbody = $("invoiceItemsBody");
    tbody.innerHTML = "";

    let totalTaxable = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    invoice.items.forEach((item, index) => {
      const qty = Number(item.qty) || 0;
      const rate = Number(item.rate) || 0;
      const taxable = qty * rate;
      const cgstAmt = item.gstType === "cgst_sgst" ? taxable * ((Number(item.cgst) || 0) / 100) : 0;
      const sgstAmt = item.gstType === "cgst_sgst" ? taxable * ((Number(item.sgst) || 0) / 100) : 0;
      const igstAmt = item.gstType === "igst" ? taxable * ((Number(item.igst) || 0) / 100) : 0;

      totalTaxable += taxable;
      totalCgst += cgstAmt;
      totalSgst += sgstAmt;
      totalIgst += igstAmt;

      const tr = document.createElement("tr");
      const cells = [
        { text: String(index + 1), cls: "center" },
        { text: item.name, cls: "" },
        { text: item.hsn, cls: "center" },
        { text: item.uom, cls: "center" },
        { text: formatCompact(qty), cls: "center" },
        { text: formatCompact(rate), cls: "num" },
        { text: formatCompact(taxable), cls: "num" },
        { text: item.gstType === "cgst_sgst" ? formatCompact(item.cgst) : "", cls: "center" },
        { text: item.gstType === "cgst_sgst" ? formatCompact(cgstAmt) : "", cls: "num" },
        { text: item.gstType === "cgst_sgst" ? formatCompact(item.sgst) : "", cls: "center" },
        { text: item.gstType === "cgst_sgst" ? formatCompact(sgstAmt) : "", cls: "num" },
        { text: item.gstType === "igst" ? formatCompact(item.igst) : "", cls: "center" },
        { text: item.gstType === "igst" ? formatCompact(igstAmt) : "", cls: "num" },
      ];

      cells.forEach((c) => {
        const td = document.createElement("td");
        td.className = c.cls;
        td.textContent = c.text;
        tr.appendChild(td);
      });

      const tdAction = document.createElement("td");
      tdAction.className = "center no-print";
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn-danger-sm";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        invoice.items.splice(index, 1);
        renderInvoice();
      });
      tdAction.appendChild(removeBtn);
      tr.appendChild(tdAction);

      tbody.appendChild(tr);
    });

    const minRows = Math.max(5, Math.min(20, Number(invoice.minRows) || 13));
    const emptyCount = Math.max(0, minRows - invoice.items.length);
    for (let i = 0; i < emptyCount; i += 1) {
      const tr = document.createElement("tr");
      for (let c = 0; c < 14; c += 1) {
        const td = document.createElement("td");
        if (c === 13) td.className = "no-print";
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    $("totalTaxableCell").textContent = formatCompact(totalTaxable);
    $("totalCgstCell").textContent = totalCgst > 0 ? formatCompact(totalCgst) : "";
    $("totalSgstCell").textContent = totalSgst > 0 ? formatCompact(totalSgst) : "";
    $("totalIgstCell").textContent = totalIgst > 0 ? formatCompact(totalIgst) : "";

    const totalGst = totalCgst + totalSgst + totalIgst;
    const rawTotal = totalTaxable + totalGst;

    let roundOff = 0;
    if (invoice.roundOffMode === "auto") {
      roundOff = Math.round(rawTotal) - rawTotal;
    } else if (invoice.roundOffMode === "__custom__") {
      roundOff = Number(invoice.roundOff) || 0;
    }

    const grandTotal = rawTotal + roundOff;

    $("sumBeforeTax").textContent = formatMoney(totalTaxable);
    $("sumCgst").textContent = totalCgst > 0 ? formatMoney(totalCgst) : "";
    $("sumSgst").textContent = totalSgst > 0 ? formatMoney(totalSgst) : "";
    $("sumIgst").textContent = totalIgst > 0 ? formatMoney(totalIgst) : "";
    $("sumRoundOff").textContent = Math.abs(roundOff) >= 0.005 ? formatMoney(roundOff) : "";
    $("sumTotalGst").textContent = formatMoney(totalGst);
    $("sumAfterTax").textContent = formatMoney(grandTotal);
    $("viewAmountWords").textContent = numberToIndianWords(grandTotal);
  }

  function updateLiveItemPreview() {
    const qty = Number(getSmartValue("itemQtySelect", "itemQtyCustom")) || 0;
    const rate = Number(getSmartValue("itemRateSelect", "itemRateCustom")) || 0;
    const taxable = qty * rate;
    const gstType = $("itemGstType").value;

    let tax = 0;
    if (gstType === "cgst_sgst") {
      const cgst = Number($("itemCgst").value) || 0;
      const sgst = Number($("itemSgst").value) || 0;
      tax = taxable * ((cgst + sgst) / 100);
    } else {
      const igst = Number($("itemIgst").value) || 0;
      tax = taxable * (igst / 100);
    }

    const total = taxable + tax;
    $("liveItemPreview").textContent =
      `Taxable: ₹${formatMoney(taxable)} | Tax: ₹${formatMoney(tax)} | Total: ₹${formatMoney(total)}`;
  }

  function setupAllDropdowns() {
    populateStateDropdown("billStateSelect");
    populateStateDropdown("shipStateSelect");
    populateStateDropdown("partyFormState");
    populateStateDropdown("bizStateSelect");

    initSmartDropdown("itemHsnSelect", "itemHsnCustom", PRESET_LISTS.hsn, "+ Custom HSN...", () => {});
    initSmartDropdown("itemUomSelect", "itemUomCustom", PRESET_LISTS.uom, "+ Custom UOM...", () => {});
    initSmartDropdown(
      "itemRateSelect",
      "itemRateCustom",
      PRESET_LISTS.rates,
      "+ Custom Rate...",
      updateLiveItemPreview
    );

    initSmartDropdown(
      "transportModeSelect",
      "transportModeCustom",
      PRESET_LISTS.transportModes,
      "+ Custom Transport...",
      (val) => {
        invoice.transportMode = val;
        renderInvoice();
      }
    );

    initSmartDropdown(
      "vehicleNoSelect",
      "vehicleNoCustom",
      PRESET_LISTS.vehicleNos,
      "+ Custom Vehicle...",
      (val) => {
        invoice.vehicleNo = val;
        renderInvoice();
      }
    );

    initSmartDropdown(
      "placeOfSupplySelect",
      "placeOfSupplyCustom",
      PRESET_LISTS.placesOfSupply,
      "+ Custom Place...",
      (val) => {
        invoice.placeOfSupply = val;
        renderInvoice();
      }
    );
  }

  function bindEvents() {
    // Qty dropdown + custom
    $("itemQtySelect").addEventListener("change", () => {
      const isCustom = $("itemQtySelect").value === "__custom__";
      $("itemQtyCustom").classList.toggle("hidden", !isCustom);
      if (isCustom) $("itemQtyCustom").focus();
      updateLiveItemPreview();
    });
    $("itemQtyCustom").addEventListener("input", updateLiveItemPreview);

    // Item selection auto-fills rate, HSN, UOM, GST dropdowns
    $("itemSelect").addEventListener("change", (e) => {
      const item = catalog.find((i) => i.id === e.target.value);
      if (item) {
        setSmartValue("itemRateSelect", "itemRateCustom", item.rate);
        setSmartValue("itemHsnSelect", "itemHsnCustom", item.hsn);
        setSmartValue("itemUomSelect", "itemUomCustom", item.uom);
        $("itemCgst").value = String(item.cgst);
        $("itemSgst").value = String(item.sgst);
        $("itemIgst").value = String(item.igst);
      }
      updateLiveItemPreview();
    });

    $("itemGstType").addEventListener("change", (e) => {
      const isIgst = e.target.value === "igst";
      $("cgstSgstInputs").classList.toggle("hidden", isIgst);
      $("igstInputGroup").classList.toggle("hidden", !isIgst);
      updateLiveItemPreview();
    });

    ["itemCgst", "itemSgst", "itemIgst"].forEach((id) => {
      $(id).addEventListener("change", updateLiveItemPreview);
    });

    $("addItemBtn").addEventListener("click", () => {
      const selected = catalog.find((i) => i.id === $("itemSelect").value);
      const name = selected ? selected.name : prompt("Enter item description:");
      if (!name || !name.trim()) return;

      const qty = Number(getSmartValue("itemQtySelect", "itemQtyCustom")) || 1;
      const rate = Number(getSmartValue("itemRateSelect", "itemRateCustom")) || 0;
      const hsn = getSmartValue("itemHsnSelect", "itemHsnCustom").trim();
      const uom = getSmartValue("itemUomSelect", "itemUomCustom").trim();
      const gstType = $("itemGstType").value;

      invoice.items.push({
        name: name.trim(),
        hsn,
        uom,
        qty,
        rate,
        gstType,
        cgst: gstType === "cgst_sgst" ? Number($("itemCgst").value) || 0 : 0,
        sgst: gstType === "cgst_sgst" ? Number($("itemSgst").value) || 0 : 0,
        igst: gstType === "igst" ? Number($("itemIgst").value) || 0 : 0,
      });

      renderInvoice();
    });

    // Invoice No +1 button
    $("nextInvoiceNoBtn").addEventListener("click", () => {
      const current = parseInt($("inputInvoiceNo").value, 10);
      const next = Number.isFinite(current) ? current + 1 : 1;
      $("inputInvoiceNo").value = String(next);
      invoice.invoiceNo = String(next);
      renderInvoice();
    });

    // Invoice Date Preset Dropdown
    $("invoiceDatePreset").addEventListener("change", (e) => {
      const val = e.target.value;
      const picker = $("inputInvoiceDatePicker");
      picker.classList.toggle("hidden", val !== "__custom__");

      if (val === "today") {
        invoice.invoiceDate = formatShortDate(new Date());
      } else if (val === "yesterday") {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        invoice.invoiceDate = formatShortDate(d);
      } else if (val === "sample") {
        invoice.invoiceDate = "31/10/26";
      }

      if ($("supplyDatePreset").value === "same") {
        invoice.supplyDate = invoice.invoiceDate;
      }
      renderInvoice();
    });

    $("inputInvoiceDatePicker").addEventListener("change", (e) => {
      if (!e.target.value) return;
      const [yyyy, mm, dd] = e.target.value.split("-");
      invoice.invoiceDate = `${dd}/${mm}/${yyyy.slice(-2)}`;
      if ($("supplyDatePreset").value === "same") {
        invoice.supplyDate = invoice.invoiceDate;
      }
      renderInvoice();
    });

    // Supply Date Preset Dropdown
    $("supplyDatePreset").addEventListener("change", (e) => {
      const val = e.target.value;
      const custom = $("supplyDateCustom");
      custom.classList.toggle("hidden", val !== "__custom__");
      if (val === "same") {
        invoice.supplyDate = invoice.invoiceDate;
      } else if (val === "today") {
        invoice.supplyDate = formatShortDate(new Date());
      } else {
        custom.focus();
      }
      renderInvoice();
    });

    $("supplyDateCustom").addEventListener("input", (e) => {
      invoice.supplyDate = e.target.value;
      renderInvoice();
    });

    // Party Dropdowns
    $("partySelect").addEventListener("change", (e) => {
      const party = parties.find((p) => p.id === e.target.value);
      if (!party) return;
      invoice.billName = party.name;
      invoice.billAddress = party.address;
      invoice.billGstin = party.gstin || "";
      invoice.billStateCode = party.stateCode || "37";
      syncFormInputsFromInvoice();
      renderInvoice();
    });

    $("shipPartySelect").addEventListener("change", (e) => {
      const party = parties.find((p) => p.id === e.target.value);
      if (!party) return;
      invoice.shipName = party.name;
      invoice.shipAddress = party.address;
      invoice.shipGstin = party.gstin || "";
      invoice.shipState = party.state || "AP";
      invoice.shipStateCode = party.stateCode || "37";
      syncFormInputsFromInvoice();
      renderInvoice();
    });

    $("saveCurrentPartyBtn").addEventListener("click", () => {
      const name = $("inputBillName").value.trim();
      const address = $("inputBillAddress").value.trim();
      if (!name) return;
      const st = findStateByCode($("billStateSelect").value);
      parties.push({
        id: "party-" + Date.now(),
        name,
        address,
        gstin: $("inputBillGstin").value.trim().toUpperCase(),
        state: st.short,
        stateCode: st.code,
      });
      saveJson(STORAGE_KEYS.PARTIES, parties);
      renderPartyDropdowns();
    });

    // State Dropdowns
    $("billStateSelect").addEventListener("change", (e) => {
      invoice.billStateCode = e.target.value;
      renderInvoice();
    });

    $("shipStateSelect").addEventListener("change", (e) => {
      const st = findStateByCode(e.target.value);
      invoice.shipStateCode = st.code;
      invoice.shipState = st.short;
      renderInvoice();
    });

    // Round Off Dropdown
    $("roundOffMode").addEventListener("change", (e) => {
      invoice.roundOffMode = e.target.value;
      $("inputRoundOffCustom").classList.toggle("hidden", e.target.value !== "__custom__");
      renderInvoice();
    });

    $("inputRoundOffCustom").addEventListener("input", (e) => {
      invoice.roundOff = Number(e.target.value) || 0;
      renderInvoice();
    });

    // Live binding for remaining inputs/selects
    const fieldMap = [
      ["inputInvoiceNo", "invoiceNo"],
      ["inputPayMode", "payMode"],
      ["inputReverseCharge", "reverseCharge"],
      ["inputBillName", "billName"],
      ["inputBillAddress", "billAddress"],
      ["inputBillGstin", "billGstin"],
      ["inputShipName", "shipName"],
      ["inputShipAddress", "shipAddress"],
      ["inputShipGstin", "shipGstin"],
      ["inputEmptyRows", "minRows"],
    ];

    fieldMap.forEach(([elId, key]) => {
      const evt = $(elId).tagName === "SELECT" ? "change" : "input";
      $(elId).addEventListener(evt, (e) => {
        invoice[key] = e.target.value;
        renderInvoice();
      });
    });

    $("sameAsBilledToggle").addEventListener("change", (e) => {
      invoice.sameAsBilled = e.target.checked;
      $("shippedToFields").classList.toggle("hidden", invoice.sameAsBilled);
      renderInvoice();
    });

    // Paper Theme Toggle
    $("paperThemeToggle").addEventListener("change", (e) => {
      const sheet = $("invoiceSheet");
      sheet.classList.toggle("theme-yellow", e.target.checked);
      sheet.classList.toggle("theme-white", !e.target.checked);
    });

    // Toolbar buttons
    $("printBillBtn").addEventListener("click", () => window.print());

    $("newBillBtn").addEventListener("click", () => {
      invoice = createBlankInvoice();
      syncFormInputsFromInvoice();
      renderInvoice();
    });

    $("loadSampleBtn").addEventListener("click", () => {
      invoice = createSampleInvoice();
      syncFormInputsFromInvoice();
      renderInvoice();
    });

    // Modals
    $("openCatalogBtn").addEventListener("click", () => {
      renderCatalogTable();
      $("catalogModal").classList.remove("hidden");
    });

    $("openPartiesBtn").addEventListener("click", () => {
      renderPartiesTable();
      $("partiesModal").classList.remove("hidden");
    });

    $("openBusinessBtn").addEventListener("click", () => {
      $("bizName").value = business.name;
      $("bizPhone").value = business.phone;
      $("bizAddress").value = business.address;
      $("bizGstin").value = business.gstin;
      $("bizStateSelect").value = business.stateCode || "37";
      $("bizBankName").value = business.bankName;
      $("bizBankBranch").value = business.bankBranch;
      $("bizBankAcc").value = business.bankAcc;
      $("bizBankIfsc").value = business.bankIfsc;
      $("bizEmail").value = business.email;
      $("bizTerms").value = (business.terms || []).join("\n");
      $("businessModal").classList.remove("hidden");
    });

    $("saveBillBtn").addEventListener("click", async () => {
      const totalStr = $("sumAfterTax").textContent.replace(/,/g, "");
      const billRecord = {
        id: "bill-" + Date.now(),
        invoiceNo: invoice.invoiceNo || "NA",
        invoiceDate: invoice.invoiceDate || "",
        billName: invoice.billName || "Cash Customer",
        totalAmount: Number(totalStr) || 0,
        data: structuredClone(invoice),
      };
      savedBills.unshift(billRecord);
      saveJson(STORAGE_KEYS.SAVED_BILLS, savedBills);
      await dbUpsert("invoices", [
        {
          id: billRecord.id,
          invoice_no: billRecord.invoiceNo,
          invoice_date: billRecord.invoiceDate,
          bill_name: billRecord.billName,
          total_amount: billRecord.totalAmount,
          data: billRecord.data,
        },
      ]);
      alert(`Bill #${billRecord.invoiceNo} saved!`);
    });

    $("openBillsBtn").addEventListener("click", () => {
      renderSavedBillsTable();
      $("billsModal").classList.remove("hidden");
    });

    $("openDbBtn").addEventListener("click", async () => {
      const statusEl = $("dbTestStatus");
      statusEl.textContent = "Checking Neon PostgreSQL connection...";
      $("dbModal").classList.remove("hidden");
      const ok = await syncFromDatabase();
      statusEl.textContent = ok
        ? "Connected to Neon PostgreSQL."
        : "Not connected to Neon (running in Local mode). Set DATABASE_URL on Render.";
    });

    $("dbRefreshBtn").addEventListener("click", async () => {
      const statusEl = $("dbTestStatus");
      statusEl.textContent = "Syncing with Neon PostgreSQL...";
      const ok = await syncFromDatabase();
      statusEl.textContent = ok
        ? "Synced with Neon PostgreSQL!"
        : "Not connected. Check DATABASE_URL environment variable on Render.";
    });

    $("dbPushLocalBtn").addEventListener("click", async () => {
      const statusEl = $("dbTestStatus");
      statusEl.textContent = "Uploading local items, parties, and business details...";
      try {
        await pushAllLocalToDb();
        setDbStatusBadge(true, "DB: Neon");
        statusEl.textContent = "All local items, parties, and business details uploaded to Neon!";
      } catch (err) {
        statusEl.textContent = `Upload failed: ${err.message}`;
      }
    });

    document.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", () => {
        $(el.dataset.close).classList.add("hidden");
      });
    });

    // Save Catalog Item
    $("catalogForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const newItem = {
        id: "item-" + Date.now(),
        name: $("catName").value.trim(),
        hsn: $("catHsn").value.trim(),
        uom: $("catUom").value.trim(),
        rate: Number($("catRate").value) || 0,
        cgst: Number($("catCgst").value) || 0,
        sgst: Number($("catSgst").value) || 0,
        igst: Number($("catIgst").value) || 0,
      };
      catalog.push(newItem);
      saveJson(STORAGE_KEYS.CATALOG, catalog);
      renderCatalogDropdown();
      renderCatalogTable();
      dbUpsert("items", [newItem]);
      e.target.reset();
      $("catCgst").value = "9";
      $("catSgst").value = "9";
      $("catIgst").value = "18";
    });

    // Save Party
    $("partyForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const st = findStateByCode($("partyFormState").value);
      const newParty = {
        id: "party-" + Date.now(),
        name: $("partyFormName").value.trim(),
        address: $("partyFormAddress").value.trim(),
        gstin: $("partyFormGstin").value.trim().toUpperCase(),
        state: st.short,
        stateCode: st.code,
      };
      parties.push(newParty);
      saveJson(STORAGE_KEYS.PARTIES, parties);
      renderPartyDropdowns();
      renderPartiesTable();
      dbUpsert("parties", [
        {
          id: newParty.id,
          name: newParty.name,
          address: newParty.address,
          gstin: newParty.gstin,
          state: newParty.state,
          state_code: newParty.stateCode,
        },
      ]);
      e.target.reset();
    });

    // Save Business Details
    $("businessForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const st = findStateByCode($("bizStateSelect").value);
      business = {
        name: $("bizName").value.trim(),
        phone: $("bizPhone").value.trim(),
        address: $("bizAddress").value.trim(),
        gstin: $("bizGstin").value.trim().toUpperCase(),
        state: st.name,
        stateCode: st.code,
        bankName: $("bizBankName").value.trim(),
        bankBranch: $("bizBankBranch").value.trim(),
        bankAcc: $("bizBankAcc").value.trim(),
        bankIfsc: $("bizBankIfsc").value.trim().toUpperCase(),
        email: $("bizEmail").value.trim(),
        terms: $("bizTerms").value.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      saveJson(STORAGE_KEYS.BUSINESS, business);
      renderBusinessDetails();
      dbUpsert("business_settings", [
        {
          id: "default",
          name: business.name,
          phone: business.phone,
          address: business.address,
          gstin: business.gstin,
          state: business.state,
          state_code: business.stateCode,
          bank_name: business.bankName,
          bank_branch: business.bankBranch,
          bank_acc: business.bankAcc,
          bank_ifsc: business.bankIfsc,
          email: business.email,
          terms: business.terms,
        },
      ]);
      $("businessModal").classList.add("hidden");
    });

    $("resetBizBtn").addEventListener("click", () => {
      business = structuredClone(DEFAULT_BUSINESS);
      saveJson(STORAGE_KEYS.BUSINESS, business);
      renderBusinessDetails();
      $("businessModal").classList.add("hidden");
    });
  }

  // Initialize
  setupAllDropdowns();
  renderBusinessDetails();
  renderCatalogDropdown();
  renderPartyDropdowns();
  syncFormInputsFromInvoice();
  renderInvoice();
  updateLiveItemPreview();
  bindEvents();
  syncFromDatabase();
})();
