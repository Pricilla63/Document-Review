// import { createContext, useState, useEffect } from "react";
// import sampleJSON from "../data/sample.json";
// import sampleJSON1 from "../data/14_04_20241_13_08.json";
// import sampleJSON2 from "../data/14_04_20241_15_15.json";

// // paystub json
// import SamplePayStub from "../data/paystub/SamplePaystub.json";
// // import SamplePayStub1 from "../data/paystub/14_04_20241_13_08.json";
// // import SamplePayStub2 from "../data/paystub/14_04_20241_15_15.json";

// // w2
// import SampleW2 from "../data/3188332/W2/ic_3188332_w2.json";

// // credit report
// import SampleCRJSON from "../data/3188332/Credit_Report/ic_3188332_creditReport.json";

// // wvoe
// import SampleWVOE from "../data/3188332/WVOE/ic_3188332_wvoe.json";


// import ONEJson from "../data/1040.json";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [themeStyle, setThemeStyle] = useState({ primary: "#4589ff" }); // Default theme is light
//   const [jsonData, setJsonData] = useState(SamplePayStub); // default to Paystub
//   const [docType, setDocType] = useState("Bank Statement");
//   const DOC_TYPES = [
//     "Paystub",
//     "W2",
//     "Bank Statement",
//     "Credit Report",
//     "WVOE",
//     "1040"
//     // "VVOE",
//     // "Schedule E",
//   ];
//   const [selectedDocType, setSelectedDocType] = useState(
//     DOC_TYPES[0] || "Paystub"
//   );

//   // Store different feedback dates based on document type
//   const feedbackDates = {
//     "Bank Statement": [
//       "2025-04-14-13-04",
//       "2025-03-28-04-05",
//       "2025-02-19-10-11",
//     ],
//     Paystub: [
//       "2025-04-14-13-04",
//       //  "2025-03-25-10-01", "2025-02-28-11-30"
//     ],
//   };

//   const loadJson = (data) => {
//     const finalJson = {
//       "Bank Statement": {
//         default: sampleJSON,
//         "2025-04-14-13-04": sampleJSON,
//         "2025-03-28-04-05": sampleJSON1,
//         "2025-02-19-10-11": sampleJSON2,
//       },
//       Paystub: {
//         default: SamplePayStub,
//         "2025-04-14-13-04": SamplePayStub,
//         // "2025-03-25-10-01": SamplePayStub1,
//         // "2025-02-28-11-30": SamplePayStub2,
//       },
//       W2: {
//         default: SampleW2,
//       },
//     };
//     setJsonData(finalJson[selectedDocType]?.[data]);
//   };

//   useEffect(() => {
//     // loadJson("default");
//     handleJSONChange();
//   }, [selectedDocType]);

//   const handleJSONChange = () => {
//     switch (selectedDocType) {
//       case "Bank Statement":
//         setJsonData(sampleJSON);
//         break;
//       case "Paystub":
//         setJsonData(SamplePayStub);
//         break;
//       case "W2":
//         setJsonData(SampleW2);
//         break;
//       case "Credit Report":
//         setJsonData(SampleCRJSON);
//         break;
//       case "WVOE":
//         setJsonData(SampleWVOE);
//         break;
//       case "1040":
//         setJsonData(ONEJson);
//         break;
//       default:
//         setJsonData({});
//     }
//   };
//   return (
//     <UserContext.Provider
//       value={{
//         themeStyle,
//         jsonData,
//         loadJson,
//         docType,
//         setDocType,
//         selectedDocType,
//         setSelectedDocType,
//         DOC_TYPES,
//         feedbackDates:
//           feedbackDates[selectedDocType] || feedbackDates["Paystub"], // Dynamically select dates based on docType
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };




