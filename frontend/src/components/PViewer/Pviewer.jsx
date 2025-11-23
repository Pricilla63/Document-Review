
import React, { useState, useEffect, useContext } from "react";
import PDFViewer from "../PDFViewer/PDFViewer";
import {
  NextOutline,
  PreviousOutline,
  Rotate,
  WatsonHealthZoomPan,
  ZoomIn,
  ZoomOut,
  ZoomReset,
} from "@carbon/icons-react";
import { Tooltip } from "carbon-components-react";
import { UserContext } from "../../context/UserContext.jsx";

const PViewer = ({ hoveredKey, data, setPageRenderReady }) => {
  const { selectedDocType, currentFile, jsonData } = useContext(UserContext);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [PDFLoad, setPDFLoad] = useState(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const togglePan = () => setIsPanning((p) => !p);

  useEffect(() => {
    if (
      hoveredKey &&
      hoveredKey.pageNum != null &&
      hoveredKey.pageNum !== pageNumber
    ) {
      setPageNumber(hoveredKey.pageNum);
    }
  }, [hoveredKey?.pageNum]);

  useEffect(() => {
    setPageRenderReady(false);
  }, [pageNumber]);

  useEffect(() => {
    handlePDFChange();
  }, [selectedDocType, currentFile]);

  const handlePDFChange = () => {
    // If there's an uploaded file, use it instead of sample PDFs
    if (currentFile) {
      // Create object URL for the uploaded file
      const fileUrl = URL.createObjectURL(currentFile);
      setPDFLoad(fileUrl);
      return;
    }

    // Fallback to sample PDFs if no file is uploaded
    switch (selectedDocType) {
      case "Bank Statement":
        setPDFLoad("/3188332/pdf/ic_3188332_bankstatement1.pdf");
        break;
      case "Paystub":
        setPDFLoad("/3188332/pdf/ic_3188332_paystub.pdf");
        break;
      case "W2":
        setPDFLoad("/3188332/pdf/ic_3188332_w2.pdf");
        break;
      case "Schedule E":
        setPDFLoad("");
        break;
      case "Credit Report":
        setPDFLoad("/3188332/pdf/ic_3188332_creditreport.pdf");
        break;
      case "VVOE":
        setPDFLoad("");
        break;
      case "WVOE":
        setPDFLoad("/3188332/pdf/ic_3188332_wvoe.pdf");
        break;
      case "1040":
        setPDFLoad("/1040/pdf/31883324_1.pdf");
        break;
      default:
        setPDFLoad("/3188332/pdf/ic_3188332_paystub.pdf");
        break;
    }
  };

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (currentFile && PDFLoad && PDFLoad.startsWith('blob:')) {
        URL.revokeObjectURL(PDFLoad);
      }
    };
  }, [currentFile, PDFLoad]);

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setIsPanning(false);
  };

  const handleMouseDown = (e) => {
    if (!isPanning) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startOffset = { ...offset };

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setOffset({ x: startOffset.x + dx, y: startOffset.y + dy });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const showResetButton =
    zoom !== 1 || rotation !== 0 || offset.x !== 0 || offset.y !== 0;

  // Show file info if uploaded file exists
  const renderFileInfo = () => {
    if (!currentFile) return null;

    return (
      <div style={{
        margin: "0 20px 10px 20px",
        padding: "8px 12px",
        backgroundColor: "#f4f4f4",
        borderRadius: "4px",
        fontSize: "14px",
        borderLeft: "4px solid #0f62fe"
      }}>
        <strong>File:</strong> {currentFile.name} 
        <span style={{ marginLeft: "10px", color: "#666" }}>
          ({Math.round(currentFile.size / 1024)} KB)
        </span>
      </div>
    );
  };

  return (
    <React.Fragment>
      {/* File Info */}
      {renderFileInfo()}
      
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "10px 20px",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <ZoomIn onClick={handleZoomIn} style={{ cursor: "pointer" }} />
          <ZoomOut onClick={handleZoomOut} style={{ cursor: "pointer" }} />
          <WatsonHealthZoomPan 
            onClick={togglePan} 
            style={{ 
              cursor: "pointer",
              color: isPanning ? "#0f62fe" : "inherit"
            }} 
          />
          {showResetButton && <ZoomReset onClick={handleReset} style={{ cursor: "pointer" }} />}
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          <PreviousOutline
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            style={{ cursor: "pointer" }}
          />
          <span>
            Page {pageNumber} of {numPages || "?"}
          </span>
          <NextOutline
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages || 1))}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <div
        onMouseDown={handleMouseDown}
        style={{
          height: "85dvh",
          overflow: "auto",
          position: "relative",
          cursor: isPanning ? "grab" : "default",
        }}
      >
        <div
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: "top center",
            transition: isPanning ? "none" : "transform 0.3s ease",
          }}
        >
          {PDFLoad ? (
            <PDFViewer
              file={PDFLoad}
              numPages={numPages}
              setNumPages={setNumPages}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              data={jsonData}  // Use jsonData from context
              hoveredKey={hoveredKey?.key}
              scale={zoom}
            />
          ) : (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#666",
              fontSize: "16px"
            }}>
              {currentFile ? "Loading PDF..." : "No PDF file selected"}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PViewer;