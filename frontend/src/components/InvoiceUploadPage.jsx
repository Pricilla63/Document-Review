// // // // import React, { useState } from "react";
// // // // import { Upload, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";

// // // // const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// // // // const ALLOWED_FORMATS = ["application/pdf", "image/jpeg", "image/png"];

// // // // const InvoiceUploadPage = ({ onProcessSuccess }) => {
// // // //   const [uploadedFile, setUploadedFile] = useState(null);
// // // //   const [isProcessing, setIsProcessing] = useState(false);
// // // //   const [error, setError] = useState(null);
// // // //   const [success, setSuccess] = useState(null);
// // // //   const [showViewer, setShowViewer] = useState(false);
// // // //   const [extractedData, setExtractedData] = useState(null);
// // // //   const [apiEndpoint, setApiEndpoint] = useState("http://localhost:3001/api/process-invoice");
// // // //   const [showConfig, setShowConfig] = useState(false);
// // // //   const [tempEndpoint, setTempEndpoint] = useState(apiEndpoint);
// // // //   const [expandedSections, setExpandedSections] = useState({});

// // // //   const validateFile = (file) => {
// // // //     if (file.size > MAX_FILE_SIZE) {
// // // //       setError(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
// // // //       return false;
// // // //     }

// // // //     if (!ALLOWED_FORMATS.includes(file.type)) {
// // // //       setError("Invalid file format. Please upload PDF, JPG, or PNG files only.");
// // // //       return false;
// // // //     }

// // // //     return true;
// // // //   };

// // // //   const handleFileSelect = (e) => {
// // // //     setError(null);
// // // //     setSuccess(null);
// // // //     const files = e.target.files;

// // // //     if (!files || files.length === 0) return;

// // // //     const file = files[0];

// // // //     if (!validateFile(file)) {
// // // //       setUploadedFile(null);
// // // //       return;
// // // //     }

// // // //     setUploadedFile(file);
// // // //   };

// // // //   const handleDragOver = (e) => {
// // // //     e.preventDefault();
// // // //     e.currentTarget.style.borderColor = "#0f62fe";
// // // //     e.currentTarget.style.backgroundColor = "#e8f4ff";
// // // //   };

// // // //   const handleDragLeave = (e) => {
// // // //     e.currentTarget.style.borderColor = "#0f62fe";
// // // //     e.currentTarget.style.backgroundColor = "#f4f4f4";
// // // //   };

// // // //   const handleDrop = (e) => {
// // // //     e.preventDefault();
// // // //     e.currentTarget.style.borderColor = "#0f62fe";
// // // //     e.currentTarget.style.backgroundColor = "#f4f4f4";
// // // //     if (e.dataTransfer.files) {
// // // //       const event = { target: { files: e.dataTransfer.files } };
// // // //       handleFileSelect(event);
// // // //     }
// // // //   };

// // // //   const handleMultipleFiles = (e) => {
// // // //     setError(null);
// // // //     setSuccess(null);
// // // //     const files = e.target.files;

// // // //     if (!files || files.length === 0) return;

// // // //     const validFiles = Array.from(files).filter((file) => validateFile(file));

// // // //     if (validFiles.length === 0) {
// // // //       setUploadedFile(null);
// // // //       return;
// // // //     }

// // // //     setUploadedFile(validFiles[0]);
// // // //     if (validFiles.length > 1) {
// // // //       setSuccess(`${validFiles.length} files selected. Processing first file.`);
// // // //     }
// // // //   };

// // // //   const processFile = async () => {
// // // //     if (!uploadedFile) {
// // // //       setError("Please select a file first");
// // // //       return;
// // // //     }

// // // //     setIsProcessing(true);
// // // //     setError(null);
// // // //     setSuccess(null);

// // // //     try {
// // // //       const formData = new FormData();
// // // //       formData.append("file", uploadedFile);
// // // //       formData.append("docType", "Invoice");

// // // //       const response = await fetch(apiEndpoint, {
// // // //         method: "POST",
// // // //         body: formData,
// // // //       });

// // // //       if (!response.ok) {
// // // //         throw new Error(`API Error: ${response.status} ${response.statusText}`);
// // // //       }

// // // //       const result = await response.json();

// // // //       if (!result.success) {
// // // //         throw new Error(result.error || "Failed to process file");
// // // //       }

// // // //       const processedData = {
// // // //         extraction_json: result.data?.extraction_json || result.data,
// // // //         extraction_json_with_coordinates: result.data?.extraction_json_with_coordinates,
// // // //         line_items: result.data?.line_items,
// // // //         doc_type: "Invoice",
// // // //         file_name: uploadedFile.name,
// // // //       };

// // // //       setExtractedData(processedData);
// // // //       setSuccess(`Successfully processed: ${uploadedFile.name}`);
// // // //       setIsProcessing(false);

// // // //       setTimeout(() => {
// // // //         setShowViewer(true);
// // // //         if (onProcessSuccess) onProcessSuccess(processedData);
// // // //       }, 2000);
// // // //     } catch (err) {
// // // //       console.error("Error processing file:", err);
// // // //       setError(err.message || "Failed to process file. Check the API endpoint.");
// // // //       setIsProcessing(false);
// // // //     }
// // // //   };

// // // //   const handleClearFile = () => {
// // // //     setUploadedFile(null);
// // // //     setError(null);
// // // //     setSuccess(null);
// // // //   };

// // // //   const handleStartOver = () => {
// // // //     setShowViewer(false);
// // // //     setExtractedData(null);
// // // //     handleClearFile();
// // // //   };

// // // //   // JSON Viewer Component
// // // //   const JSONViewer = ({ data }) => {
// // // //     const renderValue = (value, key, depth = 0) => {
// // // //       const uniqueKey = `${key}-${depth}`;
// // // //       const isExpanded = expandedSections[uniqueKey];

// // // //       if (value === null || value === undefined) {
// // // //         return <span style={{ color: "#999" }}>null</span>;
// // // //       }

// // // //       if (typeof value === "boolean") {
// // // //         return <span style={{ color: "#d73a49" }}>{value.toString()}</span>;
// // // //       }

// // // //       if (typeof value === "number") {
// // // //         return <span style={{ color: "#005cc5" }}>{value}</span>;
// // // //       }

// // // //       if (typeof value === "string") {
// // // //         return <span style={{ color: "#6f42c1" }}>"{value}"</span>;
// // // //       }

// // // //       if (Array.isArray(value)) {
// // // //         return (
// // // //           <div style={{ marginLeft: "1rem" }}>
// // // //             <button
// // // //               onClick={() =>
// // // //                 setExpandedSections((prev) => ({
// // // //                   ...prev,
// // // //                   [uniqueKey]: !prev[uniqueKey],
// // // //                 }))
// // // //               }
// // // //               style={{
// // // //                 background: "none",
// // // //                 border: "none",
// // // //                 cursor: "pointer",
// // // //                 padding: "0",
// // // //                 display: "flex",
// // // //                 alignItems: "center",
// // // //                 gap: "0.5rem",
// // // //                 fontWeight: "500",
// // // //                 color: "#24292e",
// // // //               }}
// // // //             >
// // // //               <ChevronDown
// // // //                 size={16}
// // // //                 style={{
// // // //                   transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
// // // //                   transition: "transform 0.2s",
// // // //                 }}
// // // //               />
// // // //               Array [{value.length}]
// // // //             </button>
// // // //             {isExpanded && (
// // // //               <div style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
// // // //                 {value.map((item, idx) => (
// // // //                   <div key={idx} style={{ marginBottom: "0.5rem" }}>
// // // //                     <span style={{ color: "#999" }}>[{idx}]:</span> {renderValue(item, `${key}-${idx}`, depth + 1)}
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         );
// // // //       }

// // // //       if (typeof value === "object") {
// // // //         const keys = Object.keys(value);
// // // //         return (
// // // //           <div style={{ marginLeft: "1rem" }}>
// // // //             <button
// // // //               onClick={() =>
// // // //                 setExpandedSections((prev) => ({
// // // //                   ...prev,
// // // //                   [uniqueKey]: !prev[uniqueKey],
// // // //                 }))
// // // //               }
// // // //               style={{
// // // //                 background: "none",
// // // //                 border: "none",
// // // //                 cursor: "pointer",
// // // //                 padding: "0",
// // // //                 display: "flex",
// // // //                 alignItems: "center",
// // // //                 gap: "0.5rem",
// // // //                 fontWeight: "500",
// // // //                 color: "#24292e",
// // // //               }}
// // // //             >
// // // //               <ChevronDown
// // // //                 size={16}
// // // //                 style={{
// // // //                   transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
// // // //                   transition: "transform 0.2s",
// // // //                 }}
// // // //               />
// // // //               Object {`{${keys.length}}`} keys

