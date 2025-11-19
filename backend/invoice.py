import os
import json
import glob
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

endpoint = os.environ["DOCUMENTINTELLIGENCE_ENDPOINT"]
key = os.environ["DOCUMENTINTELLIGENCE_API_KEY"]

document_intelligence_client = DocumentIntelligenceClient(
    endpoint=endpoint, credential=AzureKeyCredential(key)
)

# Find all PDF files in current directory AND all subdirectories
pdf_files = glob.glob("**/*.pdf", recursive=True)

if not pdf_files:
    print("❌ No PDF files found in current directory or subdirectories")
    print("Current working directory:", os.getcwd())
    print("Please make sure your PDF files are in this directory or its subdirectories")
    exit()

print(f"📁 Found {len(pdf_files)} PDF files to process")
print("Files found:")
for pdf_file in pdf_files:
    print(f"  - {pdf_file}")

# Create output folder if it doesn't exist
output_folder = "output"
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

successful_files = 0
failed_files = 0

for pdf_file in pdf_files:
    try:
        print(f"\n🔍 Processing: {pdf_file}")
        
        with open(pdf_file, "rb") as f:
            # Try different parameter combinations for different SDK versions
            try:
                # Try the newer SDK syntax first
                poller = document_intelligence_client.begin_analyze_document(
                    "prebuilt-invoice", 
                    body=f,
                    content_type="application/octet-stream"
                )
            except TypeError:
                # Fallback to older syntax
                poller = document_intelligence_client.begin_analyze_document(
                    "prebuilt-invoice", 
                    analyze_request=f,
                    content_type="application/octet-stream"
                )
            
            invoices = poller.result()
        
        invoice_data = []
        
        for idx, invoice in enumerate(invoices.documents):
            print("--------Recognizing invoice #{}--------".format(idx + 1))
            
            invoice_dict = {
                "invoice_number": idx + 1,
                "source_file": pdf_file,
                "fields": {}
            }
            
            vendor_name = invoice.fields.get("VendorName")
            if vendor_name:
                print(
                    "Vendor Name: {} has confidence: {}".format(
                        vendor_name.value_string, vendor_name.confidence
                    )
                )
                invoice_dict["fields"]["VendorName"] = {
                    "value": vendor_name.value_string,
                    "confidence": vendor_name.confidence
                }
            
            vendor_address = invoice.fields.get("VendorAddress")
            if vendor_address:
                print(
                    "Vendor Address: {} has confidence: {}".format(
                        vendor_address.value_address, vendor_address.confidence
                    )
                )
                invoice_dict["fields"]["VendorAddress"] = {
                    "value": str(vendor_address.value_address),
                    "confidence": vendor_address.confidence
                }
            
            vendor_address_recipient = invoice.fields.get("VendorAddressRecipient")
            if vendor_address_recipient:
                print(
                    "Vendor Address Recipient: {} has confidence: {}".format(
                        vendor_address_recipient.value_string, vendor_address_recipient.confidence
                    )
                )
                invoice_dict["fields"]["VendorAddressRecipient"] = {
                    "value": vendor_address_recipient.value_string,
                    "confidence": vendor_address_recipient.confidence
                }
            
            customer_name = invoice.fields.get("CustomerName")
            if customer_name:
                print(
                    "Customer Name: {} has confidence: {}".format(
                        customer_name.value_string, customer_name.confidence
                    )
                )
                invoice_dict["fields"]["CustomerName"] = {
                    "value": customer_name.value_string,
                    "confidence": customer_name.confidence
                }
            
            customer_id = invoice.fields.get("CustomerId")
            if customer_id:
                print(
                    "Customer Id: {} has confidence: {}".format(
                        customer_id.value_string, customer_id.confidence
                    )
                )
                invoice_dict["fields"]["CustomerId"] = {
                    "value": customer_id.value_string,
                    "confidence": customer_id.confidence
                }
            
            customer_address = invoice.fields.get("CustomerAddress")
            if customer_address:
                print(
                    "Customer Address: {} has confidence: {}".format(
                        customer_address.value_address, customer_address.confidence
                    )
                )
                invoice_dict["fields"]["CustomerAddress"] = {
                    "value": str(customer_address.value_address),
                    "confidence": customer_address.confidence
                }
            
            customer_address_recipient = invoice.fields.get("CustomerAddressRecipient")
            if customer_address_recipient:
                print(
                    "Customer Address Recipient: {} has confidence: {}".format(
                        customer_address_recipient.value_string,
                        customer_address_recipient.confidence,
                    )
                )
                invoice_dict["fields"]["CustomerAddressRecipient"] = {
                    "value": customer_address_recipient.value_string,
                    "confidence": customer_address_recipient.confidence
                }
            
            invoice_id = invoice.fields.get("InvoiceId")
            if invoice_id:
                print(
                    "Invoice Id: {} has confidence: {}".format(
                        invoice_id.value_string, invoice_id.confidence
                    )
                )
                invoice_dict["fields"]["InvoiceId"] = {
                    "value": invoice_id.value_string,
                    "confidence": invoice_id.confidence
                }
            
            invoice_date = invoice.fields.get("InvoiceDate")
            if invoice_date:
                print(
                    "Invoice Date: {} has confidence: {}".format(
                        invoice_date.value_date, invoice_date.confidence
                    )
                )
                invoice_dict["fields"]["InvoiceDate"] = {
                    "value": str(invoice_date.value_date),
                    "confidence": invoice_date.confidence
                }
            
            invoice_total = invoice.fields.get("InvoiceTotal")
            if invoice_total:
                print(
                    "Invoice Total: {} has confidence: {}".format(
                        invoice_total.value_currency.amount, invoice_total.confidence
                    )
                )
                invoice_dict["fields"]["InvoiceTotal"] = {
                    "value": invoice_total.value_currency.amount,
                    "currency": invoice_total.value_currency.currency_symbol,
                    "confidence": invoice_total.confidence
                }
            
            due_date = invoice.fields.get("DueDate")
            if due_date:
                print(
                    "Due Date: {} has confidence: {}".format(
                        due_date.value_date, due_date.confidence
                    )
                )
                invoice_dict["fields"]["DueDate"] = {
                    "value": str(due_date.value_date),
                    "confidence": due_date.confidence
                }
            
            purchase_order = invoice.fields.get("PurchaseOrder")
            if purchase_order:
                print(
                    "Purchase Order: {} has confidence: {}".format(
                        purchase_order.value_string, purchase_order.confidence
                    )
                )
                invoice_dict["fields"]["PurchaseOrder"] = {
                    "value": purchase_order.value_string,
                    "confidence": purchase_order.confidence
                }
            
            billing_address = invoice.fields.get("BillingAddress")
            if billing_address:
                print(
                    "Billing Address: {} has confidence: {}".format(
                        billing_address.value_address, billing_address.confidence
                    )
                )
                invoice_dict["fields"]["BillingAddress"] = {
                    "value": str(billing_address.value_address),
                    "confidence": billing_address.confidence
                }
            
            shipping_address = invoice.fields.get("ShippingAddress")
            if shipping_address:
                print(
                    "Shipping Address: {} has confidence: {}".format(
                        shipping_address.value_address, shipping_address.confidence
                    )
                )
                invoice_dict["fields"]["ShippingAddress"] = {
                    "value": str(shipping_address.value_address),
                    "confidence": shipping_address.confidence
                }
            
            # Add items to the invoice
            invoice_dict["items"] = []
            print("Invoice items:")
            if invoice.fields.get("Items"):
                for item_idx, item in enumerate(invoice.fields.get("Items").value_array):
                    print("...Item #{}".format(item_idx + 1))
                    item_dict = {"item_number": item_idx + 1}
                    
                    item_description = item.value_object.get("Description")
                    if item_description:
                        print(
                            "......Description: {} has confidence: {}".format(
                                item_description.value_string, item_description.confidence
                            )
                        )
                        item_dict["Description"] = {
                            "value": item_description.value_string,
                            "confidence": item_description.confidence
                        }
                    
                    item_quantity = item.value_object.get("Quantity")
                    if item_quantity:
                        print(
                            "......Quantity: {} has confidence: {}".format(
                                item_quantity.value_number, item_quantity.confidence
                            )
                        )
                        item_dict["Quantity"] = {
                            "value": item_quantity.value_number,
                            "confidence": item_quantity.confidence
                        }
                    
                    unit_price = item.value_object.get("UnitPrice")
                    if unit_price:
                        print(
                            "......Unit Price: {} has confidence: {}".format(
                                unit_price.value_currency.amount, unit_price.confidence
                            )
                        )
                        item_dict["UnitPrice"] = {
                            "value": unit_price.value_currency.amount,
                            "currency": unit_price.value_currency.currency_symbol,
                            "confidence": unit_price.confidence
                        }
                    
                    amount = item.value_object.get("Amount")
                    if amount:
                        print(
                            "......Amount: {} has confidence: {}".format(
                                amount.value_currency.amount, amount.confidence
                            )
                        )
                        item_dict["Amount"] = {
                            "value": amount.value_currency.amount,
                            "currency": amount.value_currency.currency_symbol,
                            "confidence": amount.confidence
                        }
                    
                    invoice_dict["items"].append(item_dict)
            
            invoice_data.append(invoice_dict)
            print("----------------------------------------")
        
        # Create JSON filename based on original PDF name
        base_name = os.path.splitext(os.path.basename(pdf_file))[0]
        json_filename = f"{base_name}_extracted.json"
        json_filepath = os.path.join(output_folder, json_filename)
        
        # Write to JSON file
        with open(json_filepath, 'w', encoding='utf-8') as json_file:
            json.dump(invoice_data, json_file, indent=2, ensure_ascii=False)
        
        print(f"✅ Saved: {json_filename}")
        successful_files += 1
        
    except Exception as e:
        print(f"❌ Error processing {pdf_file}: {e}")
        failed_files += 1

# Print summary
print("\n" + "="*50)
print("📊 PROCESSING SUMMARY")
print(f"✅ Successful: {successful_files} files")
print(f"❌ Failed: {failed_files} files")
print(f"📁 Output folder: {output_folder}")
print("="*50)