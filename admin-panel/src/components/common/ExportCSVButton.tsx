import React from "react";

interface ExportCSVButtonProps {
  data: object[];
  filename?: string;
  className?: string;
}

export const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({ data, filename = "export.csv", className }) => {
  const handleExport = () => {
    if (!data || !data.length) return;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    for (const row of data as Record<string, any>[]) {
      const values = headers.map(header => {
        const val = row[header];
        if (typeof val === "string") {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(","));
    }
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button type="button" className={className || "px-3 py-2 bg-blue-600 text-white rounded"} onClick={handleExport}>
      Export CSV
    </button>
  );
};