// // // //             </button>
// // // //             {isExpanded && (
// // // //               <div style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
// // // //                 {keys.map((k) => (
// // // //                   <div key={k} style={{ marginBottom: "0.5rem" }}>
// // // //                     <span style={{ color: "#24292e", fontWeight: "500" }}>{k}:</span>{" "}
// // // //                     {renderValue(value[k], k, depth + 1)}
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         );
// // // //       }

// // // //       return <span>{String(value)}</span>;
// // // //     };

// // // //     return (
// // // //       <div
// // // //         style={{
// // // //           background: "#f6f8fa",
// // // //           border: "1px solid #e1e4e8",
// // // //           borderRadius: "6px",
// // // //           padding: "1rem",
// // // //           fontSize: "13px",
// // // //           fontFamily: '"Courier New", monospace',
// // // //           maxHeight: "600px",
// // // //           overflowY: "auto",
// // // //         }}
// // // //       >
// // // //         {renderValue(data, "root")}
// // // //       </div>
// // // //     );
// // // //   };

// // // //   if (showViewer && extractedData) {
// // // //     return (
// // // //       <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "2rem" }}>
// // // //         <div style={{ maxWidth: "900px", margin: "0 auto" }}>
// // // //           <button
// // // //             onClick={handleStartOver}
// // // //             style={{
// // // //               marginBottom: "2rem",
// // // //               padding: "0.625rem 1.25rem",
// // // //               background: "#f5f5f5",
// // // //               border: "1px solid #8d8d8d",
// // // //               borderRadius: "4px",
// // // //               cursor: "pointer",
// // // //               fontSize: "14px",
// // // //               fontWeight: "500",
// // // //               display: "flex",
// // // //               alignItems: "center",
// // // //               gap: "0.5rem",
// // // //             }}
// // // //           >
// // // //             ← Upload Another File
// // // //           </button>

// // // //           <div style={{ background: "white", borderRadius: "4px", padding: "2rem", marginBottom: "2rem" }}>
// // // //             <h2 style={{ marginTop: "0", marginBottom: "1rem", fontSize: "20px", fontWeight: "600" }}>
// // // //               Extracted Data Preview
// // // //             </h2>
// // // //             <p style={{ color: "#666", marginBottom: "1rem" }}>
// // // //               <strong>File:</strong> {extractedData.file_name}
// // // //             </p>
// // // //             <JSONViewer data={extractedData.extraction_json} />
// // // //           </div>

// // // //           {extractedData.line_items && extractedData.line_items.length > 0 && (
// // // //             <div style={{ background: "white", borderRadius: "4px", padding: "2rem" }}>
// // // //               <h2 style={{ marginTop: "0", marginBottom: "1rem", fontSize: "20px", fontWeight: "600" }}>
// // // //                 Line Items ({extractedData.line_items.length})
// // // //               </h2>
// // // //               <JSONViewer data={extractedData.line_items} />
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div style={{ padding: "2rem", minHeight: "100vh", background: "#f5f5f5" }}>
// // // //       <div style={{ maxWidth: "700px", margin: "0 auto" }}>
// // // //         <h1 style={{ marginBottom: "0.5rem", fontSize: "32px", fontWeight: "600", textAlign: "center" }}>
// // // //           Invoice Document Upload
// // // //         </h1>
// // // //         <p style={{ marginBottom: "2rem", color: "#666", textAlign: "center" }}>
// // // //           Upload your invoice documents (PDF, JPG, PNG) for data extraction and processing
// // // //         </p>

// // // //         {/* Error Notification */}
// // // //         {error && (
// // // //           <div
// // // //             style={{
// // // //               background: "#fee",
// // // //               border: "1px solid #fcc",
// // // //               borderRadius: "4px",
// // // //               padding: "1rem",
// // // //               marginBottom: "1.5rem",
// // // //               display: "flex",
// // // //               gap: "1rem",
// // // //               alignItems: "flex-start",
// // // //             }}
// // // //           >
// // // //             <AlertCircle size={20} style={{ color: "#d73a49", flexShrink: 0, marginTop: "0.125rem" }} />
// // // //             <div>
// // // //               <p style={{ margin: "0 0 0.25rem 0", fontWeight: "600", color: "#d73a49", fontSize: "14px" }}>
// // // //                 Error
// // // //               </p>
// // // //               <p style={{ margin: "0", fontSize: "13px", color: "#666" }}>{error}</p>
// // // //             </div>
// // // //             <button
// // // //               onClick={() => setError(null)}
// // // //               style={{
// // // //                 background: "none",
// // // //                 border: "none",
// // // //                 cursor: "pointer",
// // // //                 fontSize: "18px",
// // // //                 color: "#999",
// // // //                 padding: "0",
// // // //                 marginLeft: "auto",
// // // //               }}
// // // //             >
// // // //               ×
// // // //             </button>
// // // //           </div>
// // // //         )}

// // // //         {/* Success Notification */}
// // // //         {success && (
// // // //           <div
// // // //             style={{
// // // //               background: "#efe",
// // // //               border: "1px solid #cfc",
// // // //               borderRadius: "4px",
// // // //               padding: "1rem",
// // // //               marginBottom: "1.5rem",
// // // //               display: "flex",
// // // //               gap: "1rem",
// // // //               alignItems: "flex-start",
// // // //             }}
// // // //           >
// // // //             <CheckCircle size={20} style={{ color: "#28a745", flexShrink: 0, marginTop: "0.125rem" }} />
// // // //             <div>
// // // //               <p style={{ margin: "0 0 0.25rem 0", fontWeight: "600", color: "#28a745", fontSize: "14px" }}>
// // // //                 Success
// // // //               </p>
// // // //               <p style={{ margin: "0", fontSize: "13px", color: "#666" }}>{success}</p>
// // // //             </div>
// // // //             <button
// // // //               onClick={() => setSuccess(null)}
// // // //               style={{
// // // //                 background: "none",
// // // //                 border: "none",
// // // //                 cursor: "pointer",
// // // //                 fontSize: "18px",
// // // //                 color: "#999",
// // // //                 padding: "0",
// // // //                 marginLeft: "auto",
// // // //               }}
// // // //             >
// // // //               ×
// // // //             </button>
// // // //           </div>
// // // //         )}

// // // //         {/* Upload Area */}
// // // //         <div
// // // //           style={{
// // // //             border: "2px dashed #0f62fe",
// // // //             borderRadius: "4px",
// // // //             padding: "2rem",
// // // //             textAlign: "center",
// // // //             backgroundColor: "#f4f4f4",
// // // //             marginBottom: "1.5rem",
// // // //             cursor: "pointer",
// // // //             transition: "all 0.3s ease",
// // // //           }}
// // // //           onDragOver={handleDragOver}
// // // //           onDragLeave={handleDragLeave}
// // // //           onDrop={handleDrop}
// // // //         >
// // // //           <Upload size={32} style={{ margin: "0 auto 1rem", color: "#0f62fe" }} />
// // // //           <p style={{ margin: "0.5rem 0", fontWeight: "500", fontSize: "16px" }}>
// // // //             Drag and drop your file here
// // // //           </p>
// // // //           <p style={{ margin: "0.5rem 0 1rem 0", color: "#666", fontSize: "14px" }}>or</p>

// // // //           <label htmlFor="file-input">
// // // //             <button
// // // //               style={{
// // // //                 padding: "0.625rem 1.25rem",
// // // //                 background: "#0f62fe",
// // // //                 color: "white",
// // // //                 border: "none",
// // // //                 borderRadius: "4px",
// // // //                 cursor: "pointer",
// // // //                 fontSize: "14px",
// // // //                 fontWeight: "500",
// // // //               }}
// // // //             >
// // // //               Browse Files
// // // //             </button>
// // // //           </label>

