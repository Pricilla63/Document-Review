// import { schemaMap } from "../config/schemaMap.js";
// import { Dropdown } from "carbon-components-react";
// import React, { useContext, useState } from "react";
// import { UserContext } from "../context/UserContext.jsx";
// import { RightPanelCloseFilled, RightPanelOpen } from "@carbon/icons-react";

// import Xarrow from "react-xarrows";
// import JViewer from "./JViewer/JViewer.jsx";
// import PViewer from "./PViewer/Pviewer.jsx";
// import GenericInputFields from "./GenericInputFields.jsx";

// const MainLayout = () => {
//   const {
//     themeStyle,
//     jsonData,
//     selectedDocType,
//     setSelectedDocType,
//     DOC_TYPES,
//   } = useContext(UserContext);

//   const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
//   const [hoveredKey, setHoveredKey] = useState({ key: null, pageNum: null });
//   const [pageRenderReady, setPageRenderReady] = useState(false);

//   const extractionData = jsonData?.extraction_json || {};

//   const toggleRightPanel = () => {
//     setIsRightPanelOpen((prev) => !prev);
//   };

//   const displayContent = (type) => {
//     const schema = schemaMap[type];
//     if (!schema)
//       return (
//         <div
//           style={{
//             padding: "10px 20px",
//           }}
//         >
//           <p>We are working on this document type</p>
//         </div>
//       );

//     return (
//       <GenericInputFields
//         data={jsonData}
//         schema={schema}
//         setHoveredKey={setHoveredKey}
//       />
//     );
//   };

//   return (
//     <div
//       className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 overflow-hidden"
//       style={{
//         padding: "10px 20px",
//         // marginTop: "3%" "To hide the header"
//       }}
//     >
//       {/* Left Side - PViewer */}
//       <div className="w-full md:w-1/2">
//         {/* <div className="flex flex-row justify-between items-center mb-2 px-2">
//           <p>
//             Loan ID: <b style={{ color: themeStyle.primary }}>{"9014960"}</b>
//           </p>
//           <p>
//             Borrower Name:{" "}
//             <b style={{ color: themeStyle.primary }}>
//               {extractionData?.["Account Holder"] || "BOWWEN F DIAMOND"}
//             </b>
//           </p>
//         </div> */}

//         <div className="border rounded-2xl shadow-md p-4 bg-white">
//           <PViewer
//             hoveredKey={hoveredKey}
//             data={jsonData}
//             setPageRenderReady={setPageRenderReady}
//           />
//         </div>
//       </div>

//       {/* Right Side - InputFields and Optional JViewer */}
//       <div className="w-full md:w-1/2 flex flex-row gap-4">
//         {/* Left side of the split - InputFields */}
//         <div
//           className={`transition-all duration-300 ${
//             isRightPanelOpen ? "w-1/2" : "w-full"
//           }`}
//         >
//           <div className="flex justify-end mb-2 pr-2">
//             {!isRightPanelOpen ? (
//               <RightPanelOpen
//                 size={24}
//                 onClick={toggleRightPanel}
//                 className="cursor-pointer"
//               />
//             ) : (
//               <RightPanelCloseFilled
//                 size={24}
//                 onClick={toggleRightPanel}
//                 className="cursor-pointer"
//               />
//             )}
//           </div>
//           <div
//             className="border rounded-2xl shadow-md p-4 bg-white"
//             style={{ height: "85dvh", marginTop: "1%", overflowY: "auto" }}
//           >
//             <div
//               style={{
//                 padding: "10px 20px",
//               }}
//             >
//               <Dropdown
//                 id="inline"
//                 titleText="Document Type"
//                 initialSelectedItem={selectedDocType}
//                 label={selectedDocType}
//                 items={DOC_TYPES}
//                 onChange={({ selectedItem }) =>
//                   setSelectedDocType(selectedItem)
//                 }
//               />
//             </div>
//             {displayContent(selectedDocType)}
//           </div>
//         </div>

//         {/* Right panel - JViewer */}
//         {isRightPanelOpen && (
//           <div
//             className="w-1/2 border rounded-2xl shadow-md p-4 bg-white transition-all duration-300"
//             style={{ height: "100%" }}
//           >
//             <JViewer data={jsonData} />
//           </div>
//         )}
//       </div>

//       {/* Arrow between JSON and PDF */}
//       {hoveredKey.key && (
//         <Xarrow
//           start={`json-${hoveredKey.key}`}
//           end={`pdf-${hoveredKey.key}`}
//           color={themeStyle.primary}
//           strokeWidth={2}
//         />
//       )}
//     </div>
//   );
// };

// export default MainLayout;



import { schemaMap } from "../config/schemaMap.js";
import { Dropdown, Accordion } from "carbon-components-react";
import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { RightPanelCloseFilled, RightPanelOpen } from "@carbon/icons-react";

