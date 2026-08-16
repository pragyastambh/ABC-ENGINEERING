# ABC Engineering — CAD Business Management System

Version 1 locked architecture.

Frontend:
- index.html
- admin.html
- customer.html
- style.css
- app.js

Backend:
- Google Apps Script: Code.gs, Database.gs, Drive.gs

Data:
- Google Sheets
- Google Drive

Important setup:
1. Create a Google Sheet and add the final sheets:
   Customers, Requirements, Projects, Drawings, Revisions, BOM, Invoices, Payments, Expenses, Services, Settings.
2. Put the Sheet ID in Code.gs.
3. Deploy Apps Script as a Web App.
4. Put the Web App URL into API_URL in app.js.
5. Configure authentication and Drive mapping before production use.

Security:
- Customer login uses registered email + 4-digit Access Number; no password.
- Customer/project access must be verified server-side.
- Admin-only BOM cost/purchase fields must never be sent to the customer frontend.
- Do not store plaintext passwords (there is no password system in this design).