// // // //           <input
// // // //             id="file-input"
// // // //             type="file"
// // // //             accept=".pdf,.jpg,.jpeg,.png"
// // // //             onChange={handleFileSelect}
// // // //             style={{ display: "none" }}
// // // //           />

// // // //           <p style={{ margin: "1rem 0 0 0", color: "#666", fontSize: "12px" }}>
// // // //             Supported formats: PDF, JPG, PNG • Max size: 10MB
// // // //           </p>
// // // //         </div>

// // // //         {/* Multiple Upload Option */}
// // // //         <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
// // // //           <label htmlFor="multi-file-input">
// // // //             <button
// // // //               style={{
// // // //                 padding: "0.625rem 1.25rem",
// // // //                 background: "#f5f5f5",
// // // //                 color: "#161616",
// // // //                 border: "1px solid #8d8d8d",
// // // //                 borderRadius: "4px",
// // // //                 cursor: "pointer",
// // // //                 fontSize: "14px",
// // // //                 fontWeight: "500",
// // // //               }}
// // // //             >
// // // //               Upload Multiple Files
// // // //             </button>
// // // //           </label>
// // // //           <input
// // // //             id="multi-file-input"
// // // //             type="file"
// // // //             accept=".pdf,.jpg,.jpeg,.png"
// // // //             multiple
// // // //             onChange={handleMultipleFiles}
// // // //             style={{ display: "none" }}
// // // //           />
// // // //         </div>

// // // //         {/* Selected File Display */}
// // // //         {uploadedFile && (
// // // //           <div
// // // //             style={{
// // // //               background: "#f4f4f4",
// // // //               padding: "1rem",
// // // //               borderRadius: "4px",
// // // //               marginBottom: "1.5rem",
// // // //               border: "1px solid #ddd",
// // // //               display: "flex",
// // // //               alignItems: "center",
// // // //               justifyContent: "space-between",
// // // //             }}
// // // //           >
// // // //             <div>
// // // //               <p style={{ margin: "0 0 0.25rem 0", fontWeight: "500", fontSize: "14px" }}>Selected File:</p>
// // // //               <p style={{ margin: "0", color: "#666", fontSize: "13px", wordBreak: "break-word" }}>
// // // //                 {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
// // // //               </p>
// // // //             </div>
// // // //             <CheckCircle size={20} style={{ color: "#24a148", flexShrink: 0 }} />
// // // //           </div>
// // // //         )}

// // // //         {/* Action Buttons */}
// // // //         <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
// // // //           <button
// // // //             onClick={processFile}
// // // //             disabled={!uploadedFile || isProcessing}
// // // //             style={{
// // // //               flex: 1,
// // // //               padding: "0.75rem 1.5rem",
// // // //               background: !uploadedFile || isProcessing ? "#ccc" : "#0f62fe",
// // // //               color: "white",
// // // //               border: "none",
// // // //               borderRadius: "4px",
// // // //               cursor: !uploadedFile || isProcessing ? "not-allowed" : "pointer",
// // // //               fontSize: "14px",
// // // //               fontWeight: "500",
// // // //             }}
// // // //           >
// // // //             {isProcessing ? "Processing..." : "Process Invoice"}
// // // //           </button>
// // // //           {uploadedFile && (
// // // //             <button
// // // //               onClick={handleClearFile}
// // // //               disabled={isProcessing}
// // // //               style={{
// // // //                 padding: "0.75rem 1.5rem",
// // // //                 background: isProcessing ? "#ccc" : "#f5f5f5",
// // // //                 color: "#161616",
// // // //                 border: "1px solid #8d8d8d",
// // // //                 borderRadius: "4px",
// // // //                 cursor: isProcessing ? "not-allowed" : "pointer",
// // // //                 fontSize: "14px",
// // // //                 fontWeight: "500",
// // // //               }}
// // // //             >
// // // //               Clear
// // // //             </button>
// // // //           )}
// // // //         </div>

// // // //         {/* API Configuration */}
// // // //         <button
// // // //           onClick={() => setShowConfig(true)}
// // // //           style={{
// // // //             background: "none",
// // // //             border: "none",
// // // //             color: "#0f62fe",
// // // //             cursor: "pointer",
// // // //             fontSize: "13px",
// // // //             textDecoration: "underline",
// // // //             padding: "0",
// // // //             marginTop: "2rem",
// // // //           }}
// // // //         >
// // // //           API Configuration
// // // //         </button>

