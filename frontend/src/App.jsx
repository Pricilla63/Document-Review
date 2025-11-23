
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