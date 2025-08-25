import React, { useEffect } from "react";

import Navbar from "./Navbar";
import { customThemes } from "../../utils";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    // Initialize theme system
    customThemes.getCurrentTheme();
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--color-background)]">
          <div className="text-[var(--color-text-primary)]">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