// // // //         {/* API Endpoint Modal */}
// // // //         {showConfig && (
// // // //           <div
// // // //             style={{
// // // //               position: "fixed",
// // // //               top: 0,
// // // //               left: 0,
// // // //               right: 0,
// // // //               bottom: 0,
// // // //               background: "rgba(0, 0, 0, 0.5)",
// // // //               display: "flex",
// // // //               alignItems: "center",
// // // //               justifyContent: "center",
// // // //               zIndex: 1000,
// // // //             }}
// // // //           >
// // // //             <div
// // // //               style={{
// // // //                 background: "white",
// // // //                 borderRadius: "4px",
// // // //                 padding: "2rem",
// // // //                 maxWidth: "500px",
// // // //                 width: "90%",
// // // //                 boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
// // // //               }}
// // // //             >
// // // //               <h2 style={{ marginTop: "0", marginBottom: "1rem", fontSize: "18px", fontWeight: "600" }}>
// // // //                 Configure API Endpoint
// // // //               </h2>
// // // //               <div style={{ marginBottom: "1.5rem" }}>
// // // //                 <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", fontWeight: "500" }}>
// // // //                   API Endpoint URL
// // // //                 </label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={tempEndpoint}
// // // //                   onChange={(e) => setTempEndpoint(e.target.value)}
// // // //                   placeholder="http://localhost:3001/api/process-invoice"
// // // //                   style={{
// // // //                     width: "100%",
// // // //                     padding: "0.75rem",
// // // //                     border: "1px solid #8d8d8d",
// // // //                     borderRadius: "4px",
// // // //                     fontSize: "13px",
// // // //                     boxSizing: "border-box",
// // // //                   }}
// // // //                 />
// // // //                 <p style={{ fontSize: "12px", color: "#666", marginTop: "0.75rem", margin: "0.75rem 0 0.5rem 0" }}>
// // // //                   Expected request: POST with FormData (file, docType)
// // // //                 </p>
// // // //                 <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>
// // // //                   Expected response: {`{ success: true, data: { extraction_json: {...}, line_items: [...] } }`}
// // // //                 </p>
// // // //               </div>
// // // //               <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
// // // //                 <button
// // // //                   onClick={() => setShowConfig(false)}
// // // //                   style={{
// // // //                     padding: "0.625rem 1.25rem",
// // // //                     background: "#f5f5f5",
// // // //                     color: "#161616",
// // // //                     border: "1px solid #8d8d8d",
// // // //                     borderRadius: "4px",
// // // //                     cursor: "pointer",
// // // //                     fontSize: "13px",
// // // //                     fontWeight: "500",
// // // //                   }}
// // // //                 >
// // // //                   Cancel
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={() => {
// // // //                     setApiEndpoint(tempEndpoint);
// // // //                     setShowConfig(false);
// // // //                   }}
// // // //                   style={{
// // // //                     padding: "0.625rem 1.25rem",
// // // //                     background: "#0f62fe",
// // // //                     color: "white",
// // // //                     border: "none",
// // // //                     borderRadius: "4px",
// // // //                     cursor: "pointer",
// // // //                     fontSize: "13px",
// // // //                     fontWeight: "500",
// // // //                   }}
// // // //                 >
// // // //                   Save
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default InvoiceUploadPage;


// // // import React, { useState, useRef } from "react";
// // // import { Upload, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";

// // // const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// // // const ALLOWED_FORMATS = ["application/pdf", "image/jpeg", "image/png"];

// // // const InvoiceUploadPage = ({ onProcessSuccess }) => {
// // //   const [uploadedFile, setUploadedFile] = useState(null);
// // //   const [isProcessing, setIsProcessing] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [success, setSuccess] = useState(null);
// // //   const [showViewer, setShowViewer] = useState(false);
// // //   const [extractedData, setExtractedData] = useState(null);
// // //   const [apiEndpoint, setApiEndpoint] = useState("http://localhost:3001/api/process-invoice");
// // //   const [showConfig, setShowConfig] = useState(false);
// // //   const [tempEndpoint, setTempEndpoint] = useState(apiEndpoint);
// // //   const [expandedSections, setExpandedSections] = useState({});

// // //   const fileInputRef = useRef(null);
// // //   const multiFileInputRef = useRef(null);

// // //   const handleBrowseClick = () => {
// // //     fileInputRef.current?.click();
// // //   };

// // //   const handleMultiBrowseClick = () => {
// // //     multiFileInputRef.current?.click();
// // //   };

// // //   const validateFile = (file) => {
// // //     if (file.size > MAX_FILE_SIZE) {
// // //       setError(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
// // //       return false;
// // //     }

// // //     if (!ALLOWED_FORMATS.includes(file.type)) {
// // //       setError("Invalid file format. Please upload PDF, JPG, or PNG files only.");
// // //       return false;
// // //     }

// // //     return true;
// // //   };

// // //   const handleFileSelect = (e) => {
// // //     setError(null);
// // //     setSuccess(null);
// // //     const files = e.target.files;

// // //     if (!files || files.length === 0) return;

// // //     const file = files[0];

// // //     if (!validateFile(file)) {
// // //       setUploadedFile(null);
// // //       return;
// // //     }

// // //     setUploadedFile(file);
// // //   };

// // //   const handleDragOver = (e) => {
// // //     e.preventDefault();
// // //     e.currentTarget.style.borderColor = "#0f62fe";
// // //     e.currentTarget.style.backgroundColor = "#e8f4ff";
// // //   };

// // //   const handleDragLeave = (e) => {
// // //     e.preventDefault();
// // //     e.currentTarget.style.borderColor = "#0f62fe";
// // //     e.currentTarget.style.backgroundColor = "#f4f4f4";
// // //   };

// // //   const handleDrop = (e) => {
// // //     e.preventDefault();
// // //     e.currentTarget.style.borderColor = "#0f62fe";
// // //     e.currentTarget.style.backgroundColor = "#f4f4f4";
    
// // //     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
// // //       const file = e.dataTransfer.files[0];
      
// // //       if (!validateFile(file)) {
// // //         return;
// // //       }

// // //       setUploadedFile(file);
// // //     }
// // //   };

// // //   const handleMultipleFiles = (e) => {
// // //     setError(null);
// // //     setSuccess(null);
// // //     const files = e.target.files;

// // //     if (!files || files.length === 0) return;

// // //     const validFiles = Array.from(files).filter((file) => validateFile(file));

// // //     if (validFiles.length === 0) {
// // //       setUploadedFile(null);
// // //       return;
// // //     }

// // //     setUploadedFile(validFiles[0]);
// // //     if (validFiles.length > 1) {
// // //       setSuccess(`${validFiles.length} files selected. Processing first file.`);
// // //     }
// // //   };

// // //   const processFile = async () => {
// // //     if (!uploadedFile) {
// // //       setError("Please select a file first");
// // //       return;
// // //     }

// // //     setIsProcessing(true);
// // //     setError(null);
// // //     setSuccess(null);

// // //     try {
// // //       const formData = new FormData();
// // //       formData.append("file", uploadedFile);
// // //       formData.append("docType", "Invoice");

// // //       const response = await fetch(apiEndpoint, {
// // //         method: "POST",
// // //         body: formData,
// // //       });

// // //       if (!response.ok) {
// // //         throw new Error(`API Error: ${response.status} ${response.statusText}`);
// // //       }

// // //       const result = await response.json();

// // //       if (!result.success) {
// // //         throw new Error(result.error || "Failed to process file");
// // //       }

// // //       const processedData = {
// // //         extraction_json: result.data?.extraction_json || result.data,
// // //         extraction_json_with_coordinates: result.data?.extraction_json_with_coordinates,
// // //         line_items: result.data?.line_items,
// // //         doc_type: "Invoice",
// // //         file_name: uploadedFile.name,
// // //       };

// // //       setExtractedData(processedData);
// // //       setSuccess(`Successfully processed: ${uploadedFile.name}`);
// // //       setIsProcessing(false);

// // //       setTimeout(() => {
// // //         setShowViewer(true);
// // //         if (onProcessSuccess) onProcessSuccess(processedData);
// // //       }, 2000);
// // //     } catch (err) {
// // //       console.error("Error processing file:", err);
// // //       setError(err.message || "Failed to process file. Check the API endpoint.");
// // //       setIsProcessing(false);
// // //     }
// // //   };

// // //   const handleClearFile = () => {
// // //     setUploadedFile(null);
// // //     setError(null);
// // //     setSuccess(null);
// // //     // Reset file inputs
// // //     if (fileInputRef.current) fileInputRef.current.value = '';
// // //     if (multiFileInputRef.current) multiFileInputRef.current.value = '';
// // //   };

// // //   const handleStartOver = () => {
// // //     setShowViewer(false);
// // //     setExtractedData(null);
// // //     handleClearFile();
// // //   };

// // //   // JSON Viewer Component
// // //   const JSONViewer = ({ data }) => {
// // //     const renderValue = (value, key, depth = 0) => {
// // //       const uniqueKey = `${key}-${depth}`;
// // //       const isExpanded = expandedSections[uniqueKey];

// // //       if (value === null || value === undefined) {
// // //         return <span style={{ color: "#999" }}>null</span>;
// // //       }

// // //       if (typeof value === "boolean") {
// // //         return <span style={{ color: "#d73a49" }}>{value.toString()}</span>;
// // //       }

// // //       if (typeof value === "number") {
// // //         return <span style={{ color: "#005cc5" }}>{value}</span>;
// // //       }

// // //       if (typeof value === "string") {
// // //         return <span style={{ color: "#6f42c1" }}>"{value}"</span>;
// // //       }

// // //       if (Array.isArray(value)) {
// // //         return (
// // //           <div style={{ marginLeft: "1rem" }}>
// // //             <button
// // //               onClick={() =>
// // //                 setExpandedSections((prev) => ({
// // //                   ...prev,
// // //                   [uniqueKey]: !prev[uniqueKey],
// // //                 }))
// // //               }
// // //               style={{
// // //                 background: "none",
// // //                 border: "none",
// // //                 cursor: "pointer",
// // //                 padding: "0",
// // //                 display: "flex",
// // //                 alignItems: "center",
// // //                 gap: "0.5rem",
// // //                 fontWeight: "500",
// // //                 color: "#24292e",
// // //               }}
// // //             >
// // //               <ChevronDown
// // //                 size={16}
// // //                 style={{
// // //                   transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
// // //                   transition: "transform 0.2s",
// // //                 }}
// // //               />
// // //               Array [{value.length}]
// // //             </button>
// // //             {isExpanded && (
// // //               <div style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
// // //                 {value.map((item, idx) => (
// // //                   <div key={idx} style={{ marginBottom: "0.5rem" }}>
// // //                     <span style={{ color: "#999" }}>[{idx}]:</span> {renderValue(item, `${key}-${idx}`, depth + 1)}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         );
// // //       }

// // //       if (typeof value === "object") {
// // //         const keys = Object.keys(value);
// // //         return (
// // //           <div style={{ marginLeft: "1rem" }}>
// // //             <button
// // //               onClick={() =>
// // //                 setExpandedSections((prev) => ({
// // //                   ...prev,
// // //                   [uniqueKey]: !prev[uniqueKey],
// // //                 }))
// // //               }
// // //               style={{
// // //                 background: "none",
// // //                 border: "none",
// // //                 cursor: "pointer",
// // //                 padding: "0",
// // //                 display: "flex",
// // //                 alignItems: "center",
// // //                 gap: "0.5rem",
// // //                 fontWeight: "500",
// // //                 color: "#24292e",
// // //               }}
// // //             >
// // //               <ChevronDown
// // //                 size={16}
// // //                 style={{
// // //                   transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
// // //                   transition: "transform 0.2s",
// // //                 }}
// // //               />
// // //               Object {`{${keys.length}}`} keys
// // //             </button>
// // //             {isExpanded && (
// // //               <div style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
// // //                 {keys.map((k) => (
// // //                   <div key={k} style={{ marginBottom: "0.5rem" }}>
// // //                     <span style={{ color: "#24292e", fontWeight: "500" }}>{k}:</span>{" "}
// // //                     {renderValue(value[k], k, depth + 1)}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         );
// // //       }

// // //       return <span>{String(value)}</span>;
// // //     };

// // //     return (
// // //       <div
// // //         style={{
// // //           background: "#f6f8fa",
// // //           border: "1px solid #e1e4e8",
// // //           borderRadius: "6px",
// // //           padding: "1rem",
// // //           fontSize: "13px",
// // //           fontFamily: '"Courier New", monospace',
// // //           maxHeight: "600px",
// // //           overflowY: "auto",
// // //         }}
// // //       >
// // //         {renderValue(data, "root")}
// // //       </div>
// // //     );
// // //   };

// // //   if (showViewer && extractedData) {
// // //     return (
// // //       <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "2rem" }}>
// // //         <div style={{ maxWidth: "900px", margin: "0 auto" }}>
// // //           <button
// // //             onClick={handleStartOver}
// // //             style={{
// // //               marginBottom: "2rem",
// // //               padding: "0.625rem 1.25rem",
// // //               background: "#f5f5f5",
// // //               border: "1px solid #8d8d8d",
// // //               borderRadius: "4px",
// // //               cursor: "pointer",
// // //               fontSize: "14px",
// // //               fontWeight: "500",
// // //               display: "flex",
// // //               alignItems: "center",
// // //               gap: "0.5rem",
// // //             }}
// // //           >
// // //             ← Upload Another File
// // //           </button>

// // //           <div style={{ background: "white", borderRadius: "4px", padding: "2rem", marginBottom: "2rem" }}>
// // //             <h2 style={{ marginTop: "0", marginBottom: "1rem", fontSize: "20px", fontWeight: "600" }}>
// // //               Extracted Data Preview
// // //             </h2>
// // //             <p style={{ color: "#666", marginBottom: "1rem" }}>
// // //               <strong>File:</strong> {extractedData.file_name}
// // //             </p>
// // //             <JSONViewer data={extractedData.extraction_json} />
// // //           </div>

// // //           {extractedData.line_items && extractedData.line_items.length > 0 && (
// // //             <div style={{ background: "white", borderRadius: "4px", padding: "2rem" }}>
// // //               <h2 style={{ marginTop: "0", marginBottom: "1rem", fontSize: "20px", fontWeight: "600" }}>
// // //                 Line Items ({extractedData.line_items.length})
// // //               </h2>
// // //               <JSONViewer data={extractedData.line_items} />
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div style={{ padding: "2rem", minHeight: "100vh", background: "#f5f5f5" }}>
// // //       <div style={{ maxWidth: "700px", margin: "0 auto" }}>
// // //         <h1 style={{ marginBottom: "0.5rem", fontSize: "32px", fontWeight: "600", textAlign: "center" }}>
// // //           Invoice Document Upload
// // //         </h1>
// // //         <p style={{ marginBottom: "2rem", color: "#666", textAlign: "center" }}>
// // //           Upload your invoice documents (PDF, JPG, PNG) for data extraction and processing
// // //         </p>

// // //         {/* Error Notification */}
// // //         {error && (
// // //           <div
// // //             style={{
// // //               background: "#fee",
// // //               border: "1px solid #fcc",
// // //               borderRadius: "4px",
// // //               padding: "1rem",
// // //               marginBottom: "1.5rem",
// // //               display: "flex",
// // //               gap: "1rem",
// // //               alignItems: "flex-start",
// // //             }}
// // //           >
// // //             <AlertCircle size={20} style={{ color: "#d73a49", flexShrink: 0, marginTop: "0.125rem" }} />
// // //             <div>
// // //               <p style={{ margin: "0 0 0.25rem 0", fontWeight: "600", color: "#d73a49", fontSize: "14px" }}>
// // //                 Error
// // //               </p>
// // //               <p style={{ margin: "0", fontSize: "13px", color: "#666" }}>{error}</p>
// // //             </div>
// // //             <button
// // //               onClick={() => setError(null)}
// // //               style={{
// // //                 background: "none",
// // //                 border: "none",
// // //                 cursor: "pointer",
// // //                 fontSize: "18px",
// // //                 color: "#999",
// // //                 padding: "0",
// // //                 marginLeft: "auto",
// // //               }}
// // //             >
// // //               ×
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Success Notification */}
// // //         {success && (
// // //           <div
// // //             style={{
// // //               background: "#efe",
// // //               border: "1px solid #cfc",
// // //               borderRadius: "4px",
// // //               padding: "1rem",
// // //               marginBottom: "1.5rem",
// // //               display: "flex",
// // //               gap: "1rem",
// // //               alignItems: "flex-start",
// // //             }}
// // //           >
// // //             <CheckCircle size={20} style={{ color: "#28a745", flexShrink: 0, marginTop: "0.125rem" }} />
// // //             <div>
// // //               <p style={{ margin: "0 0 0.25rem 0", fontWeight: "600", color: "#28a745", fontSize: "14px" }}>
// // //                 Success
// // //               </p>
// // //               <p style={{ margin: "0", fontSize: "13px", color: "#666" }}>{success}</p>
// // //             </div>
// // //             <button
// // //               onClick={() => setSuccess(null)}
// // //               style={{
// // //                 background: "none",
// // //                 border: "none",
// // //                 cursor: "pointer",
// // //                 fontSize: "18px",
// // //                 color: "#999",
// // //                 padding: "0",
// // //                 marginLeft: "auto",
// // //               }}
// // //             >
// // //               ×
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Upload Area */}
// // //         <div
// // //           style={{
// // //             border: "2px dashed #0f62fe",
// // //             borderRadius: "4px",
// // //             padding: "2rem",
// // //             textAlign: "center",
// // //             backgroundColor: "#f4f4f4",
// // //             marginBottom: "1.5rem",
// // //             cursor: "pointer",
// // //             transition: "all 0.3s ease",
// // //           }}
// // //           onDragOver={handleDragOver}
// // //           onDragLeave={handleDragLeave}
// // //           onDrop={handleDrop}
// // //           onClick={handleBrowseClick}
// // //         >
// // //           <Upload size={32} style={{ margin: "0 auto 1rem", color: "#0f62fe" }} />
// // //           <p style={{ margin: "0.5rem 0", fontWeight: "500", fontSize: "16px" }}>
// // //             Drag and drop your file here
// // //           </p>
// // //           <p style={{ margin: "0.5rem 0 1rem 0", color: "#666", fontSize: "14px" }}>or</p>

