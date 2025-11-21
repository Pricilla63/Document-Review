# import os
# import json
# import glob
# from azure.core.credentials import AzureKeyCredential
# from azure.ai.documentintelligence import DocumentIntelligenceClient
# from dotenv import find_dotenv, load_dotenv

# load_dotenv(find_dotenv())

# endpoint = os.environ["DOCUMENTINTELLIGENCE_ENDPOINT"]
# key = os.environ["DOCUMENTINTELLIGENCE_API_KEY"]

# document_intelligence_client = DocumentIntelligenceClient(
#     endpoint=endpoint, credential=AzureKeyCredential(key)
# )

# # Find all PDF files in current directory AND all subdirectories
# pdf_files = glob.glob("**/*.pdf", recursive=True)

# if not pdf_files:
#     print("❌ No PDF files found in current directory or subdirectories")
#     print("Current working directory:", os.getcwd())
#     print("Please make sure your PDF files are in this directory or its subdirectories")
#     exit()

# print(f"📁 Found {len(pdf_files)} PDF files to process")
# print("Files found:")
# for pdf_file in pdf_files:
#     print(f"  - {pdf_file}")

# # Create output folder if it doesn't exist
# output_folder = "output"
# if not os.path.exists(output_folder):
#     os.makedirs(output_folder)

# successful_files = 0
# failed_files = 0

# for pdf_file in pdf_files:
#     try:
#         print(f"\n🔍 Processing: {pdf_file}")
        
#         with open(pdf_file, "rb") as f:
#             # Try different parameter combinations for different SDK versions
#             try:
#                 # Try the newer SDK syntax first
#                 poller = document_intelligence_client.begin_analyze_document(
#                     "prebuilt-invoice", 
#                     body=f,
#                     content_type="application/octet-stream"
#                 )
#             except TypeError:
#                 # Fallback to older syntax
#                 poller = document_intelligence_client.begin_analyze_document(
#                     "prebuilt-invoice", 
#                     analyze_request=f,
#                     content_type="application/octet-stream"
#                 )
            
#             invoices = poller.result()
        
#         invoice_data = []
        
#         for idx, invoice in enumerate(invoices.documents):
#             print("--------Recognizing invoice #{}--------".format(idx + 1))
            
#             invoice_dict = {
#                 "invoice_number": idx + 1,
#                 "source_file": pdf_file,
#                 "fields": {}
#             }
            
#             vendor_name = invoice.fields.get("VendorName")
#             if vendor_name:
#                 print(
#                     "Vendor Name: {} has confidence: {}".format(
#                         vendor_name.value_string, vendor_name.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["VendorName"] = {
#                     "value": vendor_name.value_string,
#                     "confidence": vendor_name.confidence
#                 }
            
#             vendor_address = invoice.fields.get("VendorAddress")
#             if vendor_address:
#                 print(
#                     "Vendor Address: {} has confidence: {}".format(
#                         vendor_address.value_address, vendor_address.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["VendorAddress"] = {
#                     "value": str(vendor_address.value_address),
#                     "confidence": vendor_address.confidence
#                 }
            
#             vendor_address_recipient = invoice.fields.get("VendorAddressRecipient")
#             if vendor_address_recipient:
#                 print(
#                     "Vendor Address Recipient: {} has confidence: {}".format(
#                         vendor_address_recipient.value_string, vendor_address_recipient.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["VendorAddressRecipient"] = {
#                     "value": vendor_address_recipient.value_string,
#                     "confidence": vendor_address_recipient.confidence
#                 }
            
#             customer_name = invoice.fields.get("CustomerName")
#             if customer_name:
#                 print(
#                     "Customer Name: {} has confidence: {}".format(
#                         customer_name.value_string, customer_name.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["CustomerName"] = {
#                     "value": customer_name.value_string,
#                     "confidence": customer_name.confidence
#                 }
            
#             customer_id = invoice.fields.get("CustomerId")
#             if customer_id:
#                 print(
#                     "Customer Id: {} has confidence: {}".format(
#                         customer_id.value_string, customer_id.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["CustomerId"] = {
#                     "value": customer_id.value_string,
#                     "confidence": customer_id.confidence
#                 }
            
#             customer_address = invoice.fields.get("CustomerAddress")
#             if customer_address:
#                 print(
#                     "Customer Address: {} has confidence: {}".format(
#                         customer_address.value_address, customer_address.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["CustomerAddress"] = {
#                     "value": str(customer_address.value_address),
#                     "confidence": customer_address.confidence
#                 }
            
#             customer_address_recipient = invoice.fields.get("CustomerAddressRecipient")
#             if customer_address_recipient:
#                 print(
#                     "Customer Address Recipient: {} has confidence: {}".format(
#                         customer_address_recipient.value_string,
#                         customer_address_recipient.confidence,
#                     )
#                 )
#                 invoice_dict["fields"]["CustomerAddressRecipient"] = {
#                     "value": customer_address_recipient.value_string,
#                     "confidence": customer_address_recipient.confidence
#                 }
            
#             invoice_id = invoice.fields.get("InvoiceId")
#             if invoice_id:
#                 print(
#                     "Invoice Id: {} has confidence: {}".format(
#                         invoice_id.value_string, invoice_id.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["InvoiceId"] = {
#                     "value": invoice_id.value_string,
#                     "confidence": invoice_id.confidence
#                 }
            
#             invoice_date = invoice.fields.get("InvoiceDate")
#             if invoice_date:
#                 print(
#                     "Invoice Date: {} has confidence: {}".format(
#                         invoice_date.value_date, invoice_date.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["InvoiceDate"] = {
#                     "value": str(invoice_date.value_date),
#                     "confidence": invoice_date.confidence
#                 }
            
#             invoice_total = invoice.fields.get("InvoiceTotal")
#             if invoice_total:
#                 print(
#                     "Invoice Total: {} has confidence: {}".format(
#                         invoice_total.value_currency.amount, invoice_total.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["InvoiceTotal"] = {
#                     "value": invoice_total.value_currency.amount,
#                     "currency": invoice_total.value_currency.currency_symbol,
#                     "confidence": invoice_total.confidence
#                 }
            
#             due_date = invoice.fields.get("DueDate")
#             if due_date:
#                 print(
#                     "Due Date: {} has confidence: {}".format(
#                         due_date.value_date, due_date.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["DueDate"] = {
#                     "value": str(due_date.value_date),
#                     "confidence": due_date.confidence
#                 }
            
#             purchase_order = invoice.fields.get("PurchaseOrder")
#             if purchase_order:
#                 print(
#                     "Purchase Order: {} has confidence: {}".format(
#                         purchase_order.value_string, purchase_order.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["PurchaseOrder"] = {
#                     "value": purchase_order.value_string,
#                     "confidence": purchase_order.confidence
#                 }
            
#             billing_address = invoice.fields.get("BillingAddress")
#             if billing_address:
#                 print(
#                     "Billing Address: {} has confidence: {}".format(
#                         billing_address.value_address, billing_address.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["BillingAddress"] = {
#                     "value": str(billing_address.value_address),
#                     "confidence": billing_address.confidence
#                 }
            
#             shipping_address = invoice.fields.get("ShippingAddress")
#             if shipping_address:
#                 print(
#                     "Shipping Address: {} has confidence: {}".format(
#                         shipping_address.value_address, shipping_address.confidence
#                     )
#                 )
#                 invoice_dict["fields"]["ShippingAddress"] = {
#                     "value": str(shipping_address.value_address),
#                     "confidence": shipping_address.confidence
#                 }
            
