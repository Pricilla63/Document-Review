// import { Accordion, AccordionItem, TextInput } from "carbon-components-react";

// import { useEffect, useState } from "react";

// const GenericInputFields = ({ data, schema, setHoveredKey }) => {
//   const extractionData = data?.extraction_json || {};

//   const [formData, setFormData] = useState(extractionData);

//   useEffect(() => {
//     setFormData(extractionData);
//   }, [extractionData]);

//   const handleMouseEnter = (key, pageNum) => {
//     if (key && pageNum != null) {
//       setHoveredKey({ key, pageNum });
//     }
//   };

//   const handleMouseLeave = () => {
//     setHoveredKey({ key: null, pageNum: null });
//   };

//   const handleInputChange = (field, value) => {
//     const oldValue = formData[field];

//     const newValue =
//       typeof oldValue === "object" && oldValue !== null && "value" in oldValue
//         ? { ...oldValue, value }
//         : value;

//     setFormData((prev) => ({
//       ...prev,

//       [field]: newValue,
//     }));
//   };

//   const handleSectionChange = (index, field, value) => {
//     const sectionData = [...(formData[schema.sectionKey] || [])];

//     if (!sectionData[index]) sectionData[index] = {};

//     const oldFieldValue = sectionData[index][field];

//     sectionData[index][field] =
//       typeof oldFieldValue === "object" &&
//       oldFieldValue !== null &&
//       "value" in oldFieldValue
//         ? { ...oldFieldValue, value }
//         : value;

//     setFormData((prev) => ({
//       ...prev,

//       [schema.sectionKey]: sectionData,
//     }));
//   };

//   const flatFields = schema.flatFields || [];

//   const sectionData = formData[schema.sectionKey] || [];

//   const titleField = schema.sectionTitleField;

//   return (
//     <div
//       style={{
//         padding: "10px 20px",

//         display: "flex",

//         flexDirection: "column",

//         gap: "15px",
//       }}
//     >
//       {flatFields.map((field) => (
//         <div
//           key={field}
//           id={`json-${field}`}
//           onMouseEnter={() => {
//             let coordinatesData =
//               data.extraction_json_with_coordinates || data.extraction_json;

//             const coords = coordinatesData?.[field]?.coordinates;

//             if (coords == null) return;

//             handleMouseEnter(field, coordinatesData?.[field]?.page_num);
//           }}
//           onMouseLeave={handleMouseLeave}
//         >
//           <TextInput
//             id={field.toLowerCase().replace(/\s+/g, "-")}
//             type="text"
//             labelText={field}
//             value={
//               typeof formData[field] === "object"
//                 ? formData[field]?.value || ""
//                 : formData[field] || ""
//             }
//             onChange={(e) => handleInputChange(field, e.target.value)}
//           />
//         </div>
//       ))}

//       <Accordion>
//         {sectionData.map((entry, index) => {
//           const dynamicTitleRaw = titleField ? entry?.[titleField] : null;

//           const dynamicTitle =
//             typeof dynamicTitleRaw === "object" && dynamicTitleRaw !== null
//               ? dynamicTitleRaw.value || `${schema.sectionTitle} ${index + 1}`
//               : dynamicTitleRaw || `${schema.sectionTitle} ${index + 1}`;

//           return (
//             <AccordionItem
//               key={`${schema.sectionKey}-${index}`}
//               title={dynamicTitle}
//             >
//               {schema.sectionFields.map((field) => (
//                 <div
//                   key={`${field}-${index}`}
//                   id={`json-${field}-${index}`}
//                   onMouseEnter={() => {
//                     let coordinatesData =
//                       data.extraction_json_with_coordinates ||
//                       data.extraction_json;

//                     const coords =
//                       coordinatesData?.[schema.sectionKey]?.[index]?.[field]
//                         ?.coordinates ||
//                       coordinatesData?.[schema.sectionKey]?.[index]
//                         ?.coordinates;

//                     if (coords == null) return;

//                     handleMouseEnter(
//                       `${field}-${index}`,

//                       coordinatesData?.[schema.sectionKey]?.[index]?.[field]
//                         ?.page_num ||
//                         coordinatesData?.[schema.sectionKey]?.[index]?.page_num
//                     );
//                   }}
//                   onMouseLeave={handleMouseLeave}
//                 >
//                   <TextInput
//                     id={`${field.toLowerCase()}-${index}`}
//                     type="text"
//                     labelText={field.replace(/([A-Z])/g, " $1").trim()}
//                     value={
//                       typeof entry[field] === "object"
//                         ? entry[field]?.value || ""
//                         : entry[field] || ""
//                     }
//                     onChange={(e) =>
//                       handleSectionChange(index, field, e.target.value)
//                     }
//                   />
//                 </div>
//               ))}
//             </AccordionItem>
//           );
//         })}
//       </Accordion>
//     </div>
//   );
// };

// export default GenericInputFields;



import { 
  Accordion, 
  AccordionItem, 
  TextInput, 
  NumberInput,
  Select,
  SelectItem,
  TextArea,
  Checkbox,
  DatePicker,
  DatePickerInput
} from "carbon-components-react";
import { useEffect, useState } from "react";