// // //           <button
// // //             onClick={(e) => {
// // //               e.stopPropagation();
// // //               handleBrowseClick();
// // //             }}
// // //             style={{
// // //               padding: "0.625rem 1.25rem",
// // //               background: "#0f62fe",
// // //               color: "white",
// // //               border: "none",
// // //               borderRadius: "4px",
// // //               cursor: "pointer",
// // //               fontSize: "14px",
// // //               fontWeight: "500",
// // //             }}
// // //           >
// // //             Browse Files
// // //           </button>

// // //           <input
// // //             ref={fileInputRef}
// // //             type="file"
// // //             accept=".pdf,.jpg,.jpeg,.png"
// // //             onChange={handleFileSelect}
// // //             style={{ display: "none" }}
// // //           />

// // //           <p style={{ margin: "1rem 0 0 0", color: "#666", fontSize: "12px" }}>
// // //             Supported formats: PDF, JPG, PNG • Max size: 10MB
// // //           </p>
// // //         </div>

// // //         {/* Multiple Upload Option */}
// // //         <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
// // //           <button
// // //             onClick={handleMultiBrowseClick}
// // //             style={{
// // //               padding: "0.625rem 1.25rem",
// // //               background: "#f5f5f5",
// // //               color: "#161616",
// // //               border: "1px solid #8d8d8d",
// // //               borderRadius: "4px",
// // //               cursor: "pointer",
// // //               fontSize: "14px",
// // //               fontWeight: "500",
// // //             }}
// // //           >
// // //             Upload Multiple Files
// // //           </button>

// // //           <input
// // //             ref={multiFileInputRef}
// // //             type="file"
// // //             accept=".pdf,.jpg,.jpeg,.png"
// // //             multiple
// // //             onChange={handleMultipleFiles}
// // //             style={{ display: "none" }}
// // //           />
// // //         </div>