#             # Add items to the invoice
#             invoice_dict["items"] = []
#             print("Invoice items:")
#             if invoice.fields.get("Items"):
#                 for item_idx, item in enumerate(invoice.fields.get("Items").value_array):
#                     print("...Item #{}".format(item_idx + 1))
#                     item_dict = {"item_number": item_idx + 1}
                    
#                     item_description = item.value_object.get("Description")
#                     if item_description:
#                         print(
#                             "......Description: {} has confidence: {}".format(
#                                 item_description.value_string, item_description.confidence
#                             )
#                         )
#                         item_dict["Description"] = {
#                             "value": item_description.value_string,
#                             "confidence": item_description.confidence
#                         }
                    
#                     item_quantity = item.value_object.get("Quantity")
#                     if item_quantity:
#                         print(
#                             "......Quantity: {} has confidence: {}".format(
#                                 item_quantity.value_number, item_quantity.confidence
#                             )
#                         )
#                         item_dict["Quantity"] = {
#                             "value": item_quantity.value_number,
#                             "confidence": item_quantity.confidence
#                         }
                    
#                     unit_price = item.value_object.get("UnitPrice")
#                     if unit_price:
#                         print(
#                             "......Unit Price: {} has confidence: {}".format(
#                                 unit_price.value_currency.amount, unit_price.confidence
#                             )
#                         )
#                         item_dict["UnitPrice"] = {
#                             "value": unit_price.value_currency.amount,
#                             "currency": unit_price.value_currency.currency_symbol,
#                             "confidence": unit_price.confidence
#                         }
                    
#                     amount = item.value_object.get("Amount")
#                     if amount:
#                         print(
#                             "......Amount: {} has confidence: {}".format(
#                                 amount.value_currency.amount, amount.confidence
#                             )
#                         )
#                         item_dict["Amount"] = {
#                             "value": amount.value_currency.amount,
#                             "currency": amount.value_currency.currency_symbol,
#                             "confidence": amount.confidence
#                         }
                    
#                     invoice_dict["items"].append(item_dict)
            
#             invoice_data.append(invoice_dict)
#             print("----------------------------------------")
        
#         # Create JSON filename based on original PDF name
#         base_name = os.path.splitext(os.path.basename(pdf_file))[0]
#         json_filename = f"{base_name}_extracted.json"
#         json_filepath = os.path.join(output_folder, json_filename)
        
#         # Write to JSON file
#         with open(json_filepath, 'w', encoding='utf-8') as json_file:
#             json.dump(invoice_data, json_file, indent=2, ensure_ascii=False)
        
#         print(f"✅ Saved: {json_filename}")
#         successful_files += 1
        
#     except Exception as e:
#         print(f"❌ Error processing {pdf_file}: {e}")
#         failed_files += 1

# # Print summary
# print("\n" + "="*50)
# print("📊 PROCESSING SUMMARY")
# print(f"✅ Successful: {successful_files} files")
# print(f"❌ Failed: {failed_files} files")
# print(f"📁 Output folder: {output_folder}")
# print("="*50)




import os
import json
import re
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from openai import AzureOpenAI
from dotenv import find_dotenv, load_dotenv
import tempfile
from datetime import datetime
import fitz  # PyMuPDF
import base64
import time

load_dotenv(find_dotenv())

app = Flask(__name__)
CORS(app)

# Azure Document Intelligence setup
endpoint = os.environ["DOCUMENTINTELLIGENCE_ENDPOINT"]
key = os.environ["DOCUMENTINTELLIGENCE_API_KEY"]

document_intelligence_client = DocumentIntelligenceClient(
    endpoint=endpoint, credential=AzureKeyCredential(key)
)

# Azure OpenAI setup
azure_openai_client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version="2024-02-01",
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"]
)

# Create output folders
output_folder = "output"
json_output_folder = os.path.join(output_folder, "json_files")
if not os.path.exists(output_folder):
    os.makedirs(output_folder)
if not os.path.exists(json_output_folder):
    os.makedirs(json_output_folder)

# All 56 fields definition
ALL_56_FIELDS = [
    # Vendor Level (11)
    "VendorName", "VendorAddress", "VendorCountry", "VendorTaxId",
    "VendorContactEmail", "VendorPhone", "VendorBankName", 
    "VendorBankAccountNumber", "VendorBankDetails", "VendorContactPerson",
    "VendorWebsite",
    # Buyer Information (7)
    "CustomerName", "BillingAddress", "ShippingAddress", "CustomerPhone",
    "CustomerEmail", "CustomerTaxId", "CustomerContactPerson",
    # Invoice Header (11)
    "InvoiceId", "InvoiceDate", "DueDate", "InvoiceCurrency",
    "InvoiceType", "PurchaseOrder", "PaymentTerms", "PaymentMethod",
    "CostCenter", "ServicePeriodStart", "ServicePeriodEnd",
    # Line Items Summary (1)
    "LineItems_Count",
    # Taxes (3)
    "TotalTax", "TaxTypeBreakdown", "WithholdingTax",
    # Totals (6)
    "Subtotal", "ShippingHandling", "Surcharges", "InvoiceTotal",
    "AmountPaid", "AmountDue",
    # Compliance (3)
    "Notes", "QRCode", "CompanyRegistration",
    # Approval Workflow (5)
    "ApprovalWorkflowID", "ApprovalRequired", "ApproverList",
    "ApprovalStatus", "ApprovalTimestamps"
]

# Enhanced Azure Field Mappings
ENHANCED_FIELD_MAPPINGS = {
    # Vendor Level
    "VendorName": "VendorName",
    "VendorAddress": "VendorAddress",
    "VendorTaxId": "VendorTaxId",
    "VendorPhone": "VendorPhone",
    "VendorContactPerson": "VendorAddressRecipient",
    
    # Buyer Information
    "CustomerName": "CustomerName",
    "BillingAddress": "BillingAddress",
    "ShippingAddress": "ShippingAddress",
    "CustomerPhone": "CustomerPhone",
    "CustomerTaxId": "CustomerTaxId",
    "CustomerContactPerson": "CustomerAddressRecipient",
    
    # Invoice Header
    "InvoiceId": "InvoiceId",
    "InvoiceDate": "InvoiceDate",
    "DueDate": "DueDate",
    "PurchaseOrder": "PurchaseOrder",
    "PaymentTerms": "PaymentTerms",
    "ServicePeriodStart": "ServiceStartDate",
    "ServicePeriodEnd": "ServiceEndDate",
    
    # Financials
    "InvoiceTotal": "InvoiceTotal",
    "Subtotal": "SubTotal",
    "TotalTax": "TotalTax",
    "AmountDue": "AmountDue",
    
    # Payment Details
    "VendorBankName": "PaymentDetails",
    "VendorBankAccountNumber": "PaymentDetails",
    "VendorBankDetails": "PaymentDetails",
    "PaymentMethod": "PaymentDetails",
}

