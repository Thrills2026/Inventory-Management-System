import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Thrills Store. All rights reserved.</p>
        <p>Inventory System v1.0.0</p>
      </div>
    </footer>
  );
}