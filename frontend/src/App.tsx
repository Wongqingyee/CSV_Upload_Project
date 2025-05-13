import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DataList from "./components/DataList";

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">CSV Uploader</h1>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      <DataList refresh={refreshTrigger} />
    </div>
  );
}
