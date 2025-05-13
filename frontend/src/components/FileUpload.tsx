import React, { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("csv", file);

    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    alert(result.message || "Upload complete");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
        }}
        required
      />
      <br />
      <br />
      <input type="submit" value="Upload CSV" />
    </form>
  );
}
