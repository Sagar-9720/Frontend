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
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="flex-1 flex flex-col min-h-0">
      <Navbar />
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* scrollable content area */}
        <div className="flex items-center justify-between top-0 bg-white/90 backdrop-blur z-10 py-2 -mt-2 -mx-6 px-6">
          {/* keep header visible while scrolling */}
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
