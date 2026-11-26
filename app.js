(() => {
  "use strict";

  const STORAGE_KEYS = {
    BUSINESS: "gst_bill_business_v1",
    CATALOG: "gst_bill_catalog_v1",
    INVOICE: "gst_bill_current_v1",
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
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = String(today.getFullYear()).slice(-2);
    const formattedDate = `${dd}/${mm}/${yy}`;

    return {
      invoiceNo: "",
      invoiceDate: formattedDate,
      payMode: "Cash / Credit",
      reverseCharge: "No",
      transportMode: "",
      vehicleNo: "",
      supplyDate: formattedDate,
      placeOfSupply: "",
      billName: "",
      billAddress: "",
      billGstin: "",
      billStateCode: "",
      sameAsBilled: true,
      shipName: "",
      shipAddress: "",
      shipGstin: "",
      shipState: "",
      shipStateCode: "",
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
  let invoice = loadJson(STORAGE_KEYS.INVOICE, createSampleInvoice());

  const $ = (id) => document.getElementById(id);

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
    result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase() + " only";
    return result;
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
        catalog.splice(index, 1);
        saveJson(STORAGE_KEYS.CATALOG, catalog);
        renderCatalogDropdown();
        renderCatalogTable();
      });
      tdAct.appendChild(delBtn);

      tr.append(tdName, tdHsn, tdUom, tdRate, tdGst, tdAct);
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
    $("inputInvoiceDate").value = invoice.invoiceDate;
    $("inputPayMode").value = invoice.payMode;
    $("inputReverseCharge").value = invoice.reverseCharge;
    $("inputTransportMode").value = invoice.transportMode;
    $("inputVehicleNo").value = invoice.vehicleNo;
    $("inputSupplyDate").value = invoice.supplyDate;
    $("inputPlaceOfSupply").value = invoice.placeOfSupply;

    $("inputBillName").value = invoice.billName;
    $("inputBillAddress").value = invoice.billAddress;
    $("inputBillGstin").value = invoice.billGstin;
    $("inputBillStateCode").value = invoice.billStateCode;

    $("sameAsBilledToggle").checked = invoice.sameAsBilled;
    $("shippedToFields").classList.toggle("hidden", invoice.sameAsBilled);

    $("inputShipName").value = invoice.shipName;
    $("inputShipAddress").value = invoice.shipAddress;
    $("inputShipGstin").value = invoice.shipGstin;
    $("inputShipState").value = invoice.shipState;
    $("inputShipStateCode").value = invoice.shipStateCode;

    $("inputRoundOff").value = invoice.roundOff;
    $("inputEmptyRows").value = invoice.minRows;
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

    const shipName = invoice.sameAsBilled ? invoice.billName : invoice.shipName;
    const shipAddress = invoice.sameAsBilled ? invoice.billAddress : invoice.shipAddress;
    const shipGstin = invoice.sameAsBilled ? invoice.billGstin : invoice.shipGstin;
    const shipState = invoice.sameAsBilled ? (invoice.shipState || "AP") : invoice.shipState;
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

    const roundOff = Number(invoice.roundOff) || 0;
    const totalGst = totalCgst + totalSgst + totalIgst;
    const grandTotal = totalTaxable + totalGst + roundOff;

    $("sumBeforeTax").textContent = formatMoney(totalTaxable);
    $("sumCgst").textContent = totalCgst > 0 ? formatMoney(totalCgst) : "";
    $("sumSgst").textContent = totalSgst > 0 ? formatMoney(totalSgst) : "";
    $("sumIgst").textContent = totalIgst > 0 ? formatMoney(totalIgst) : "";
    $("sumRoundOff").textContent = roundOff !== 0 ? formatMoney(roundOff) : "";
    $("sumTotalGst").textContent = formatMoney(totalGst);
    $("sumAfterTax").textContent = formatMoney(grandTotal);
    $("viewAmountWords").textContent = numberToIndianWords(grandTotal);
  }

  function updateLiveItemPreview() {
    const qty = Number($("itemQty").value) || 0;
    const rate = Number($("itemRate").value) || 0;
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

  function bindEvents() {
    // Dropdown selection auto-fills rate, HSN, UOM, GST
    $("itemSelect").addEventListener("change", (e) => {
      const item = catalog.find((i) => i.id === e.target.value);
      if (item) {
        $("itemRate").value = item.rate;
        $("itemHsn").value = item.hsn;
        $("itemUom").value = item.uom;
        $("itemCgst").value = item.cgst;
        $("itemSgst").value = item.sgst;
        $("itemIgst").value = item.igst;
      }
      updateLiveItemPreview();
    });

    $("itemGstType").addEventListener("change", (e) => {
      const isIgst = e.target.value === "igst";
      $("cgstSgstInputs").classList.toggle("hidden", isIgst);
      $("igstInputGroup").classList.toggle("hidden", !isIgst);
      updateLiveItemPreview();
    });

    ["itemQty", "itemRate", "itemCgst", "itemSgst", "itemIgst"].forEach((id) => {
      $(id).addEventListener("input", updateLiveItemPreview);
    });

    $("addItemBtn").addEventListener("click", () => {
      const selected = catalog.find((i) => i.id === $("itemSelect").value);
      const name = selected ? selected.name : prompt("Enter item description:");
      if (!name || !name.trim()) return;

      const qty = Number($("itemQty").value) || 1;
      const rate = Number($("itemRate").value) || 0;
      const hsn = $("itemHsn").value.trim();
      const uom = $("itemUom").value.trim();
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

    // Live binding for invoice fields
    const fieldMap = [
      ["inputInvoiceNo", "invoiceNo"],
      ["inputInvoiceDate", "invoiceDate"],
      ["inputPayMode", "payMode"],
      ["inputReverseCharge", "reverseCharge"],
      ["inputTransportMode", "transportMode"],
      ["inputVehicleNo", "vehicleNo"],
      ["inputSupplyDate", "supplyDate"],
      ["inputPlaceOfSupply", "placeOfSupply"],
      ["inputBillName", "billName"],
      ["inputBillAddress", "billAddress"],
      ["inputBillGstin", "billGstin"],
      ["inputBillStateCode", "billStateCode"],
      ["inputShipName", "shipName"],
      ["inputShipAddress", "shipAddress"],
      ["inputShipGstin", "shipGstin"],
      ["inputShipState", "shipState"],
      ["inputShipStateCode", "shipStateCode"],
      ["inputRoundOff", "roundOff"],
      ["inputEmptyRows", "minRows"],
    ];

    fieldMap.forEach(([elId, key]) => {
      $(elId).addEventListener("input", (e) => {
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

    $("openBusinessBtn").addEventListener("click", () => {
      $("bizName").value = business.name;
      $("bizPhone").value = business.phone;
      $("bizAddress").value = business.address;
      $("bizGstin").value = business.gstin;
      $("bizState").value = business.state;
      $("bizStateCode").value = business.stateCode;
      $("bizBankName").value = business.bankName;
      $("bizBankBranch").value = business.bankBranch;
      $("bizBankAcc").value = business.bankAcc;
      $("bizBankIfsc").value = business.bankIfsc;
      $("bizEmail").value = business.email;
      $("bizTerms").value = (business.terms || []).join("\n");
      $("businessModal").classList.remove("hidden");
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
      e.target.reset();
      $("catCgst").value = 9;
      $("catSgst").value = 9;
      $("catIgst").value = 18;
    });

    // Save Business Details
    $("businessForm").addEventListener("submit", (e) => {
      e.preventDefault();
      business = {
        name: $("bizName").value.trim(),
        phone: $("bizPhone").value.trim(),
        address: $("bizAddress").value.trim(),
        gstin: $("bizGstin").value.trim().toUpperCase(),
        state: $("bizState").value.trim(),
        stateCode: $("bizStateCode").value.trim(),
        bankName: $("bizBankName").value.trim(),
        bankBranch: $("bizBankBranch").value.trim(),
        bankAcc: $("bizBankAcc").value.trim(),
        bankIfsc: $("bizBankIfsc").value.trim().toUpperCase(),
        email: $("bizEmail").value.trim(),
        terms: $("bizTerms").value.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      saveJson(STORAGE_KEYS.BUSINESS, business);
      renderBusinessDetails();
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
  renderBusinessDetails();
  renderCatalogDropdown();
  syncFormInputsFromInvoice();
  renderInvoice();
  updateLiveItemPreview();
  bindEvents();
})();