# Comprehensive Regex Patterns for all fields
COMPREHENSIVE_REGEX_PATTERNS = {
    "VendorName": [r'(?:From|Vendor|Supplier)[:\s]*([^\n]+)'],
    "VendorAddress": [r'(?:Vendor\s*Address)[:\s]*([^\n]+(?:\n[^\n]+){0,2})'],
    "VendorTaxId": [r'(?:Tax\s*ID|VAT|GST)[\s#:]*([A-Z0-9-]+)'],
    "VendorContactEmail": [r'\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b'],
    "VendorPhone": [r'(?:Phone|Tel)[\s:]*([+\d\s\-\(\)]{7,})'],
    "VendorBankName": [r'(?:Bank\s*Name)[\s:]*([A-Za-z0-9\s\.&]+)'],
    "VendorBankAccountNumber": [r'(?:Account\s*Number)[\s:]*([A-Z0-9-]+)'],
    "VendorBankDetails": [r'(?:IBAN)[\s:]*([A-Z0-9-]+)'],
    "VendorContactPerson": [r'(?:Attention|Attn)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)'],
    "VendorWebsite": [r'(?:Website)[\s:]*((?:https?://)?[^\s]+\.[a-z]{2,})'],
    
    "CustomerName": [r'(?:To|Bill\s*To|Customer)[\s:]*([^\n]+)'],
    "BillingAddress": [r'(?:Billing\s*Address)[\s:]*([^\n]+(?:\n[^\n]+){0,2})'],
    "ShippingAddress": [r'(?:Shipping\s*Address)[\s:]*([^\n]+(?:\n[^\n]+){0,2})'],
    "CustomerPhone": [r'(?:Customer\s*Phone)[\s:]*([+\d\s\-\(\)]{7,})'],
    "CustomerEmail": [r'(?:Customer\s*Email)[\s:]*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})'],
    "CustomerTaxId": [r'(?:Customer\s*Tax\s*ID)[\s#:]*([A-Z0-9-]+)'],
    "CustomerContactPerson": [r'(?:Customer\s*Contact)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)'],
    
    "InvoiceId": [r'(?:Invoice\s*#|Invoice\s*Number)[\s:]*([A-Z0-9-]+)'],
    "InvoiceDate": [r'(?:Invoice\s*Date|Date)[\s:]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'],
    "DueDate": [r'(?:Due\s*Date)[\s:]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'],
    "InvoiceCurrency": [r'(?:Currency)[\s:]*([A-Z]{3})'],
    "InvoiceType": [r'(?:Invoice\s*Type)[\s:]*([A-Za-z\s]+)'],
    "PurchaseOrder": [r'(?:PO\s*#|Purchase\s*Order)[\s:]*([A-Z0-9-]+)'],
    "PaymentTerms": [r'(?:Payment\s*Terms)[\s:]*([^\n\r]+)'],
    "PaymentMethod": [r'(?:Payment\s*Method)[\s:]*([A-Za-z\s]+)'],
    "CostCenter": [r'(?:Cost\s*Center)[\s:]*([A-Z0-9-]+)'],
    "ServicePeriodStart": [r'(?:Service\s*Period|From)[\s:]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'],
    "ServicePeriodEnd": [r'(?:To|End)[\s:]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'],
    
    "TotalTax": [r'(?:Total\s*Tax)[\s:]*\$?([\d,]+\.?\d*)'],
    "WithholdingTax": [r'(?:Withholding\s*Tax)[\s:]*\$?([\d,]+\.?\d*)'],
    
    "Subtotal": [r'(?:Subtotal)[\s:]*\$?([\d,]+\.?\d*)'],
    "ShippingHandling": [r'(?:Shipping|Handling)[\s:]*\$?([\d,]+\.?\d*)'],
    "Surcharges": [r'(?:Surcharge)[\s:]*\$?([\d,]+\.?\d*)'],
    "InvoiceTotal": [r'(?:Invoice\s*Total|Grand\s*Total)[\s:]*\$?([\d,]+\.?\d*)'],
    "AmountPaid": [r'(?:Amount\s*Paid)[\s:]*\$?([\d,]+\.?\d*)'],
    "AmountDue": [r'(?:Amount\s*Due)[\s:]*\$?([\d,]+\.?\d*)'],
    
    "Notes": [r'(?:Notes|Remarks)[\s:]*(.*?)(?=\n\s*\n|\Z)'],
    "QRCode": [r'(?:QR\s*Code)[\s:]*([A-Z0-9]{10,})'],
    "CompanyRegistration": [r'(?:Company\s*Reg\.)[\s:]*([A-Z0-9-]+)'],
}

# =============================================================================
# CORE EXTRACTION FUNCTIONS
# =============================================================================

def extract_text_from_pdf(file_path):
    """Extract raw text from PDF for fallback processing"""
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        print(f"⚠️ PDF text extraction failed: {e}")
        return ""

def extract_field_value(field):
    """Extract value from Azure Document field with proper type handling"""
    if not field:
        return None
    
    try:
        if hasattr(field, 'value_string') and field.value_string:
            return field.value_string
        elif hasattr(field, 'value_currency') and field.value_currency:
            return {
                "amount": field.value_currency.amount,
                "currency": field.value_currency.currency_symbol,
                "currency_code": field.value_currency.currency_code
            }
        elif hasattr(field, 'value_date') and field.value_date:
            return str(field.value_date)
        elif hasattr(field, 'value_address') and field.value_address:
            address_data = {
                "street_address": getattr(field.value_address, 'street_address', ''),
                "city": getattr(field.value_address, 'city', ''),
                "state": getattr(field.value_address, 'state', ''),
                "postal_code": getattr(field.value_address, 'postal_code', ''),
                "country": getattr(field.value_address, 'country_region', ''),
            }
            return {k: v for k, v in address_data.items() if v}
        elif hasattr(field, 'value_phone_number') and field.value_phone_number:
            return field.value_phone_number
        elif hasattr(field, 'value_number') and field.value_number:
            return field.value_number
        elif hasattr(field, 'value_array') and field.value_array:
            return [extract_field_value(item) for item in field.value_array]
        elif hasattr(field, 'value_object') and field.value_object:
            return {key: extract_field_value(value) for key, value in field.value_object.items()}
    except Exception as e:
        print(f"⚠️ Error extracting field value: {e}")
    
    return None

# =============================================================================
# LINE ITEM EXTRACTION - COMPREHENSIVE IMPLEMENTATION
# =============================================================================

def extract_line_items_enhanced(items_field, text_content=""):
    """Enhanced line item extraction with multiple fallback strategies"""
    line_items = []
    
    # Strategy 1: Azure Document Intelligence Line Items
    if items_field and hasattr(items_field, 'value_array'):
        azure_items = extract_line_items_from_azure(items_field)
        if azure_items:
            line_items.extend(azure_items)
            print(f"✅ Azure extracted {len(azure_items)} line items")
    
    # Strategy 2: If no items from Azure, try text-based extraction
    if not line_items and text_content:
        text_items = extract_line_items_from_text(text_content)
        if text_items:
            line_items.extend(text_items)
            print(f"✅ Text extraction found {len(text_items)} line items")
    
    # Strategy 3: If still no items, try LLM-based extraction
    if not line_items and text_content:
        llm_items = extract_line_items_with_llm(text_content)
        if llm_items:
            line_items.extend(llm_items)
            print(f"✅ LLM extracted {len(llm_items)} line items")
    
    print(f"📊 Total line items extracted: {len(line_items)}")
    return line_items

