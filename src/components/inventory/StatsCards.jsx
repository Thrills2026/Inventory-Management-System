import React from "react";
import { motion } from "framer-motion";
import { Package, Layers, ShoppingBag, DollarSign } from "lucide-react";

function StatCard({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
      </div>
      <p className="text-2xl font-display font-semibold text-foreground tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
}

export default function StatsCards({ items }) {
  const totalProducts = items.length;
  const totalQuantity = items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  const totalBags = items.reduce((sum, i) => sum + (Number(i.number_of_bags) || 0), 0);
  const totalValue = items.reduce((sum, i) => sum + (Number(i.evaluation) || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard icon={Package} label="Total Products" value={totalProducts} delay={0} />
      <StatCard icon={Layers} label="Total Quantity" value={totalQuantity.toLocaleString()} delay={0.05} />
      <StatCard icon={ShoppingBag} label="Total Bags" value={totalBags.toLocaleString()} delay={0.1} />
      <StatCard
        icon={DollarSign}
        label="Total Inventory Value"
        value={`Rs ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        delay={0.15}
      />
    </div>
  );
}