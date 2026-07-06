import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sun, Moon, LogOut, ShoppingBag, BarChart3 } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { useSearch } from "@/lib/SearchContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("thrills_unlocked");
    window.location.href = "/Thrills-Dashboard/";
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 text-background" />
            </div>
            <span className="hidden sm:block font-display font-semibold text-lg tracking-tight text-foreground">
              Thrills Store
            </span>
          </Link>

          <div className="flex-1 relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                navigate("/");
              }}
              placeholder="Search items..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-input bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link
              to="/report"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Report
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-secondary transition-colors text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full hover:bg-secondary transition-colors text-foreground"
              aria-label="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        <Link
          to="/report"
          className="sm:hidden flex items-center gap-1.5 mt-2 text-sm font-medium text-muted-foreground"
        >
          <BarChart3 className="w-4 h-4" /> Evaluation Report
        </Link>
      </div>
    </header>
  );
}