// // //         {/* Selected File Display */}
// // //         {uploadedFile && (
// // //           <div
// // //             style={{
// // //               background: "#f4f4f4",
// // //               padding: "1rem",
// // //               borderRadius: "4px",
// // //               marginBottom: "1.5rem",
// // //               border: "1px solid #ddd",
// // //               display: "flex",
// // //               alignItems: "center",
// // //               justifyContent: "space-between",
// // //             }}
// // //           >
// // //             <div>
// // //               <p style={{ margin: "0 0 0.25rem 0", fontWeight: "500", fontSize: "14px" }}>Selected File:</p>
// // //               <p style={{ margin: "0", color: "#666", fontSize: "13px", wordBreak: "break-word" }}>
// // //                 {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
// // //               </p>
// // //             </div>
// // //             <CheckCircle size={20} style={{ color: "#24a148", flexShrink: 0 }} />
// // //           </div>
// // //         )}

// // //         {/* Action Buttons */}
// // //         <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
// // //           <button
// // //             onClick={processFile}
// // //             disabled={!uploadedFile || isProcessing}
// // //             style={{
// // //               flex: 1,
// // //               padding: "0.75rem 1.5rem",
// // //               background: !uploadedFile || isProcessing ? "#ccc" : "#0f62fe",
// // //               color: "white",
// // //               border: "none",
// // //               borderRadius: "4px",
// // //               cursor: !uploadedFile || isProcessing ? "not-allowed" : "pointer",
// // //               fontSize: "14px",
// // //               fontWeight: "500",
// // //             }}
// // //           >
// // //             {isProcessing ? "Processing..." : "Process Invoice"}
// // //           </button>
// // //           {uploadedFile && (
// // //             <button
// // //               onClick={handleClearFile}
// // //               disabled={isProcessing}
// // //               style={{
// // //                 padding: "0.75rem 1.5rem",
// // //                 background: isProcessing ? "#ccc" : "#f5f5f5",
// // //                 color: "#161616",
// // //                 border: "1px solid #8d8d8d",
// // //                 borderRadius: "4px",
// // //                 cursor: isProcessing ? "not-allowed" : "pointer",
// // //                 fontSize: "14px",
// // //                 fontWeight: "500",
// // //               }}
// // //             >
// // //               Clear
// // //             </button>
// // //           )}
// // //         </div>

// // //         {/* API Configuration */}
// // //         <button
// // //           onClick={() => setShowConfig(true)}
// // //           style={{
// // //             background: "none",
// // //             border: "none",
// // //             color: "#0f62fe",
// // //             cursor: "pointer",
// // //             fontSize: "13px",
// // //             textDecoration: "underline",
// // //             padding: "0",
// // //             marginTop: "2rem",
// // //           }}
// // //         >
// // //           API Configuration
// // //         </button>

