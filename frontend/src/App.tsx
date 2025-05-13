import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DataList from "./components/DataList";

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Uploader</h1>
      <FileUpload />
      <DataList />
    </div>
  );
}
