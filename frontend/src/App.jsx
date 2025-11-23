// // // import Header from "./components/Header/Header";
// // // import { UserContext } from "./context/UserContext.jsx";
// // import React from "react";


// // import MainLayout from "./components/MainLayout.jsx";

// // const App = () => {
// //   // const {  } = useContext(UserContext);

// //   return (
// //     <div className="flex flex-col h-screen">
// //       {/* <Header /> */}
// //       <MainLayout />
// //     </div>
// //   );
// // };

// // export default App;



// import React, { useState } from "react";
// import MainLayout from "./components/MainLayout.jsx";
// import InvoiceUploadPage from "./components/InvoiceUploadPage.jsx";

// const App = () => {
//   const [processedData, setProcessedData] = useState(null);
//   const [showMainLayout, setShowMainLayout] = useState(false);

//   const handleProcessSuccess = (data) => {
//     setProcessedData(data);
//     setShowMainLayout(true);
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       {!showMainLayout ? (
//         <InvoiceUploadPage onProcessSuccess={handleProcessSuccess} />
//       ) : (
//         <>
//           <button
//             onClick={() => {
//               setShowMainLayout(false);
//               setProcessedData(null);
//             }}
//             style={{
//               padding: "0.5rem 1rem",
//               margin: "0.5rem",
//               background: "#f5f5f5",
//               border: "1px solid #ddd",
//               borderRadius: "4px",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "500",
//             }}
//           >
//             ← Upload New File
//           </button>
//           <MainLayout data={processedData} />
//         </>
//       )}
//     </div>
//   );
// };

// export default App;


import React, { useContext } from 'react';
import { UserContext } from './context/UserContext';
import InvoiceUploadPage from './components/InvoiceUploadPage';
import MainLayout from './components/MainLayout';

function App() {
  const { currentView } = useContext(UserContext);

  return (
    <div className="App">
      {currentView === "upload" ? <InvoiceUploadPage /> : <MainLayout />}
    </div>
  );
}

export default App;