def extract_line_items_from_azure(items_field):
    """Extract line items from Azure Document Intelligence response"""
    line_items = []
    
    try:
        for idx, item in enumerate(items_field.value_array):
            if hasattr(item, 'value_object'):
                item_data = item.value_object
                line_item = {
                    "item_number": idx + 1,
                    "Description": extract_field_value(item_data.get('Description')),
                    "ItemCode": extract_field_value(item_data.get('ProductCode')),
                    "Quantity": extract_field_value(item_data.get('Quantity')),
                    "UnitOfMeasure": extract_field_value(item_data.get('Unit')),
                    "UnitPrice": extract_field_value(item_data.get('UnitPrice')),
                    "Discount": extract_field_value(item_data.get('Discount')),
                    "NetAmount": extract_field_value(item_data.get('Amount')),
                    "TaxRate": extract_field_value(item_data.get('TaxRate')),
                    "TaxAmount": extract_field_value(item_data.get('TaxAmount')),
                    "GrossAmount": extract_field_value(item_data.get('TotalPrice')),
                }
                # Remove None values and empty fields
                line_item = {k: v for k, v in line_item.items() if v is not None and v != ""}
                if line_item:
                    line_items.append(line_item)
                    
    except Exception as e:
        print(f"⚠️ Error extracting line items from Azure: {e}")
    
    return line_items

def extract_line_items_from_text(text_content):
    """Extract line items from raw text using pattern matching"""
    line_items = []
    
    try:
        lines = text_content.split('\n')
        
        # Table header patterns - more comprehensive
        table_header_patterns = [
            r'description.*qty.*price.*amount',
            r'item.*quantity.*unit.*total',
            r'product.*qty.*rate.*amount',
            r'description.*quantity.*unit price.*total',
            r'item.*description.*amount',
            r'sr.*no.*description.*amount',
            r'no.*description.*quantity.*price',
            r'line.*item.*description.*total',
            r'service.*description.*amount',
            r'charge.*description.*amount',
        ]
        
        # Find table start by looking for headers
        table_start = -1
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if any(re.search(pattern, line_lower) for pattern in table_header_patterns):
                table_start = i + 1
                print(f"📋 Found table header at line {i}: {line}")
                break
        
        # If no clear header found, look for numbered items
        if table_start == -1:
            for i, line in enumerate(lines):
                if (re.match(r'^\d+\.', line.strip()) or 
                    re.match(r'^item\s*\d+', line.lower().strip()) or
                    re.match(r'^\d+\s+[A-Za-z]', line.strip())):
                    table_start = i
                    break
        
        if table_start == -1:
            print("❌ No line item table found in text")
            return line_items
        
        print(f"🔍 Scanning for line items starting from line {table_start}")
        
        # Extract table rows - more lines to handle multi-line descriptions
        for i in range(table_start, min(table_start + 100, len(lines))):
            line = lines[i].strip()
            if not line:
                continue
                
            # Skip lines that are clearly not line items
            if any(keyword in line.lower() for keyword in [
                'subtotal', 'total', 'tax', 'balance', 'grand total', 
                'amount due', 'thank you', 'terms', 'payment'
            ]):
                print(f"⏹️ Stopping at summary line: {line}")
                break
                
            # Skip header-like lines
            if any(keyword in line.lower() for keyword in [
                'description', 'qty', 'quantity', 'price', 'amount', 
                'unit', 'rate', 'total', 'item no', 'sr no'
            ]):
                continue
            
            # Try to parse as line item
            line_item = parse_line_item_text(line, len(line_items) + 1)
            if line_item and validate_line_item(line_item):
                line_items.append(line_item)
                print(f"   ✅ Line item {len(line_items)}: {line_item.get('Description', 'N/A')[:50]}...")
    
    except Exception as e:
        print(f"⚠️ Error extracting line items from text: {e}")
    
    return line_items

def parse_line_item_text(line_text, item_number):
    """Parse a line of text into line item components"""
    try:
        # Clean the text
        clean_text = re.sub(r'\s+', ' ', line_text.strip())
        
        # Common line item patterns with better matching
        patterns = [
            # Pattern: "1. Description Qty UnitPrice Amount"
            r'^(\d+)\.?\s+(.+?)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+(\d+\.?\d*)$',
            # Pattern: "Description Qty UnitPrice Amount"
            r'^(.+?)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+(\d+\.?\d*)$',
            # Pattern: "ItemNo Description Amount"
            r'^(\d+)\.?\s+(.+?)\s+([$\d,\.]+)$',
            # Pattern: "Description - Quantity x UnitPrice = Amount"
            r'^(.+?)\s+[-]?\s*(\d+\.?\d*)\s*[x×]\s*([$\d,\.]+)\s*[=]?\s*([$\d,\.]+)$',
            # Pattern: "Description Amount"
            r'^(.+?)\s+([$\d,\.]+)$',
        ]
        
        for pattern in patterns:
            match = re.match(pattern, clean_text)
            if match:
                groups = match.groups()
                line_item = {"item_number": item_number}
                
                if len(groups) >= 5:
                    # Pattern with item no, description, qty, unit price, amount
                    line_item["ItemCode"] = groups[0]
                    line_item["Description"] = groups[1].strip()
                    line_item["Quantity"] = extract_number(groups[2])
                    line_item["UnitPrice"] = extract_currency(groups[3])
                    line_item["NetAmount"] = extract_currency(groups[4])
                elif len(groups) >= 4:
                    # Pattern with description, qty, unit price, amount
                    line_item["Description"] = groups[0].strip()
                    line_item["Quantity"] = extract_number(groups[1])
                    line_item["UnitPrice"] = extract_currency(groups[2])
                    line_item["NetAmount"] = extract_currency(groups[3])
                elif len(groups) >= 3:
                    # Pattern with item no, description, amount
                    if groups[0].isdigit():
                        line_item["ItemCode"] = groups[0]
                        line_item["Description"] = groups[1].strip()
                        line_item["NetAmount"] = extract_currency(groups[2])
                    else:
                        line_item["Description"] = groups[0].strip()
                        line_item["Quantity"] = extract_number(groups[1])
                        line_item["UnitPrice"] = extract_currency(groups[2])
                elif len(groups) >= 2:
                    # Simple pattern with description and amount
                    line_item["Description"] = groups[0].strip()
                    line_item["NetAmount"] = extract_currency(groups[1])
                
                # Calculate missing fields if possible
                if line_item.get("Quantity") and line_item.get("UnitPrice") and not line_item.get("NetAmount"):
                    line_item["NetAmount"] = line_item["Quantity"] * line_item["UnitPrice"]
                
                return line_item
        
        # Fallback: If no pattern matches, treat as description only
        amount = extract_currency_from_text(line_text)
        return {
            "item_number": item_number,
            "Description": clean_text,
            "NetAmount": amount
        }
        
    except Exception as e:
        print(f"⚠️ Error parsing line item text: {e}")
        return None

def extract_line_items_with_llm(text_content):
    """Use LLM to extract line items from complex text"""
    try:
        system_prompt = """
        You are an expert at extracting line items from invoices. Extract all line items and return as JSON array.
        Each line item should have: Description, Quantity, UnitPrice, NetAmount.
        Return ONLY valid JSON, no explanations.
        """
        
        user_prompt = f"""
        Extract line items from this invoice text. Return as JSON array:
        
        {text_content[:6000]}  # Limit text to avoid token limits
        
        Return format:
        [
          {{
            "item_number": 1,
            "Description": "Product or service name",
            "ItemCode": "SKU or code if available",
            "Quantity": 1,
            "UnitOfMeasure": "units/pcs/etc",
            "UnitPrice": 100.00,
            "Discount": 0.00,
            "NetAmount": 100.00,
            "TaxRate": 10.0,
            "TaxAmount": 10.00,
            "GrossAmount": 110.00
          }}
        ]
        For missing fields, use null. Return ONLY JSON.
        """
        
        response = azure_openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        
        llm_content = response.choices[0].message.content.strip()
        llm_content = re.sub(r'^```json\s*|\s*```$', '', llm_content)
        
        line_items = json.loads(llm_content)
        print(f"🧠 LLM extracted {len(line_items)} line items")
        return line_items
        
    except Exception as e:
        print(f"❌ LLM line item extraction failed: {e}")
        return []