import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [themeStyle, setThemeStyle] = useState({
    primary: "#0f62fe",
    secondary: "#6f6f6f",
  });

  const [jsonData, setJsonData] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState("Invoice");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const DOC_TYPES = [
    "Invoice",
    "Bank Statement",
    "Paystub",
    "W2",
    "Credit Report",
    "WVOE",
    "1040",
  ];

  // Mock data for demonstration
  const sampleData = {
    extraction_json: {
      // Vendor Level
      "Vendor Name": "ABC Corporation",
      "Vendor Address": "123 Business St, New York, NY 10001",
      "Vendor Country": "United States",
      "Vendor Tax ID (VAT/GST/TIN/W9, etc.)": "12-3456789",
      "Vendor Contact Email": "billing@abccorp.com",
      "Vendor Phone": "+1 (555) 123-4567",
      "Vendor Bank Name": "City Bank",
      "Vendor Bank Account Number": "XXXXX1234",
      "Vendor Bank Details (Account/IBAN/SWIFT/Routing No)": "ROUTING: 021000021",
      "Vendor Contact Person": "John Smith",
      "Vendor Website (if applicable)": "www.abccorp.com",

      // Buyer Information
      "Client Name or Company Name": "XYZ Enterprises",
      "Billing Address": "456 Corporate Ave, Boston, MA 02101",
      "Shipping Address (if different)": "456 Corporate Ave, Boston, MA 02101",
      "Phone Number": "+1 (555) 987-6543",
      "Email Address (if applicable)": "accounts@xyzent.com",
      "Client Tax ID (if applicable)": "98-7654321",
      "Contact Person": "Sarah Johnson",

      // Invoice Header
      "Invoice Number": "INV-2023-001",
      "Invoice Date": "2023-12-01",
      "Due Date": "2023-12-31",
      "Invoice Currency": "USD",
      "Invoice Type": "Standard",
      "PO Number": "PO-789012",
      "Payment Terms": "Net 30",
      "Payment Method": "Bank Transfer",
      "Cost Center / Project Code (if printed)": "PROJ-2023-Q4",
      "Service period start": "2023-11-01",
      "Service period end": "2023-11-30",

      // Financials
      "Subtotal": 1350.00,
      "Shipping / Handling / Fees": 50.00,
      "Surcharges": 100.00,
      "Total Invoice Amount": 1500.00,
      "Amount Paid": 0.00,
      "Amount Due": 1500.00,

      // Taxes
      "Total Tax Amount": 150.00,
      "Tax Type Breakdown (VAT/GST/PST/IGST etc.)": "Sales Tax: 10%",
      "Withholding Tax": 0.00,

      // Compliance
      "Notes / Terms": "Thank you for your business!",
      "QR Code / IRN / ZATCA ID (region-specific)": "na",
      "Company Registration Number": "CORP-123456",

      // Approval Workflow
      "Approval Workflow ID": "APPR-2023-001",
      "Approval Required": true,
      "Approver List / Roles": "Manager, Director, Finance",
      "Approval Status": "Pending",
      "Approval Timestamps": "2023-12-01 10:00:00"
    },
    line_items: [
      {
        "Description": "Web Development Services",
        "Item Number or Code (if any)": "SRV-001",
        "Quantity": 10,
        "UOM": "hours",
        "Unit Price": 100.00,
        "Discount (if any)": 0.00,
        "Net Amount": 1000.00,
        "Tax %": 10.0,
        "Tax Amount": 100.00,
        "Gross Amount": 1100.00
      },
      {
        "Description": "Consulting Services",
        "Item Number or Code (if any)": "SRV-002",
        "Quantity": 5,
        "UOM": "hours",
        "Unit Price": 50.00,
        "Discount (if any)": 0.00,
        "Net Amount": 250.00,
        "Tax %": 10.0,
        "Tax Amount": 25.00,
        "Gross Amount": 275.00
      },
      {
        "Description": "Project Management",
        "Item Number or Code (if any)": "SRV-003",
        "Quantity": 2,
        "UOM": "days",
        "Unit Price": 50.00,
        "Discount (if any)": 0.00,
        "Net Amount": 100.00,
        "Tax %": 10.0,
        "Tax Amount": 10.00,
        "Gross Amount": 110.00
      }
    ]
  };

  const loadJson = (type) => {
    // For now, use sample data. Later this will come from backend
    if (type === "default") {
      setJsonData(sampleData);
    }
  };

  // Function to handle file uploads
  const handleFileUpload = async (files) => {
    setUploadedFiles(files);
    
    // Here you would send files to backend for processing
    // For now, we'll use sample data
    setJsonData(sampleData);
    
    return {
      success: true,
      message: `Successfully uploaded ${files.length} file(s)`
    };
  };

  // Function to process uploaded files
  const processUploadedFiles = async () => {
    // This would call your backend API to process the files
    try {
      // Simulate API call
      const response = await fetch('/api/process-invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: uploadedFiles })
      });
      
      const result = await response.json();
      setJsonData(result.data);
      
      return result;
    } catch (error) {
      console.error('Error processing files:', error);
      return {
        success: false,
        error: 'Failed to process files'
      };
    }
  };

  return (
    <UserContext.Provider
      value={{
        themeStyle,
        jsonData,
        selectedDocType,
        setSelectedDocType,
        DOC_TYPES,
        loadJson,
        feedbackDates: ["2023-12-01", "2023-11-01"],
        uploadedFiles,
        handleFileUpload,
        processUploadedFiles
      }}
    >
      {children}
    </UserContext.Provider>
  );
};