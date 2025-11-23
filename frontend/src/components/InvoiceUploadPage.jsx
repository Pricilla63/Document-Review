
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