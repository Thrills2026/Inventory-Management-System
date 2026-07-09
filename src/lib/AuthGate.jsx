import React, { useState } from "react";
import { Lock, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "thrills_unlocked";
const APP_PASSWORD = "Ahmadijaz123$";

export default function AuthGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === "true");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (password === APP_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  if (unlocked) return children;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center mb-4 shadow-lg">
            <ShoppingBag className="w-7 h-7 text-background" />
          </div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground">Thrills Store</h1>
          <p className="text-sm text-muted-foreground mt-1">Inventory Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-destructive font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Unlock"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}