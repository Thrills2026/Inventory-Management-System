import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function EvaluationReport() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.InventoryItem.list("-created_date").then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const grandTotal = items.reduce((sum, i) => sum + (Number(i.evaluation) || 0), 0);
  const totalQuantity = items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  const totalBags = items.reduce((sum, i) => sum + (Number(i.number_of_bags) || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground tracking-tight">Evaluation Report</h1>
        <p className="text-muted-foreground mt-1">Complete overview of the store's inventory value.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-xl font-display font-semibold text-foreground">{items.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Products</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-xl font-display font-semibold text-foreground">{totalQuantity.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Quantity</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-xl font-display font-semibold text-foreground">{totalBags.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Bags</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {items.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">No inventory items yet.</p>
        ) : (
          items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.02 }}
              className="p-4 sm:p-5 flex items-center justify-between gap-4"
            >
              <p className="font-medium text-foreground truncate">{item.item_name}</p>
              <p className="text-sm sm:text-base text-muted-foreground whitespace-nowrap">
                {item.quantity} &times; Rs {Number(item.price).toLocaleString()} ={" "}
                <span className="text-foreground font-semibold">
                  Rs {Number(item.evaluation).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </p>
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-foreground text-background rounded-2xl p-6 flex items-center justify-between">
        <p className="font-display font-semibold text-lg">Grand Total Inventory Value</p>
        <p className="font-display font-semibold text-2xl">
          Rs {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
}