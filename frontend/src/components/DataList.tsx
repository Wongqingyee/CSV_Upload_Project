import React, { useEffect, useState } from "react";

interface UploadEntry {
  id: number;
  data: Record<string, any>;
}

export default function DataList({ refresh }: { refresh: number }) {
  const [data, setData] = useState<UploadEntry[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (searchTerm) params.append("search", searchTerm);

        const res = await fetch(`http://localhost:3001/data?${params}`);
        const json = await res.json();

        if (json.rows) {
          setData(json.rows);
          setHeaders(json.headers || []);
          setTotalPages(json.totalPages || 1);
        } else {
          console.error("Unexpected response format:", json);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [page, searchTerm, refresh]);

  return (
    <div>
      <h2>Uploaded Data</h2>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // Reset to first page on search
        }}
      />

      {data.length === 0 ? (
        <p>No data found</p>
      ) : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {headers.map((header) => (
                  <td key={header}>{item.data[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      <span>
        {" "}
        Page {page} of {totalPages}{" "}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
