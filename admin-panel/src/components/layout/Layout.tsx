// src/components/layout/GenericLayout.tsx
import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface GenericLayoutProps {
  title: string;
  subtitle?: string;
  filters?: React.ReactNode;
  buttons?: React.ReactNode;
  table: React.ReactNode;
  modal?: React.ReactNode;
  errorSection?: React.ReactNode;
}

export const GenericLayout: React.FC<GenericLayoutProps> = ({
  title,
  subtitle,
  filters,
  buttons,
  table,
  modal,
  errorSection,
}) => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          {buttons}
        </div>
        {filters && (
          <div className="flex flex-wrap gap-4 items-center mb-4">
            {filters}
          </div>
        )}
        {errorSection}
        {table}
        {modal}
      </div>
    </div>
  </div>
);