const GenericInputFields = ({ data, schema, setHoveredKey }) => {
  const extractionData = data?.extraction_json || {};

  const [formData, setFormData] = useState(extractionData);

  useEffect(() => {
    setFormData(extractionData);
  }, [extractionData]);

  const handleMouseEnter = (key, pageNum) => {
    if (key && pageNum != null) {
      setHoveredKey({ key, pageNum });
    }
  };

  const handleMouseLeave = () => {
    setHoveredKey({ key: null, pageNum: null });
  };

  const handleInputChange = (field, value) => {
    const oldValue = formData[field];

    const newValue =
      typeof oldValue === "object" && oldValue !== null && "value" in oldValue
        ? { ...oldValue, value }
        : value;

    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleSectionChange = (index, field, value) => {
    const sectionData = [...(formData[schema.sectionKey] || [])];

    if (!sectionData[index]) sectionData[index] = {};

    const oldFieldValue = sectionData[index][field];

    sectionData[index][field] =
      typeof oldFieldValue === "object" &&
      oldFieldValue !== null &&
      "value" in oldFieldValue
        ? { ...oldFieldValue, value }
        : value;

    setFormData((prev) => ({
      ...prev,
      [schema.sectionKey]: sectionData,
    }));
  };

  // Field categorization for better organization
  const categorizeFields = (fields) => {
    const categories = {
      vendor: [],
      buyer: [],
      header: [],
      financials: [],
      compliance: [],
      approval: []
    };

    fields.forEach(field => {
      if (field.includes('Vendor')) categories.vendor.push(field);
      else if (field.includes('Client') || field.includes('Billing') || field.includes('Shipping')) categories.buyer.push(field);
      else if (field.includes('Invoice') || field.includes('PO') || field.includes('Payment') || field.includes('Service')) categories.header.push(field);
      else if (field.includes('Tax') || field.includes('Amount') || field.includes('Subtotal') || field.includes('Total')) categories.financials.push(field);
      else if (field.includes('Approval')) categories.approval.push(field);
      else categories.compliance.push(field);
    });

    return categories;
  };

  const flatFields = schema.flatFields || [];
  const categorizedFields = categorizeFields(flatFields);
  const sectionData = formData[schema.sectionKey] || [];
  const titleField = schema.sectionTitleField;

  // Render appropriate input based on field type
  const renderFieldInput = (field, value) => {
    const stringValue = typeof value === "object" ? value?.value || "" : value || "";
    
    // Currency fields
    if (field.includes('Amount') || field.includes('Price') || field.includes('Total') || field.includes('Tax')) {
      return (
        <NumberInput
          id={field.toLowerCase().replace(/\s+/g, "-")}
          label={field}
          value={stringValue}
          onChange={(e) => handleInputChange(field, e.imaginaryTarget.value)}
          step={0.01}
        />
      );
    }
    
    // Date fields
    else if (field.includes('Date') || field.includes('period')) {
      return (
        <DatePicker
          dateFormat="m/d/Y"
          datePickerType="single"
        >
          <DatePickerInput
            id={field.toLowerCase().replace(/\s+/g, "-")}
            placeholder="mm/dd/yyyy"
            labelText={field}
            value={stringValue}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        </DatePicker>
      );
    }
    
    // Email fields
    else if (field.includes('Email')) {
      return (
        <TextInput
          id={field.toLowerCase().replace(/\s+/g, "-")}
          type="email"
          labelText={field}
          value={stringValue}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      );
    }
    
    // Website fields
    else if (field.includes('Website')) {
      return (
        <TextInput
          id={field.toLowerCase().replace(/\s+/g, "-")}
          type="url"
          labelText={field}
          value={stringValue}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      );
    }
    
    // Notes/Description fields
    else if (field.includes('Notes') || field.includes('Terms') || field.includes('Description')) {
      return (
        <TextArea
          id={field.toLowerCase().replace(/\s+/g, "-")}
          labelText={field}
          value={stringValue}
          onChange={(e) => handleInputChange(field, e.target.value)}
          rows={3}
        />
      );
    }
    
    // Boolean fields
    else if (field.includes('Approval Required')) {
      const boolValue = stringValue === 'true' || stringValue === true;
      return (
        <Checkbox
          id={field.toLowerCase().replace(/\s+/g, "-")}
          labelText={field}
          checked={boolValue}
          onChange={(checked) => handleInputChange(field, checked)}
        />
      );
    }
    
    // Default text input
    else {
      return (
        <TextInput
          id={field.toLowerCase().replace(/\s+/g, "-")}
          type="text"
          labelText={field}
          value={stringValue}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      );
    }
  };

  return (
    <div style={{
      padding: "10px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    }}>
      {/* Vendor Information Section */}
      {categorizedFields.vendor.length > 0 && (
        <AccordionItem title="Vendor Information" open>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {categorizedFields.vendor.map((field) => (
              <div
                key={field}
                id={`json-${field}`}
                onMouseEnter={() => {
                  let coordinatesData = data.extraction_json_with_coordinates || data.extraction_json;
                  const coords = coordinatesData?.[field]?.coordinates;
                  if (coords == null) return;
                  handleMouseEnter(field, coordinatesData?.[field]?.page_num);
                }}
                onMouseLeave={handleMouseLeave}
              >
                {renderFieldInput(field, formData[field])}
              </div>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Buyer Information Section */}
      {categorizedFields.buyer.length > 0 && (
        <AccordionItem title="Buyer Information" open>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {categorizedFields.buyer.map((field) => (
              <div
                key={field}
                id={`json-${field}`}
                onMouseEnter={() => {
                  let coordinatesData = data.extraction_json_with_coordinates || data.extraction_json;
                  const coords = coordinatesData?.[field]?.coordinates;
                  if (coords == null) return;
                  handleMouseEnter(field, coordinatesData?.[field]?.page_num);
                }}
                onMouseLeave={handleMouseLeave}
              >
                {renderFieldInput(field, formData[field])}
              </div>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Invoice Header Section */}
      {categorizedFields.header.length > 0 && (
        <AccordionItem title="Invoice Header" open>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {categorizedFields.header.map((field) => (
              <div
                key={field}
                id={`json-${field}`}
                onMouseEnter={() => {
                  let coordinatesData = data.extraction_json_with_coordinates || data.extraction_json;
                  const coords = coordinatesData?.[field]?.coordinates;
                  if (coords == null) return;
                  handleMouseEnter(field, coordinatesData?.[field]?.page_num);
                }}
                onMouseLeave={handleMouseLeave}
              >
                {renderFieldInput(field, formData[field])}
              </div>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Line Items Section */}
      {schema.sectionKey && (
        <AccordionItem title="Line Items" open>
          <Accordion>
            {sectionData.map((entry, index) => {
              const dynamicTitleRaw = titleField ? entry?.[titleField] : null;
              const dynamicTitle =
                typeof dynamicTitleRaw === "object" && dynamicTitleRaw !== null
                  ? dynamicTitleRaw.value || `${schema.sectionTitle} ${index + 1}`
                  : dynamicTitleRaw || `${schema.sectionTitle} ${index + 1}`;

              return (
                <AccordionItem
                  key={`${schema.sectionKey}-${index}`}
                  title={dynamicTitle}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {schema.sectionFields.map((field) => (
                      <div
                        key={`${field}-${index}`}
                        id={`json-${field}-${index}`}
                        onMouseEnter={() => {
                          let coordinatesData = data.extraction_json_with_coordinates || data.extraction_json;
                          const coords =
                            coordinatesData?.[schema.sectionKey]?.[index]?.[field]?.coordinates ||
                            coordinatesData?.[schema.sectionKey]?.[index]?.coordinates;
                          if (coords == null) return;
                          handleMouseEnter(
                            `${field}-${index}`,
                            coordinatesData?.[schema.sectionKey]?.[index]?.[field]?.page_num ||
                            coordinatesData?.[schema.sectionKey]?.[index]?.page_num
                          );
                        }}
                        onMouseLeave={handleMouseLeave}
                      >
                        {renderFieldInput(field, entry[field])}
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </AccordionItem>
      )}

      {/* Financial Information Section */}
      {categorizedFields.financials.length > 0 && (
        <AccordionItem title="Financial Information" open>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {categorizedFields.financials.map((field) => (
              <div
                key={field}
                id={`json-${field}`}
                onMouseEnter={() => {
                  let coordinatesData = data.extraction_json_with_coordinates || data.extraction_json;
                  const coords = coordinatesData?.[field]?.coordinates;
                  if (coords == null) return;
                  handleMouseEnter(field, coordinatesData?.[field]?.page_num);
                }}
                onMouseLeave={handleMouseLeave}
              >
                {renderFieldInput(field, formData[field])}
              </div>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Compliance Section */}
      {categorizedFields.compliance.length > 0 && (
        <AccordionItem title="Compliance & Notes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {categorizedFields.compliance.map((field) => (
              <div
                key={field}
                id={`json-${field}`}
                onMouseEnter={() => {
                  let coordinatesData = data.extraction_json_with_coordinates || data.extraction_json;
                  const coords = coordinatesData?.[field]?.coordinates;
                  if (coords == null) return;
                  handleMouseEnter(field, coordinatesData?.[field]?.page_num);
                }}
                onMouseLeave={handleMouseLeave}
              >
                {renderFieldInput(field, formData[field])}
              </div>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Approval Workflow Section */}
      {categorizedFields.approval.length > 0 && (
        <AccordionItem title="Approval Workflow">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {categorizedFields.approval.map((field) => (
              <div
                key={field}
                id={`json-${field}`}
                onMouseEnter={() => {
                  let coordinatesData = data.extraction_json_with_coordinates || data.extraction_json;
                  const coords = coordinatesData?.[field]?.coordinates;
                  if (coords == null) return;
                  handleMouseEnter(field, coordinatesData?.[field]?.page_num);
                }}
                onMouseLeave={handleMouseLeave}
              >
                {renderFieldInput(field, formData[field])}
              </div>
            ))}
          </div>
        </AccordionItem>
      )}
    </div>
  );
};

export default GenericInputFields;