def validate_line_item(line_item):
    """Validate if a line item is meaningful"""
    if not line_item:
        return False
    
    # Must have at least description or amount
    has_description = line_item.get("Description") and len(str(line_item["Description"]).strip()) > 2
    has_amount = line_item.get("NetAmount") is not None
    
    if not has_description and not has_amount:
        return False
    
    # Check if it's actually a total or summary line
    description = str(line_item.get("Description", "")).lower()
    if any(term in description for term in [
        'total', 'subtotal', 'tax', 'balance', 'amount due', 
        'grand total', 'balance due', 'payment', 'thank you'
    ]):
        return False
    
    # Check if description is too generic
    if description in ['', 'description', 'item', 'service', 'product']:
        return False
    
    return True

def extract_number(text):
    """Extract number from text"""
    if text is None:
        return None
    match = re.search(r'(\d+\.?\d*)', str(text))
    return float(match.group(1)) if match else None

def extract_currency(text):
    """Extract currency amount from text"""
    if text is None:
        return None
    # Handle both string and object types
    text_str = str(text)
    match = re.search(r'[\$€£¥]?\s*(\d+[,.]?\d*\.?\d*)', text_str)
    if match:
        return float(match.group(1).replace(',', ''))
    return None

def extract_currency_from_text(text):
    """Extract currency amount from any text"""
    matches = re.findall(r'[\$€£¥]?\s*(\d+[,.]?\d*\.?\d*)', str(text))
    if matches:
        return float(matches[-1].replace(',', ''))  # Take the last amount found
    return None

# =============================================================================
# LINE ITEMS COUNT CALCULATION
# =============================================================================

def calculate_line_items_count(invoice_dict):
    """Calculate and set LineItems_Count field"""
    line_items = invoice_dict.get("items", [])
    line_items_count = len(line_items)
    
    # Always set LineItems_Count, never "na"
    invoice_dict["fields"]["LineItems_Count"] = {
        "value": line_items_count,
        "confidence": 1.0 if line_items_count > 0 else 0.0,
        "method": "Calculated"
    }
    
    print(f"📈 LineItems_Count set to: {line_items_count}")
    return line_items_count

# =============================================================================
# AZURE DOCUMENT INTELLIGENCE EXTRACTION
# =============================================================================

def extract_with_azure_invoice(file_path):
    """Azure Document Intelligence Primary Extraction"""
    try:
        print(f"🔍 Azure DI extraction: {os.path.basename(file_path)}")
        
        with open(file_path, "rb") as f:
            poller = document_intelligence_client.begin_analyze_document(
                "prebuilt-invoice", 
                body=f,
                content_type="application/octet-stream"
            )
            invoices = poller.result()
        
        invoice_data = []
        
        for idx, invoice in enumerate(invoices.documents):
            invoice_dict = {
                "invoice_number": idx + 1,
                "source_file": os.path.basename(file_path),
                "fields": {},
                "items": [],
                "extraction_metadata": {
                    "methods_used": ["AzurePrebuiltInvoice"],
                    "confidence_scores": {},
                    "processing_timestamp": datetime.now().isoformat()
                }
            }
            
            fields = invoice.fields
            
            # Extract mapped fields
            for target_field, source_field in ENHANCED_FIELD_MAPPINGS.items():
                if source_field in fields:
                    field_value = extract_field_value(fields[source_field])
                    if field_value and field_value != "na":
                        invoice_dict["fields"][target_field] = {
                            "value": field_value,
                            "confidence": getattr(fields[source_field], 'confidence', 0.8),
                            "method": "AzurePrebuiltInvoice"
                        }
            
            # Extract line items using enhanced method
            if 'Items' in fields:
                text_content = extract_text_from_pdf(file_path)  # Get text for fallback
                line_items = extract_line_items_enhanced(fields['Items'], text_content)
                invoice_dict["items"] = line_items
            
            invoice_data.append(invoice_dict)
        
        return invoice_data[0] if invoice_data else None
        
    except Exception as e:
        print(f"❌ Azure extraction failed: {e}")
        return None

# =============================================================================
# OPENAI LLM EXTRACTION
# =============================================================================

def extract_with_openai_llm(text_content, file_path=None):
    """Use OpenAI LLM for intelligent field extraction"""
    print("🧠 Using OpenAI LLM for field extraction...")
    
    try:
        system_prompt = """
        You are an expert invoice data extraction specialist. Extract fields from the invoice text.
        Return ONLY valid JSON format with the exact field names. For missing fields, use "na".
        """

        user_prompt = f"""
        Extract invoice fields from this text. Return ONLY JSON:

        {text_content[:8000]}

        Return JSON format with these fields:
        {json.dumps(ALL_56_FIELDS, indent=2)}

        Important: For LineItems_Count, provide the actual number of line items found in the invoice.
        """

        response = azure_openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=3000
        )

        llm_content = response.choices[0].message.content.strip()
        llm_content = re.sub(r'^```json\s*|\s*```$', '', llm_content)
        
        llm_data = json.loads(llm_content)
        print(f"✅ OpenAI LLM extracted {len([v for v in llm_data.values() if v != 'na'])} fields")
        
        return llm_data
        
    except Exception as e:
        print(f"❌ OpenAI LLM extraction failed: {e}")
        return {}

# =============================================================================
# REGEX EXTRACTION
# =============================================================================

def extract_missing_fields_with_regex(text_content, invoice_dict):
    """Extract fields using comprehensive regex patterns"""
    print("🔍 Applying regex extraction for missing fields...")
    
    regex_data = {}
    extracted_count = 0
    
    for field_name, patterns in COMPREHENSIVE_REGEX_PATTERNS.items():
        # Skip if field already exists
        if field_name in invoice_dict.get("fields", {}):
            continue
            
        for pattern in patterns:
            match = re.search(pattern, text_content, re.IGNORECASE | re.MULTILINE)
            if match:
                value = match.group(1).strip() if match.groups() else match.group(0).strip()
                if value and len(value) > 0:
                    regex_data[field_name] = {
                        "value": value,
                        "confidence": 0.7,
                        "method": "Regex"
                    }
                    extracted_count += 1
                    break
    
    print(f"✅ Regex extracted {extracted_count} additional fields")
    return regex_data

# =============================================================================
# INTELLIGENT FIELD FUSION
# =============================================================================

