// export const schemaMap = {
//   "Bank Statement": {
//     flatFields: [
//       "Name of Institution",

//       "Account Holder",

//       "Account Number",

//       "beginning date",

//       "ending date",
//     ],

//     sectionKey: "transactions",

//     sectionTitle: "Transaction",

//     sectionFields: ["Credit_Debit", "Amount", "Account", "Description"],

//     sectionTitleField: "Description", // NEW! You can customize here
//   },

//   Paystub: {
//     flatFields: [
//       "Employer name",

//       "PayPeriodStartDate",

//       "PayPeriodEndDate",

//       "Pay Frequency",
//     ],

//     sectionKey: "paystubdetails",

//     sectionTitle: "Income",

//     sectionFields: [
//       "IncomeName",

//       "TypeName",

//       "IncomeType",

//       "Rate",

//       "Hours",

//       "ThisPeriod",

//       "YTDEarnings",
//     ],

//     sectionTitleField: "TypeName", // NEW! Dynamic title from TypeName
//   },

//   W2: {
//     flatFields: ["Employer Name"],

//     sectionKey: "W2",

//     sectionTitle: "W2 Detail",

//     sectionFields: ["year", "wages"],

//     sectionTitleField: "year", // NEW!
//   },

//   "Credit Report": {
//     flatFields: ["Vendor Name"],

//     sectionKey: "libilities",

//     sectionTitle: "Liabilities", // corrected typo "Libilities"

//     sectionFields: [
//       "creditor_name",

//       "account_number",

//       "liability_type",

//       "mon payment",
//     ],

//     sectionTitleField: "creditor_name", // NEW!
//   },

//   WVOE: {
//     flatFields: ["Rate Of Pay", "Pay Frequency", "Hours"],

//     sectionKey: "years",

//     sectionTitle: "Years",

//     sectionFields: [
//       "Year",

//       "Base Salary",

//       "Overtime",

//       "Commissions",

//       "Bonus",

//       "Others",

//       "Total",
//     ],

//     sectionTitleField: "Year", // NEW!
//   },

//   1040: {
//     flatFields: ["First Name", "Last Name", "SSN", "year", "Schedule C Profit or Loss"],

//     // sectionKey: "W2",

//     // sectionTitle: "W2 Detail",

//     // sectionFields: ["year", "wages"],

//     // sectionTitleField: "year", // NEW!
//   },
// };




export const schemaMap = {
  "Invoice": {
    flatFields: [
      // Vendor Level (11 fields)
      "Vendor Name",
      "Vendor Address", 
      "Vendor Country",
      "Vendor Tax ID (VAT/GST/TIN/W9, etc.)",
      "Vendor Contact Email",
      "Vendor Phone",
      "Vendor Bank Name",
      "Vendor Bank Account Number",
      "Vendor Bank Details (Account/IBAN/SWIFT/Routing No)",
      "Vendor Contact Person",
      "Vendor Website (if applicable)",
      
      // Buyer Information (7 fields)
      "Client Name or Company Name",
      "Billing Address",
      "Shipping Address (if different)",
      "Phone Number",
      "Email Address (if applicable)",
      "Client Tax ID (if applicable)",
      "Contact Person",
      
      // Invoice Header (11 fields)
      "Invoice Number",
      "Invoice Date",
      "Due Date",
      "Invoice Currency",
      "Invoice Type",
      "PO Number",
      "Payment Terms",
      "Payment Method",
      "Cost Center / Project Code (if printed)",
      "Service period start",
      "Service period end",
      
      // Taxes (3 fields)
      "Total Tax Amount",
      "Tax Type Breakdown (VAT/GST/PST/IGST etc.)",
      "Withholding Tax",
      
      // Totals (6 fields)
      "Subtotal",
      "Shipping / Handling / Fees",
      "Surcharges",
      "Total Invoice Amount",
      "Amount Paid",
      "Amount Due",
      
      // Compliance (3 fields)
      "Notes / Terms",
      "QR Code / IRN / ZATCA ID (region-specific)",
      "Company Registration Number",
      
      // Approval Workflow (5 fields)
      "Approval Workflow ID",
      "Approval Required",
      "Approver List / Roles",
      "Approval Status",
      "Approval Timestamps"
    ],
    
    sectionKey: "line_items",
    sectionTitle: "Line Item",
    sectionFields: [
      "Description",
      "Item Number or Code (if any)",
      "Quantity", 
      "UOM",
      "Unit Price",
      "Discount (if any)",
      "Net Amount",
      "Tax %",
      "Tax Amount",
      "Gross Amount"
    ],
    sectionTitleField: "Description"
  },
  
  // // Keep your existing document types
  // "Bank Statement": {
  //   flatFields: [
  //     "Name of Institution",
  //     "Account Holder",
  //     "Account Number",
  //     "beginning date",
  //     "ending date",
  //   ],
  //   sectionKey: "transactions",
  //   sectionTitle: "Transaction",
  //   sectionFields: ["Credit_Debit", "Amount", "Account", "Description"],
  //   sectionTitleField: "Description",
  // },
  
  // "Paystub": {
  //   flatFields: [
  //     "Employer name",
  //     "PayPeriodStartDate",
  //     "PayPeriodEndDate",
  //     "Pay Frequency",
  //   ],
  //   sectionKey: "paystubdetails",
  //   sectionTitle: "Income",
  //   sectionFields: [
  //     "IncomeName",
  //     "TypeName",
  //     "IncomeType",
  //     "Rate",
  //     "Hours",
  //     "ThisPeriod",
  //     "YTDEarnings",
  //   ],
  //   sectionTitleField: "TypeName",
  // },
  
  // "W2": {
  //   flatFields: ["Employer Name"],
  //   sectionKey: "W2",
  //   sectionTitle: "W2 Detail",
  //   sectionFields: ["year", "wages"],
  //   sectionTitleField: "year",
  // },
  
  // "Credit Report": {
  //   flatFields: ["Vendor Name"],
  //   sectionKey: "libilities",
  //   sectionTitle: "Liabilities",
  //   sectionFields: [
  //     "creditor_name",
  //     "account_number",
  //     "liability_type",
  //     "mon payment",
  //   ],
  //   sectionTitleField: "creditor_name",
  // },
  
  // "WVOE": {
  //   flatFields: ["Rate Of Pay", "Pay Frequency", "Hours"],
  //   sectionKey: "years",
  //   sectionTitle: "Years",
  //   sectionFields: [
  //     "Year",
  //     "Base Salary",
  //     "Overtime",
  //     "Commissions",
  //     "Bonus",
  //     "Others",
  //     "Total",
  //   ],
  //   sectionTitleField: "Year",
  // },
  
  // "1040": {
  //   flatFields: ["First Name", "Last Name", "SSN", "year", "Schedule C Profit or Loss"],
  // },
};