import Xarrow from "react-xarrows";
import JViewer from "./JViewer/JViewer.jsx";
import PViewer from "./PViewer/Pviewer.jsx";
import GenericInputFields from "./GenericInputFields.jsx";

const MainLayout = () => {
  const {
    themeStyle,
    jsonData,
    selectedDocType,
    setSelectedDocType,
    DOC_TYPES,
  } = useContext(UserContext);

  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState({ key: null, pageNum: null });
  const [pageRenderReady, setPageRenderReady] = useState(false);

  const extractionData = jsonData?.extraction_json || {};

  const toggleRightPanel = () => {
    setIsRightPanelOpen((prev) => !prev);
  };

  const displayContent = (type) => {
    const schema = schemaMap[type];
    if (!schema)
      return (
        <div style={{ padding: "10px 20px" }}>
          <p>We are working on this document type</p>
        </div>
      );

    return (
      <Accordion>
        <GenericInputFields
          data={jsonData}
          schema={schema}
          setHoveredKey={setHoveredKey}
        />
      </Accordion>
    );
  };

  // Calculate extraction statistics for Invoice documents
  const getExtractionStats = () => {
    if (selectedDocType !== "Invoice" || !jsonData?.extraction_json) return null;

    const extractedFields = Object.keys(jsonData.extraction_json).filter(
      key => jsonData.extraction_json[key] && 
             jsonData.extraction_json[key] !== "na" && 
             jsonData.extraction_json[key] !== ""
    ).length;

    const totalFields = 56; // Total invoice fields
    const extractionRate = ((extractedFields / totalFields) * 100).toFixed(1);

    return { extractedFields, totalFields, extractionRate };
  };

  const stats = getExtractionStats();

  return (
    <div
      className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 overflow-hidden"
      style={{
        padding: "10px 20px",
      }}
    >
      {/* Left Side - PViewer */}
      <div className="w-full md:w-1/2">
        {/* Extraction Statistics for Invoice */}
        {stats && (
          <div className="flex flex-row justify-between items-center mb-2 px-2 bg-white p-3 rounded-lg shadow-sm">
            <div>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Extracted: <b style={{ color: themeStyle.primary }}>{stats.extractedFields}/{stats.totalFields}</b> fields
              </p>
            </div>
            <div>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Completion: <b style={{ color: themeStyle.primary }}>{stats.extractionRate}%</b>
              </p>
            </div>
          </div>
        )}

        <div className="border rounded-2xl shadow-md p-4 bg-white">
          <PViewer
            hoveredKey={hoveredKey}
            data={jsonData}
            setPageRenderReady={setPageRenderReady}
          />
        </div>
      </div>

      {/* Right Side - InputFields and Optional JViewer */}
      <div className="w-full md:w-1/2 flex flex-row gap-4">
        {/* Left side of the split - InputFields */}
        <div
          className={`transition-all duration-300 ${
            isRightPanelOpen ? "w-1/2" : "w-full"
          }`}
        >
          <div className="flex justify-between items-center mb-2 pr-2">
            <div style={{ flex: 1 }}>
              <Dropdown
                id="inline"
                titleText="Document Type"
                initialSelectedItem={selectedDocType}
                label={selectedDocType}
                items={DOC_TYPES}
                onChange={({ selectedItem }) => setSelectedDocType(selectedItem)}
                style={{ minWidth: '200px' }}
              />
            </div>
            <div>
              {!isRightPanelOpen ? (
                <RightPanelOpen
                  size={24}
                  onClick={toggleRightPanel}
                  className="cursor-pointer"
                  title="Show JSON View"
                />
              ) : (
                <RightPanelCloseFilled
                  size={24}
                  onClick={toggleRightPanel}
                  className="cursor-pointer"
                  title="Hide JSON View"
                />
              )}
            </div>
          </div>
          <div
            className="border rounded-2xl shadow-md p-4 bg-white"
            style={{ height: "85dvh", marginTop: "1%", overflowY: "auto" }}
          >
            {displayContent(selectedDocType)}
          </div>
        </div>

        {/* Right panel - JViewer */}
        {isRightPanelOpen && (
          <div
            className="w-1/2 border rounded-2xl shadow-md p-4 bg-white transition-all duration-300"
            style={{ height: "100%" }}
          >
            <JViewer data={jsonData} />
          </div>
        )}
      </div>

      {/* Arrow between JSON and PDF */}
      {hoveredKey.key && (
        <Xarrow
          start={`json-${hoveredKey.key}`}
          end={`pdf-${hoveredKey.key}`}
          color={themeStyle.primary}
          strokeWidth={2}
        />
      )}
    </div>
  );
};

export default MainLayout;