// // //         {/* API Endpoint Modal */}
// // //         {showConfig && (
// // //           <div
// // //             style={{
// // //               position: "fixed",
// // //               top: 0,
// // //               left: 0,
// // //               right: 0,
// // //               bottom: 0,
// // //               background: "rgba(0, 0, 0, 0.5)",
// // //               display: "flex",
// // //               alignItems: "center",
// // //               justifyContent: "center",
// // //               zIndex: 1000,
// // //             }}
// // //           >
// // //             <div
// // //               style={{
// // //                 background: "white",
// // //                 borderRadius: "4px",
// // //                 padding: "2rem",
// // //                 maxWidth: "500px",
// // //                 width: "90%",
// // //                 boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
// // //               }}
// // //             >
// // //               <h2 style={{ marginTop: "0", marginBottom: "1rem", fontSize: "18px", fontWeight: "600" }}>
// // //                 Configure API Endpoint
// // //               </h2>
// // //               <div style={{ marginBottom: "1.5rem" }}>
// // //                 <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", fontWeight: "500" }}>
// // //                   API Endpoint URL
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   value={tempEndpoint}
// // //                   onChange={(e) => setTempEndpoint(e.target.value)}
// // //                   placeholder="http://localhost:3001/api/process-invoice"
// // //                   style={{
// // //                     width: "100%",
// // //                     padding: "0.75rem",
// // //                     border: "1px solid #8d8d8d",
// // //                     borderRadius: "4px",
// // //                     fontSize: "13px",
// // //                     boxSizing: "border-box",
// // //                   }}
// // //                 />
// // //                 <p style={{ fontSize: "12px", color: "#666", marginTop: "0.75rem", margin: "0.75rem 0 0.5rem 0" }}>
// // //                   Expected request: POST with FormData (file, docType)
// // //                 </p>
// // //                 <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>
// // //                   Expected response: {`{ success: true, data: { extraction_json: {...}, line_items: [...] } }`}
// // //                 </p>
// // //               </div>
// // //               <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
// // //                 <button
// // //                   onClick={() => setShowConfig(false)}
// // //                   style={{
// // //                     padding: "0.625rem 1.25rem",
// // //                     background: "#f5f5f5",
// // //                     color: "#161616",
// // //                     border: "1px solid #8d8d8d",
// // //                     borderRadius: "4px",
// // //                     cursor: "pointer",
// // //                     fontSize: "13px",
// // //                     fontWeight: "500",
// // //                   }}
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   onClick={() => {
// // //                     setApiEndpoint(tempEndpoint);
// // //                     setShowConfig(false);
// // //                   }}
// // //                   style={{
// // //                     padding: "0.625rem 1.25rem",
// // //                     background: "#0f62fe",
// // //                     color: "white",
// // //                     border: "none",
// // //                     borderRadius: "4px",
// // //                     cursor: "pointer",
// // //                     fontSize: "13px",
// // //                     fontWeight: "500",
// // //                   }}
// // //                 >
// // //                   Save
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default InvoiceUploadPage;


// // // src/components/InvoiceUploadPage.jsx
// // import React, { useState } from 'react';
// // import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
// // import { invoiceAPI } from '../services/api';

// // const InvoiceUploadPage = () => {
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [processing, setProcessing] = useState(false);
// //   const [extractedData, setExtractedData] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [message, setMessage] = useState('');
// //   const [connectionStatus, setConnectionStatus] = useState('unknown');

// //   const handleFileSelect = (event) => {
// //     const file = event.target.files[0];
// //     if (file && file.type === 'application/pdf') {
// //       setSelectedFile(file);
// //       setError(null);
// //       setMessage('');
// //     } else {
// //       setError('Please select a PDF file');
// //       setSelectedFile(null);
// //     }
// //   };

// //   // Test backend connection
// //   const testBackendConnection = async () => {
// //     try {
// //       setConnectionStatus('checking');
// //       const result = await invoiceAPI.healthCheck();
// //       setConnectionStatus('connected');
// //       setMessage(`✅ Backend connected: ${result.status}`);
// //       setError(null);
// //     } catch (err) {
// //       setConnectionStatus('disconnected');
// //       setError('❌ Cannot connect to backend. Make sure Flask server is running on port 5000.');
// //       setMessage('');
// //       console.error('Connection test failed:', err);
// //     }
// //   };

// //   const processFile = async () => {
// //     if (!selectedFile) return;

// //     try {
// //       setProcessing(true);
// //       setError(null);
// //       setMessage('Uploading and processing invoice...');

// //       // First upload the file
// //       const uploadResult = await invoiceAPI.processInvoice(selectedFile);
      
// //       if (!uploadResult.success) {
// //         throw new Error(uploadResult.error || 'Upload failed');
// //       }

// //       setMessage('✅ File uploaded successfully! Processing...');

// //       // Then process the uploaded files
// //       const processResult = await invoiceAPI.processUploadedFiles();
      
// //       if (processResult.success) {
// //         // Find the result for our specific file
// //         const fileResult = processResult.results?.find(
// //           result => result.filename === selectedFile.name
// //         );
        
// //         if (fileResult && fileResult.success) {
// //           setExtractedData(fileResult.data);
// //           setMessage('✅ Invoice processed successfully! Data extracted.');
// //         } else {
// //           throw new Error(fileResult?.error || 'Processing completed but no data extracted');
// //         }
// //       } else {
// //         throw new Error(processResult.error || 'Processing failed');
// //       }
// //     } catch (err) {
// //       console.error('Error processing file:', err);
// //       setError(`Failed to process invoice: ${err.message}`);
// //       setMessage('');
// //     } finally {
// //       setProcessing(false);
// //     }
// //   };

// //   // Test connection when component loads
// //   React.useEffect(() => {
// //     testBackendConnection();
// //   }, []);

// //   return (
// //     <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
// //       <h1>Invoice Processing System</h1>
      
// //       {/* Connection Status */}
// //       <div style={{ 
// //         marginBottom: '20px',
// //         padding: '10px',
// //         backgroundColor: connectionStatus === 'connected' ? '#d4edda' : 
// //                         connectionStatus === 'disconnected' ? '#f8d7da' : '#fff3cd',
// //         color: connectionStatus === 'connected' ? '#155724' : 
// //                connectionStatus === 'disconnected' ? '#721c24' : '#856404',
// //         borderRadius: '5px',
// //         display: 'flex',
// //         alignItems: 'center',
// //         justifyContent: 'space-between'
// //       }}>
// //         <div style={{ display: 'flex', alignItems: 'center' }}>
// //           {connectionStatus === 'connected' && <CheckCircle style={{ marginRight: '10px' }} />}
// //           {connectionStatus === 'disconnected' && <AlertCircle style={{ marginRight: '10px' }} />}
// //           {connectionStatus === 'checking' && <RefreshCw style={{ marginRight: '10px', animation: 'spin 1s linear infinite' }} />}
// //           <span>
// //             Backend: {connectionStatus === 'connected' ? 'Connected' : 
// //                      connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
// //           </span>
// //         </div>
// //         <button 
// //           onClick={testBackendConnection}
// //           style={{ 
// //             padding: '5px 10px', 
// //             backgroundColor: '#007bff', 
// //             color: 'white', 
// //             border: 'none', 
// //             borderRadius: '3px',
// //             cursor: 'pointer',
// //             fontSize: '12px'
// //           }}
// //         >
// //           Test Again
// //         </button>
// //       </div>

// //       {/* File Upload */}
// //       <div style={{ 
// //         border: '2px dashed #ccc', 
// //         padding: '40px', 
// //         textAlign: 'center',
// //         marginBottom: '20px',
// //         borderRadius: '10px'
// //       }}>
// //         <Upload size={48} style={{ margin: '0 auto 20px', color: '#666' }} />
// //         <input
// //           type="file"
// //           accept=".pdf"
// //           onChange={handleFileSelect}
// //           style={{ marginBottom: '20px' }}
// //           disabled={connectionStatus !== 'connected'}
// //         />
// //         {selectedFile && (
// //           <div style={{ 
// //             display: 'flex', 
// //             alignItems: 'center', 
// //             justifyContent: 'center',
// //             marginTop: '10px'
// //           }}>
// //             <FileText size={20} style={{ marginRight: '10px' }} />
// //             <span>{selectedFile.name}</span>
// //           </div>
// //         )}
// //         <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
// //           Select a PDF invoice file to process
// //         </p>
// //       </div>

// //       {/* Process Button */}
// //       <button
// //         onClick={processFile}
// //         disabled={!selectedFile || processing || connectionStatus !== 'connected'}
// //         style={{
// //           padding: '12px 24px',
// //           backgroundColor: (selectedFile && !processing && connectionStatus === 'connected') ? '#28a745' : '#ccc',
// //           color: 'white',
// //           border: 'none',
// //           borderRadius: '5px',
// //           cursor: (selectedFile && !processing && connectionStatus === 'connected') ? 'pointer' : 'not-allowed',
// //           fontSize: '16px',
// //           width: '100%'
// //         }}
// //       >
// //         {processing ? (
// //           <>
// //             <RefreshCw style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
// //             Processing...
// //           </>
// //         ) : (
// //           'Process Invoice'
// //         )}
// //       </button>

// //       {/* Messages */}
// //       {message && (
// //         <div style={{
// //           marginTop: '20px',
// //           padding: '15px',
// //           backgroundColor: '#d4edda',
// //           color: '#155724',
// //           borderRadius: '5px',
// //           display: 'flex',
// //           alignItems: 'center'
// //         }}>
// //           <CheckCircle style={{ marginRight: '10px' }} />
// //           {message}
// //         </div>
// //       )}

// //       {error && (
// //         <div style={{
// //           marginTop: '20px',
// //           padding: '15px',
// //           backgroundColor: '#f8d7da',
// //           color: '#721c24',
// //           borderRadius: '5px',
// //           display: 'flex',
// //           alignItems: 'center'
// //         }}>
// //           <AlertCircle style={{ marginRight: '10px' }} />
// //           {error}
// //         </div>
// //       )}

// //       {/* Results */}
// //       {extractedData && (
// //         <div style={{ marginTop: '30px' }}>
// //           <h2>Extracted Data</h2>
// //           <div style={{ 
// //             backgroundColor: '#f8f9fa', 
// //             padding: '20px', 
// //             borderRadius: '5px',
// //             overflow: 'auto',
// //             maxHeight: '500px',
// //             border: '1px solid #dee2e6'
// //           }}>
// //             <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
// //               {JSON.stringify(extractedData, null, 2)}
// //             </pre>
// //           </div>
// //         </div>
// //       )}

// //       <style jsx>{`
// //         @keyframes spin {
// //           from { transform: rotate(0deg); }
// //           to { transform: rotate(360deg); }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default InvoiceUploadPage;


// // src/components/InvoiceUploadPage.jsx
// import React, { useState, useEffect } from 'react';
// import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
// import { invoiceAPI } from '../services/api';

// const InvoiceUploadPage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const [extractedData, setExtractedData] = useState(null);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState('');
//   const [connectionStatus, setConnectionStatus] = useState('unknown');

//   // Test backend connection on component mount
//   useEffect(() => {
//     testBackendConnection();
//   }, []);

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       setSelectedFile(file);
//       setError(null);
//       setMessage('');
//       setExtractedData(null);
//     } else {
//       setError('Please select a PDF file');
//       setSelectedFile(null);
//     }
//   };

//   const testBackendConnection = async () => {
//     try {
//       setConnectionStatus('checking');
//       const result = await invoiceAPI.healthCheck();
//       setConnectionStatus('connected');
//       setMessage(`✅ Backend connected: ${result.status}`);
//       setError(null);
//     } catch (err) {
//       setConnectionStatus('disconnected');
//       setError('❌ Cannot connect to backend. Make sure Flask server is running on port 5000.');
//       setMessage('');
//       console.error('Connection test failed:', err);
//     }
//   };

//   const processFile = async () => {
//     if (!selectedFile) return;

//     try {
//       setProcessing(true);
//       setError(null);
//       setMessage('Processing invoice...');
//       setExtractedData(null);

//       const result = await invoiceAPI.processInvoice(selectedFile);
      
//       if (result.success) {
//         setExtractedData(result.data);
//         setMessage(`✅ ${result.message}`);
//       } else {
//         throw new Error(result.error || 'Processing failed');
//       }
//     } catch (err) {
//       console.error('Error processing file:', err);
//       setError(`Failed to process invoice: ${err.message}`);
//       setMessage('');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const getStatusColor = () => {
//     switch (connectionStatus) {
//       case 'connected': return { bg: '#d4edda', color: '#155724' };
//       case 'disconnected': return { bg: '#f8d7da', color: '#721c24' };
//       case 'checking': return { bg: '#fff3cd', color: '#856404' };
//       default: return { bg: '#e2e3e5', color: '#383d41' };
//     }
//   };

//   const statusColors = getStatusColor();

//   return (
//     <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
//       <h1>Invoice Processing System</h1>
      
//       {/* Connection Status */}
//       <div style={{ 
//         marginBottom: '20px',
//         padding: '10px',
//         backgroundColor: statusColors.bg,
//         color: statusColors.color,
//         borderRadius: '5px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           {connectionStatus === 'connected' && <CheckCircle style={{ marginRight: '10px' }} />}
//           {connectionStatus === 'disconnected' && <AlertCircle style={{ marginRight: '10px' }} />}
//           {connectionStatus === 'checking' && <RefreshCw style={{ marginRight: '10px', animation: 'spin 1s linear infinite' }} />}
//           <span>
//             Backend: {connectionStatus === 'connected' ? 'Connected' : 
//                      connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
//           </span>
//         </div>
//         <button 
//           onClick={testBackendConnection}
//           style={{ 
//             padding: '5px 10px', 
//             backgroundColor: '#007bff', 
//             color: 'white', 
//             border: 'none', 
//             borderRadius: '3px',
//             cursor: 'pointer',
//             fontSize: '12px'
//           }}
//         >
//           Test Again
//         </button>
//       </div>

//       {/* File Upload Section */}
//       <div style={{ 
//         border: '2px dashed #ccc', 
//         padding: '40px', 
//         textAlign: 'center',
//         marginBottom: '20px',
//         borderRadius: '10px',
//         backgroundColor: connectionStatus === 'connected' ? '#f8f9fa' : '#f8f9fa',
//         opacity: connectionStatus === 'connected' ? 1 : 0.6
//       }}>
//         <Upload size={48} style={{ margin: '0 auto 20px', color: '#666' }} />
//         <input
//           type="file"
//           accept=".pdf"
//           onChange={handleFileSelect}
//           style={{ 
//             marginBottom: '20px',
//             padding: '10px',
//             border: '1px solid #ddd',
//             borderRadius: '5px',
//             width: '100%',
//             maxWidth: '300px'
//           }}
//           disabled={connectionStatus !== 'connected'}
//         />
//         {selectedFile && (
//           <div style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center',
//             marginTop: '10px',
//             padding: '10px',
//             backgroundColor: '#e9ecef',
//             borderRadius: '5px'
//           }}>
//             <FileText size={20} style={{ marginRight: '10px' }} />
//             <span style={{ fontWeight: 'bold' }}>{selectedFile.name}</span>
//           </div>
//         )}
//         <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
//           {connectionStatus === 'connected' 
//             ? 'Select a PDF invoice file to extract 56 fields of data' 
//             : 'Connect to backend first'}
//         </p>
//       </div>

//       {/* Process Button */}
//       <button
//         onClick={processFile}
//         disabled={!selectedFile || processing || connectionStatus !== 'connected'}
//         style={{
//           padding: '12px 24px',
//           backgroundColor: (selectedFile && !processing && connectionStatus === 'connected') ? '#28a745' : '#ccc',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: (selectedFile && !processing && connectionStatus === 'connected') ? 'pointer' : 'not-allowed',
//           fontSize: '16px',
//           width: '100%',
//           marginBottom: '20px',
//           fontWeight: 'bold'
//         }}
//       >
//         {processing ? (
//           <>
//             <RefreshCw style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
//             Processing Invoice...
//           </>
//         ) : (
//           'Extract Invoice Data (56 Fields)'
//         )}
//       </button>

//       {/* Messages */}
//       {message && (
//         <div style={{
//           marginTop: '20px',
//           padding: '15px',
//           backgroundColor: '#d4edda',
//           color: '#155724',
//           borderRadius: '5px',
//           display: 'flex',
//           alignItems: 'center',
//           border: '1px solid #c3e6cb'
//         }}>
//           <CheckCircle style={{ marginRight: '10px' }} />
//           <strong>{message}</strong>
//         </div>
//       )}

//       {error && (
//         <div style={{
//           marginTop: '20px',
//           padding: '15px',
//           backgroundColor: '#f8d7da',
//           color: '#721c24',
//           borderRadius: '5px',
//           display: 'flex',
//           alignItems: 'center',
//           border: '1px solid #f5c6cb'
//         }}>
//           <AlertCircle style={{ marginRight: '10px' }} />
//           <strong>{error}</strong>
//         </div>
//       )}

//       {/* Results */}
//       {extractedData && (
//         <div style={{ marginTop: '30px' }}>
//           <h2>📊 Extracted Invoice Data</h2>
//           <div style={{ 
//             backgroundColor: '#f8f9fa', 
//             padding: '20px', 
//             borderRadius: '5px',
//             overflow: 'auto',
//             maxHeight: '600px',
//             border: '1px solid #dee2e6'
//           }}>
//             <pre style={{ 
//               margin: 0, 
//               whiteSpace: 'pre-wrap',
//               fontSize: '14px',
//               lineHeight: '1.4'
//             }}>
//               {JSON.stringify(extractedData, null, 2)}
//             </pre>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default InvoiceUploadPage;


import React, { useState, useEffect, useContext } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { invoiceAPI } from '../services/api';
import { UserContext } from '../context/UserContext';

const InvoiceUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  const { 
    handleFileUpload, 
    currentView, 
    setCurrentView 
  } = useContext(UserContext);

  // Test backend connection on component mount
  useEffect(() => {
    testBackendConnection();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
      setMessage('');
      setExtractedData(null);
    } else {
      setError('Please select a PDF file');
      setSelectedFile(null);
    }
  };

  const testBackendConnection = async () => {
    try {
      setConnectionStatus('checking');
      const result = await invoiceAPI.healthCheck();
      setConnectionStatus('connected');
      setMessage(`✅ Backend connected: ${result.status}`);
      setError(null);
    } catch (err) {
      setConnectionStatus('disconnected');
      setError('❌ Cannot connect to backend. Make sure Flask server is running on port 5000.');
      setMessage('');
      console.error('Connection test failed:', err);
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;

    try {
      setProcessing(true);
      setError(null);
      setMessage('Processing invoice...');
      setExtractedData(null);

      // Use the context function to handle file upload
      const result = await handleFileUpload([selectedFile]);
      
      if (result.success) {
        setExtractedData(result.data);
        setMessage(`✅ ${result.message}`);
        // The context will automatically switch to main view
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError(`Failed to process invoice: ${err.message}`);
      setMessage('');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return { bg: '#d4edda', color: '#155724' };
      case 'disconnected': return { bg: '#f8d7da', color: '#721c24' };
      case 'checking': return { bg: '#fff3cd', color: '#856404' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  const statusColors = getStatusColor();

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Invoice Processing System</h1>
      
      {/* Connection Status */}
      <div style={{ 
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: statusColors.bg,
        color: statusColors.color,
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {connectionStatus === 'connected' && <CheckCircle style={{ marginRight: '10px' }} />}
          {connectionStatus === 'disconnected' && <AlertCircle style={{ marginRight: '10px' }} />}
          {connectionStatus === 'checking' && <RefreshCw style={{ marginRight: '10px', animation: 'spin 1s linear infinite' }} />}
          <span>
            Backend: {connectionStatus === 'connected' ? 'Connected' : 
                     connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
          </span>
        </div>
        <button 
          onClick={testBackendConnection}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Test Again
        </button>
      </div>

      {/* File Upload Section */}
      <div style={{ 
        border: '2px dashed #ccc', 
        padding: '40px', 
        textAlign: 'center',
        marginBottom: '20px',
        borderRadius: '10px',
        backgroundColor: connectionStatus === 'connected' ? '#f8f9fa' : '#f8f9fa',
        opacity: connectionStatus === 'connected' ? 1 : 0.6
      }}>
        <Upload size={48} style={{ margin: '0 auto 20px', color: '#666' }} />
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          style={{ 
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            width: '100%',
            maxWidth: '300px'
          }}
          disabled={connectionStatus !== 'connected'}
        />
        {selectedFile && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#e9ecef',
            borderRadius: '5px'
          }}>
            <FileText size={20} style={{ marginRight: '10px' }} />
            <span style={{ fontWeight: 'bold' }}>{selectedFile.name}</span>
          </div>
        )}
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          {connectionStatus === 'connected' 
            ? 'Select a PDF invoice file to extract 56 fields of data' 
            : 'Connect to backend first'}
        </p>
      </div>

      {/* Process Button */}
      <button
        onClick={processFile}
        disabled={!selectedFile || processing || connectionStatus !== 'connected'}
        style={{
          padding: '12px 24px',
          backgroundColor: (selectedFile && !processing && connectionStatus === 'connected') ? '#28a745' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: (selectedFile && !processing && connectionStatus === 'connected') ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          width: '100%',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}
      >
        {processing ? (
          <>
            <RefreshCw style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
            Processing Invoice...
          </>
        ) : (
          'Extract Invoice Data (56 Fields)'
        )}
      </button>

      {/* Messages */}
      {message && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #c3e6cb'
        }}>
          <CheckCircle style={{ marginRight: '10px' }} />
          <strong>{message}</strong>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #f5c6cb'
        }}>
          <AlertCircle style={{ marginRight: '10px' }} />
          <strong>{error}</strong>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InvoiceUploadPage;