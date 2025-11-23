
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
  const [currentFile, setCurrentFile] = useState(null);
  const [currentView, setCurrentView] = useState("upload");

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
  const getSampleData = () => ({
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
      }
    ],
    extraction_json_with_coordinates: {
      "Vendor Name": { 
        value: "ABC Corporation", 
        coordinates: { x0: 0.1, y0: 0.1 }, 
        page_num: 1 
      },
      "Invoice Number": { 
        value: "INV-2023-001", 
        coordinates: { x0: 0.15, y0: 0.15 }, 
        page_num: 1 
      }
    }
  });

  // Function to handle file uploads
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadedFiles([file]);
    setCurrentFile(file);
    
    try {
      // Import the API dynamically to avoid circular dependencies
      const { invoiceAPI } = await import('../services/api');
      
      // Use the API to process the file
      const result = await invoiceAPI.processInvoice(file);
      
      if (result.success) {
        // Set the transformed data
        setJsonData(result.data);
        
        // Switch to main layout view
        setCurrentView("main");
        
        return {
          success: true,
          message: result.message,
          data: result.data
        };
      } else {
        throw new Error(result.error || 'Processing failed');
      }
      
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Fallback: Use sample data if backend fails
      const sampleData = getSampleData();
      setJsonData(sampleData);
      setCurrentView("main");
      
      return {
        success: false,
        error: error.message,
        data: sampleData
      };
    }
  };

  // Function to go back to upload screen
  const goToUpload = () => {
    setCurrentView("upload");
    setCurrentFile(null);
    setJsonData(null);
  };

  // Function to load JSON data (for sample data)
  const loadJson = (type) => {
    if (type === "default") {
      setJsonData(getSampleData());
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
        uploadedFiles,
        handleFileUpload,
        currentFile,
        currentView,
        setCurrentView,
        goToUpload,
        loadJson,
        feedbackDates: ["2023-12-01", "2023-11-01"]
      }}
    >
      {children}
    </UserContext.Provider>
  );
};