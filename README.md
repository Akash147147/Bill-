# GST Tax Invoice Designer & Bill Maker

A lightweight, responsive web application to design, customize, and print GST Tax Invoices with a dropdown item selector.

## Features
- **Dropdown Item Selector**: Pick items from your catalog to auto-fill HSN, UOM, Rate, and GST % (CGST/SGST or IGST).
- **Live Calculations**: Automatically computes Taxable Value, CGST, SGST, IGST, Grand Total, and Indian Rupee **Amount in words**.
- **Custom Business & Catalog Management**: Edit your company details, bank details, terms, and item catalog (persisted in `localStorage`).
- **Print / Save as PDF**: Clean A4 print layout with a **Yellow Bill Paper / White A4** toggle.

## Quick Start
Open `index.html` in any modern browser, or serve locally:

```bash
python -m http.server 8080
```