def intelligent_field_fusion(azure_data, llm_data, regex_data):
    """Intelligently fuse data from all extraction sources"""
    print("🔄 Performing intelligent field fusion...")
    
    fused_fields = {}
    confidence_scores = {}
    extraction_methods = {}
    
    for field in ALL_56_FIELDS:
        candidates = []
        
        # Collect candidates from all sources
        if field in azure_data:
            candidates.append(("azure", azure_data[field], 0.9))
        
        if field in llm_data and llm_data[field] != "na":
            # Convert LLM simple values to structured format
            llm_value = {
                "value": llm_data[field],
                "confidence": 0.8,
                "method": "OpenAI_LLM"
            }
            candidates.append(("llm", llm_value, 0.8))
            
        if field in regex_data:
            candidates.append(("regex", regex_data[field], 0.7))
        
        if not candidates:
            fused_fields[field] = {
                "value": "na",
                "confidence": 0.0,
                "method": "NotAvailable"
            }
            continue
        
        # Sort by confidence and select best candidate
        candidates.sort(key=lambda x: x[2], reverse=True)
        best_source, best_value, best_confidence = candidates[0]
        
        fused_fields[field] = best_value
        confidence_scores[field] = best_confidence
        extraction_methods[field] = best_source
    
    return fused_fields, confidence_scores, extraction_methods

# =============================================================================
# DERIVED FIELDS CALCULATION
# =============================================================================

def calculate_derived_fields(invoice_dict, text_content=""):
    """Calculate derived fields from extracted data"""
    print("🔍 Calculating derived fields...")
    
    derived_count = 0
    
    # Calculate tax breakdown from line items
    line_items = invoice_dict.get("items", [])
    if line_items and "TaxTypeBreakdown" not in invoice_dict["fields"]:
        tax_breakdown = {}
        total_tax_from_items = 0.0
        
        for item in line_items:
            tax_amount = item.get("TaxAmount")
            if isinstance(tax_amount, (int, float)) and tax_amount > 0:
                total_tax_from_items += tax_amount
                tax_type = "Sales Tax"
                
                # Try to determine tax type from description
                description = str(item.get("Description", "")).lower()
                if 'vat' in description:
                    tax_type = "VAT"
                elif 'gst' in description:
                    tax_type = "GST"
                
                if tax_type in tax_breakdown:
                    tax_breakdown[tax_type] += tax_amount
                else:
                    tax_breakdown[tax_type] = tax_amount
        
        if tax_breakdown:
            invoice_dict["fields"]["TaxTypeBreakdown"] = {
                "value": tax_breakdown,
                "confidence": 0.7,
                "method": "CalculatedFromItems"
            }
            derived_count += 1
    
    # Set VendorCountry from VendorAddress if available
    if "VendorAddress" in invoice_dict["fields"] and "VendorCountry" not in invoice_dict["fields"]:
        vendor_address = invoice_dict["fields"]["VendorAddress"]["value"]
        if isinstance(vendor_address, dict) and vendor_address.get("country"):
            invoice_dict["fields"]["VendorCountry"] = {
                "value": vendor_address["country"],
                "confidence": invoice_dict["fields"]["VendorAddress"]["confidence"] * 0.9,
                "method": "DerivedFromAddress"
            }
            derived_count += 1
    
    print(f"✅ Derived {derived_count} calculated fields")
    return derived_count

# =============================================================================
# MAIN EXTRACTION FUNCTION
# =============================================================================

def enhanced_extract_invoice_data(file_path):
    """Comprehensive extraction with enhanced line item focus"""
    print(f"🚀 Starting enhanced extraction: {os.path.basename(file_path)}")
    
    # Initialize result structure
    final_result = {
        "invoice_number": 1,
        "source_file": os.path.basename(file_path),
        "fields": {},
        "items": [],  # This will store our line items
        "extraction_metadata": {
            "methods_used": [],
            "confidence_scores": {},
            "processing_timestamp": datetime.now().isoformat(),
            "extraction_strategies": [],
            "line_items_method": "None"
        }
    }
    
    # Extract text for all methods
    text_content = extract_text_from_pdf(file_path)
    
    # STRATEGY 1: Azure Document Intelligence
    azure_data = {}
    azure_items = []
    
    try:
        azure_result = extract_with_azure_invoice(file_path)
        if azure_result:
            azure_data = azure_result.get("fields", {})
            azure_items = azure_result.get("items", [])
            final_result["extraction_metadata"]["methods_used"].append("AzureDocumentIntelligence")
            final_result["extraction_metadata"]["extraction_strategies"].append("AzurePrebuiltInvoice")
            
            if azure_items:
                final_result["extraction_metadata"]["line_items_method"] = "Azure"
                print(f"✅ Azure extracted {len(azure_items)} line items")
    except Exception as e:
        print(f"❌ Azure extraction failed: {e}")
    
    # STRATEGY 2: Extract line items (priority)
    all_line_items = azure_items  # Start with Azure items
    
    # Fallback to text extraction if no Azure items
    if not all_line_items and text_content:
        text_items = extract_line_items_from_text(text_content)
        if text_items:
            all_line_items.extend(text_items)
            final_result["extraction_metadata"]["line_items_method"] = "TextExtraction"
            final_result["extraction_metadata"]["methods_used"].append("TextLineItems")
            print(f"✅ Text extraction found {len(text_items)} line items")
    
    # Final fallback to LLM
    if not all_line_items and text_content:
        llm_items = extract_line_items_with_llm(text_content)
        if llm_items:
            all_line_items.extend(llm_items)
            final_result["extraction_metadata"]["line_items_method"] = "LLM"
            final_result["extraction_metadata"]["methods_used"].append("LLMLineItems")
            print(f"✅ LLM extracted {len(llm_items)} line items")
    
    # Store the line items
    final_result["items"] = all_line_items
    
    # STRATEGY 3: Field extraction from other sources
    llm_data = {}
    if text_content:
        llm_data = extract_with_openai_llm(text_content, file_path)
        if llm_data:
            final_result["extraction_metadata"]["methods_used"].append("OpenAI_LLM_Text")
    
    # STRATEGY 4: Regex extraction
    regex_data = {}
    if text_content:
        regex_data = extract_missing_fields_with_regex(text_content, final_result)
        final_result["extraction_metadata"]["methods_used"].append("EnhancedRegex")
    
    # Fuse all field data
    fused_fields, confidence_scores, extraction_methods = intelligent_field_fusion(
        azure_data, llm_data, regex_data
    )
    
    final_result["fields"] = fused_fields
    final_result["extraction_metadata"]["confidence_scores"] = confidence_scores
    
    # STRATEGY 5: Calculate derived fields including line items count
    calculate_line_items_count(final_result)
    calculate_derived_fields(final_result, text_content)
    
    # STRATEGY 6: Set missing fields to 'na'
    for field in ALL_56_FIELDS:
        if field not in final_result["fields"]:
            final_result["fields"][field] = {
                "value": "na",
                "confidence": 0.0,
                "method": "NotAvailable"
            }
    
    final_result["extraction_metadata"]["extraction_strategies"].append("MissingFieldHandling")
    
    # Calculate extraction statistics
    total_fields = len(ALL_56_FIELDS)
    extracted_fields = len([f for f in final_result["fields"].keys() if final_result["fields"][f]["value"] != "na"])
    extraction_rate = (extracted_fields / total_fields) * 100
    
    line_items_count = len(all_line_items)
    
    print(f"📊 EXTRACTION SUMMARY:")
    print(f"   📈 Fields: {extracted_fields}/{total_fields} ({extraction_rate:.1f}%)")
    print(f"   📦 Line Items: {line_items_count}")
    print(f"   🔧 Line Items Method: {final_result['extraction_metadata']['line_items_method']}")
    print(f"   🎯 Methods: {', '.join(final_result['extraction_metadata']['methods_used'])}")
    
    return [final_result]

