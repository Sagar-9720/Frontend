import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { MESSAGE_STRINGS } from "../../utils";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  loading?: boolean;
  emptyMessage?: string;
  variant?: "default" | "striped";
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  loading = false,
  emptyMessage = "No data available",
  variant = "default",
}) => {
  const handleSort = (key: string) => {
    if (!onSort) return;

    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    onSort(key, newDirection);
  };

  const getAlignmentClass = (align: string = "left") => {
    return {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[align];
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-[var(--color-surface)] h-12 rounded-[var(--radius-md)] mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-[var(--color-background)] h-16 rounded-[var(--radius-md)] mb-2"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border)]">
      <table className="min-w-full divide-y divide-[var(--color-border)]">
        <thead className="bg-[var(--color-background)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] 
                  uppercase tracking-wider transition-colors
                  ${getAlignmentClass(column.align)}
                  ${
                    column.sortable
                      ? "cursor-pointer hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                      : ""
                  }
                `}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp
                        className={`w-3 h-3 ${
                          sortKey === column.key && sortDirection === "asc"
                            ? "text-[var(--color-primary)]"
                            : "text-[var(--color-text-disabled)]"
                        }`}
                      />
                      <ChevronDown
                        className={`w-3 h-3 -mt-1 ${
                          sortKey === column.key && sortDirection === "desc"
                            ? "text-[var(--color-primary)]"
                            : "text-[var(--color-text-disabled)]"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`bg-[var(--color-surface)] ${
            variant === "striped" ? "divide-y divide-[var(--color-border)]" : ""
          }`}
        >
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-[var(--color-text-secondary)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className={`
                  hover:bg-[var(--color-background)] transition-colors
                  ${
                    variant === "striped" && index % 2 === 1
                      ? "bg-[var(--color-background)]"
                      : ""
                  }
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]
                      ${getAlignmentClass(column.align)}
                    `}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
