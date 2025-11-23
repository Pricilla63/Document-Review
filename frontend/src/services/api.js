
// services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

// Transform backend response to frontend expected format
const transformBackendData = (backendData) => {
  if (!backendData || !backendData.data || !backendData.data[0]) {
    return null;
  }

  const invoiceData = backendData.data[0];
  const fields = invoiceData.fields || {};
  const items = invoiceData.items || [];

  // Transform nested field structure to flat structure
  const extraction_json = {};
  
  // Map backend field names to frontend field names
  const fieldNameMapping = {
    "VendorName": "Vendor Name",
    "VendorAddress": "Vendor Address", 
    "VendorCountry": "Vendor Country",
    "VendorTaxId": "Vendor Tax ID (VAT/GST/TIN/W9, etc.)",
    "VendorContactEmail": "Vendor Contact Email",
    "VendorPhone": "Vendor Phone",
    "VendorBankName": "Vendor Bank Name",
    "VendorBankAccountNumber": "Vendor Bank Account Number",
    "VendorBankDetails": "Vendor Bank Details (Account/IBAN/SWIFT/Routing No)",
    "VendorContactPerson": "Vendor Contact Person",
    "VendorWebsite": "Vendor Website (if applicable)",
    "CustomerName": "Client Name or Company Name",
    "BillingAddress": "Billing Address",
    "ShippingAddress": "Shipping Address (if different)",
    "CustomerPhone": "Phone Number",
    "CustomerEmail": "Email Address (if applicable)",
    "CustomerTaxId": "Client Tax ID (if applicable)",
    "CustomerContactPerson": "Contact Person",
    "InvoiceId": "Invoice Number",
    "InvoiceDate": "Invoice Date",
    "DueDate": "Due Date",
    "InvoiceCurrency": "Invoice Currency",
    "InvoiceType": "Invoice Type",
    "PurchaseOrder": "PO Number",
    "PaymentTerms": "Payment Terms",
    "PaymentMethod": "Payment Method",
    "CostCenter": "Cost Center / Project Code (if printed)",
    "ServicePeriodStart": "Service period start",
    "ServicePeriodEnd": "Service period end",
    "LineItems_Count": "LineItems_Count",
    "TotalTax": "Total Tax Amount",
    "TaxTypeBreakdown": "Tax Type Breakdown (VAT/GST/PST/IGST etc.)",
    "WithholdingTax": "Withholding Tax",
    "Subtotal": "Subtotal",
    "ShippingHandling": "Shipping / Handling / Fees",
    "Surcharges": "Surcharges",
    "InvoiceTotal": "Total Invoice Amount",
    "AmountPaid": "Amount Paid",
    "AmountDue": "Amount Due",
    "Notes": "Notes / Terms",
    "QRCode": "QR Code / IRN / ZATCA ID (region-specific)",
    "CompanyRegistration": "Company Registration Number",
    "ApprovalWorkflowID": "Approval Workflow ID",
    "ApprovalRequired": "Approval Required",
    "ApproverList": "Approver List / Roles",
    "ApprovalStatus": "Approval Status",
    "ApprovalTimestamps": "Approval Timestamps"
  };

  // Transform the data
  Object.keys(fieldNameMapping).forEach(backendField => {
    const frontendField = fieldNameMapping[backendField];
    if (fields[backendField] && fields[backendField].value !== "na") {
      extraction_json[frontendField] = fields[backendField].value;
    } else {
      extraction_json[frontendField] = ""; // Empty string instead of "na"
    }
  });

  // Transform line items
  const line_items = items.map(item => ({
    "Description": item.Description || "",
    "Item Number or Code (if any)": item.ItemCode || "",
    "Quantity": item.Quantity || 0,
    "UOM": item.UnitOfMeasure || "",
    "Unit Price": item.UnitPrice || 0,
    "Discount (if any)": item.Discount || 0,
    "Net Amount": item.NetAmount || 0,
    "Tax %": item.TaxRate || 0,
    "Tax Amount": item.TaxAmount || 0,
    "Gross Amount": item.GrossAmount || 0
  }));

  return {
    extraction_json,
    line_items,
    extraction_json_with_coordinates: {}, // Add if you have coordinate data
    source_file: invoiceData.source_file
  };
};

export const invoiceAPI = {
  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE}/health`);
      return response.data;
    } catch (error) {
      throw new Error('Backend connection failed');
    }
  },

  async processInvoice(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Uploading file to backend...', file.name);

      const response = await axios.post(`${API_BASE}/api/process-invoice`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout
      });

      console.log('✅ Backend response:', response.data);

      if (response.data.success) {
        // Transform the backend data to frontend format
        const transformedData = transformBackendData(response.data);
        
        if (transformedData) {
          return {
            success: true,
            data: transformedData,
            message: response.data.message || 'Invoice processed successfully'
          };
        } else {
          throw new Error('Failed to transform backend data');
        }
      } else {
        throw new Error(response.data.error || 'Backend processing failed');
      }
    } catch (error) {
      console.error('❌ API call failed:', error);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to backend. Make sure Flask server is running on port 5000.');
      } else if (error.response) {
        throw new Error(`Backend error: ${error.response.data.error || error.response.statusText}`);
      } else {
        throw new Error(`Network error: ${error.message}`);
      }
    }
  }
};