# =============================================================================
# FLASK APP AND PROCESSING FUNCTIONS
# =============================================================================

def sanitize_filename(filename):
    """Sanitize filename to be safe for Windows file system"""
    sanitized = re.sub(r'[<>:"/\\|?*#&${}~%]', '_', filename)
    sanitized = re.sub(r'_+', '_', sanitized)
    sanitized = sanitized.strip(' _')
    if len(sanitized) > 200:
        name, ext = os.path.splitext(sanitized)
        sanitized = name[:200-len(ext)] + ext
    return sanitized

def save_individual_json(invoice_data, filename):
    """Save individual invoice data as JSON file"""
    try:
        base_name = os.path.splitext(filename)[0]
        safe_base_name = sanitize_filename(base_name)
        json_filename = f"{safe_base_name}_extracted.json"
        json_filepath = os.path.join(json_output_folder, json_filename)
        
        os.makedirs(os.path.dirname(json_filepath), exist_ok=True)
        
        with open(json_filepath, 'w', encoding='utf-8') as json_file:
            json.dump(invoice_data, json_file, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved individual JSON: {json_filename}")
        return json_filename
    except Exception as e:
        print(f"❌ Failed to save JSON for {filename}: {e}")
        return None

def process_all_pdfs_in_folder(folder_path):
    """Process ALL PDF files in a folder and generate individual JSON files"""
    print(f"📁 Processing folder: {folder_path}")
    
    if not os.path.exists(folder_path):
        error_msg = f"Folder not found: {folder_path}"
        print(f"❌ {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "message": "Please create the 'invoices' folder and add PDF files"
        }
    
    pdf_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        error_msg = f"No PDF files found in {folder_path}"
        print(f"❌ {error_msg}")
        return {
            "success": False,
            "error": "No PDF files found",
            "message": error_msg
        }
    
    print(f"📁 Found {len(pdf_files)} PDF files in folder")
    
    results = []
    successful_files = 0
    failed_files = 0
    json_files_created = []
    
    for pdf_file in pdf_files:
        file_path = os.path.join(folder_path, pdf_file)
        print(f"🔄 Processing: {pdf_file}")
        
        try:
            result_data = enhanced_extract_invoice_data(file_path)
            result = {
                "success": True,
                "data": result_data,
                "filename": pdf_file,
                "message": f"Successfully processed {len(result_data)} invoice(s)"
            }
            
            # Save individual JSON file
            if result_data:
                json_filename = save_individual_json(result_data, pdf_file)
                if json_filename:
                    json_files_created.append(json_filename)
                    result["json_file"] = json_filename
                    successful_files += 1
                    print(f"✅ Success + JSON saved: {pdf_file}")
                else:
                    failed_files += 1
                    print(f"❌ JSON save failed: {pdf_file}")
            else:
                failed_files += 1
                print(f"❌ Processing failed: {pdf_file}")
                
            results.append(result)
                
        except Exception as e:
            print(f"❌ Error processing {pdf_file}: {e}")
            results.append({
                "success": False,
                "error": str(e),
                "filename": pdf_file,
                "message": f"Failed to process {pdf_file}"
            })
            failed_files += 1
    
    # Create Excel from all JSON files
    excel_result = create_excel_from_json_files()
    
    summary = {
        "total_files": len(pdf_files),
        "successful": successful_files,
        "failed": failed_files,
        "json_files_created": len(json_files_created),
        "excel_created": excel_result["success"]
    }
    
    print(f"📊 Processing complete: {summary}")
    
    return {
        "success": True,
        "results": results,
        "json_files": json_files_created,
        "excel_file": excel_result.get("excel_filename"),
        "excel_summary": excel_result.get("summary"),
        "summary": summary
    }

def create_excel_from_json_files():
    """Create single Excel file from all JSON files in the json_output_folder"""
    print(f"📊 Creating Excel from JSON files in: {json_output_folder}")
    
    # Create DataFrame
    rows = []
    json_files = [f for f in os.listdir(json_output_folder) if f.endswith('.json')]
    
    if not json_files:
        print("⚠️ No JSON files found to create Excel")
        return {
            "success": False,
            "error": "No JSON files found",
            "message": "No JSON files were created during processing"
        }
    
    print(f"📁 Found {len(json_files)} JSON files to process")
    
    for json_file in json_files:
        json_path = os.path.join(json_output_folder, json_file)
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                invoice_data = json.load(f)
            
            for invoice in invoice_data:
                row = {"Filename": invoice.get("source_file", json_file)}
                
                # Extract field values
                fields = invoice.get("fields", {})
                for field_name in ALL_56_FIELDS:
                    if field_name in fields:
                        field_data = fields[field_name]
                        value = field_data.get("value", None)
                        if value is not None and value != "na":
                            if isinstance(value, (dict, list)):
                                try:
                                    row[field_name] = json.dumps(value, ensure_ascii=False)
                                except:
                                    row[field_name] = str(value)
                            else:
                                row[field_name] = str(value)
                        else:
                            row[field_name] = "ne" if value == "na" else "ne"
                    else:
                        row[field_name] = "na"
                
                # Add line items count explicitly
                line_items = invoice.get("items", [])
                row["LineItems_Count_Actual"] = len(line_items)
                
                rows.append(row)
                print(f"📝 Added row from {json_file} with {len(line_items)} line items")
                
        except Exception as e:
            print(f"❌ Error processing JSON file {json_file}: {e}")
            row = {"Filename": json_file}
            for field_name in ALL_56_FIELDS:
                row[field_name] = "ne"
            rows.append(row)
    
    if not rows:
        print("⚠️ No data rows to process for Excel")
        return {"success": False, "error": "No data extracted from JSON files"}
    
    df = pd.DataFrame(rows)
    print(f"📊 Created DataFrame with {len(df)} rows and {len(df.columns)} columns")
    
    # Save to Excel
    excel_filename = f"consolidated_invoice_extraction_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    excel_filepath = os.path.join(output_folder, excel_filename)
    
    try:
        print(f"💾 Saving consolidated Excel: {excel_filepath}")
        
        with pd.ExcelWriter(excel_filepath, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Extracted_Data', index=False)
            
            worksheet = writer.sheets['Extracted_Data']
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
                
        print(f"✅ Consolidated Excel file created: {excel_filepath}")
        
        return {
            "success": True,
            "excel_filename": excel_filename,
            "excel_filepath": excel_filepath,
            "summary": {
                "total_invoices": len(rows),
                "total_fields": len(ALL_56_FIELDS),
                "json_files_processed": len(json_files)
            }
        }
        
    except Exception as e:
        print(f"❌ Excel creation failed: {e}")
        return {"success": False, "error": str(e), "message": "Failed to create Excel file"}

# =============================================================================
# FILE UPLOAD ENDPOINTS
# =============================================================================

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    """Upload single PDF to invoices folder"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file provided'})
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'})
        
        if file and file.filename.lower().endswith('.pdf'):
            # Ensure invoices folder exists
            os.makedirs("invoices", exist_ok=True)
            
            filename = sanitize_filename(file.filename)
            file_path = os.path.join("invoices", filename)
            file.save(file_path)
            
            print(f"✅ File uploaded: {filename}")
            return jsonify({
                'success': True, 
                'filename': filename, 
                'message': 'File uploaded successfully'
            })
        
        return jsonify({'success': False, 'error': 'Invalid file type. Only PDF allowed.'})
    
    except Exception as e:
        print(f"❌ Upload failed: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/upload-multiple-pdfs', methods=['POST'])
def upload_multiple_pdfs():
    """Upload multiple PDFs to invoices folder"""
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'error': 'No files provided'})
        
        files = request.files.getlist('files')
        if not files or files[0].filename == '':
            return jsonify({'success': False, 'error': 'No files selected'})
        
        # Ensure invoices folder exists
        os.makedirs("invoices", exist_ok=True)
        
        uploaded_files = []
        failed_files = []
        
        for file in files:
            if file and file.filename.lower().endswith('.pdf'):
                filename = sanitize_filename(file.filename)
                file_path = os.path.join("invoices", filename)
                file.save(file_path)
                uploaded_files.append(filename)
                print(f"✅ File uploaded: {filename}")
            else:
                failed_files.append(file.filename)
        
        result = {
            'success': True,
            'uploaded_files': uploaded_files,
            'failed_files': failed_files,
            'message': f'Successfully uploaded {len(uploaded_files)} files'
        }
        
        if failed_files:
            result['warning'] = f'{len(failed_files)} files failed to upload (not PDF)'
        
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Multiple upload failed: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/list-uploaded-files', methods=['GET'])
def list_uploaded_files():
    """List all PDF files in invoices folder"""
    try:
        if not os.path.exists("invoices"):
            return jsonify({'success': True, 'files': []})
        
        pdf_files = [f for f in os.listdir("invoices") if f.lower().endswith('.pdf')]
        return jsonify({
            'success': True, 
            'files': pdf_files,
            'count': len(pdf_files)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/delete-file/<filename>', methods=['DELETE'])
def delete_file(filename):
    """Delete a specific file from invoices folder"""
    try:
        safe_filename = sanitize_filename(filename)
        file_path = os.path.join("invoices", safe_filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'success': True, 'message': f'File {safe_filename} deleted'})
        else:
            return jsonify({'success': False, 'error': 'File not found'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/clear-all-files', methods=['DELETE'])
def clear_all_files():
    """Delete all files from invoices folder"""
    try:
        if not os.path.exists("invoices"):
            return jsonify({'success': True, 'message': 'No files to delete'})
        
        pdf_files = [f for f in os.listdir("invoices") if f.lower().endswith('.pdf')]
        deleted_count = 0
        
        for pdf_file in pdf_files:
            file_path = os.path.join("invoices", pdf_file)
            os.remove(file_path)
            deleted_count += 1
        
        return jsonify({
            'success': True, 
            'message': f'Deleted {deleted_count} files',
            'deleted_count': deleted_count
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/process-uploaded-files', methods=['POST'])
def process_uploaded_files():
    """Process all uploaded PDF files in the invoices folder"""
    print("🚀 Received request to process uploaded files")
    try:
        result = process_all_pdfs_in_folder("invoices")
        print(f"✅ Uploaded files processing completed: {result.get('success', False)}")
        return jsonify(result)
    except Exception as e:
        print(f"❌ Uploaded files processing failed: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to process uploaded files"
        }), 500

# =============================================================================
# EXISTING ENDPOINTS (UNCHANGED)
# =============================================================================

@app.route('/process-folder', methods=['POST'])
def process_folder():
    """Process ALL PDF files in the invoices folder"""
    print("🚀 Received request to process folder")
    try:
        result = process_all_pdfs_in_folder("invoices")
        print(f"✅ Folder processing completed: {result.get('success', False)}")
        return jsonify(result)
    except Exception as e:
        print(f"❌ Folder processing failed: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to process folder"
        }), 500

@app.route('/create-excel-from-json', methods=['POST'])
def create_excel_from_json():
    """Create Excel file from existing JSON files"""
    try:
        result = create_excel_from_json_files()
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to create Excel from JSON files"
        }), 500

@app.route('/check-folders', methods=['GET'])
def check_folders():
    """Check if folders exist and show files"""
    folders_info = {
        "pdf_source_folder": {
            "path": "invoices",
            "exists": os.path.exists("invoices"),
            "files": []
        },
        "json_output_folder": {
            "path": json_output_folder,
            "exists": os.path.exists(json_output_folder),
            "files": []
        },
        "output_folder": {
            "path": output_folder,
            "exists": os.path.exists(output_folder),
            "files": []
        }
    }
    
    if folders_info["pdf_source_folder"]["exists"]:
        folders_info["pdf_source_folder"]["files"] = [f for f in os.listdir("invoices") if f.lower().endswith('.pdf')]
    
    if folders_info["json_output_folder"]["exists"]:
        folders_info["json_output_folder"]["files"] = [f for f in os.listdir(json_output_folder) if f.endswith('.json')]
    
    if folders_info["output_folder"]["exists"]:
        folders_info["output_folder"]["files"] = [f for f in os.listdir(output_folder) if f.endswith(('.xlsx', '.csv'))]
    
    return jsonify(folders_info)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    # Check if invoices folder exists and count files
    pdf_count = 0
    if os.path.exists("invoices"):
        pdf_count = len([f for f in os.listdir("invoices") if f.lower().endswith('.pdf')])
    
    return jsonify({
        "status": "healthy",
        "service": "Enhanced Invoice Extraction API with File Upload",
        "version": "4.2.0",
        "fields_supported": 56,
        "uploaded_files_count": pdf_count,
        "endpoints": {
            "upload": ["/upload-pdf", "/upload-multiple-pdfs"],
            "management": ["/list-uploaded-files", "/delete-file/<name>", "/clear-all-files"],
            "processing": ["/process-uploaded-files", "/process-folder", "/create-excel-from-json"],
            "info": ["/check-folders", "/health"]
        },
        "line_item_extraction": {
            "methods": ["Azure DI", "Text Pattern", "LLM Analysis"],
            "fields_per_item": ["Description", "Quantity", "UnitPrice", "NetAmount", "TaxRate", "TaxAmount", "GrossAmount"]
        }
    })

if __name__ == '__main__':
    print("🚀 Starting Enhanced Invoice Extraction API with File Upload...")
    print("📁 Folder structure:")
    print(f"   - PDF Upload: ./invoices/")
    print(f"   - JSON Output: {json_output_folder}")
    print(f"   - Excel Output: {output_folder}")
    print("\n📦 File Upload Features:")
    print("   - Single PDF upload")
    print("   - Multiple PDF upload") 
    print("   - File management (list, delete, clear)")
    print("   - Process uploaded files")
    print("\n📊 Line Item Extraction:")
    print("   - Azure Document Intelligence (Primary)")
    print("   - Text pattern matching (Fallback)")
    print("   - LLM analysis (Complex cases)")
    print("\n🎯 API Endpoints:")
    print("   - POST /upload-pdf - Upload single PDF")
    print("   - POST /upload-multiple-pdfs - Upload multiple PDFs")
    print("   - GET /list-uploaded-files - List uploaded files")
    print("   - DELETE /delete-file/<name> - Delete specific file")
    print("   - DELETE /clear-all-files - Clear all files")
    print("   - POST /process-uploaded-files - Process uploaded PDFs")
    print("   - POST /process-folder - Process all PDFs in folder")
    print("   - POST /create-excel-from-json - Create Excel from JSON")
    print("   - GET /check-folders - Check folder status")
    
    app.run(debug=True, host='0.0.0.0', port=5000)