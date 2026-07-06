import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, Trash2, ImageIcon, PlayCircle, Package2 } from "lucide-react";

export default function InventoryCard({ item, onEdit, onDelete }) {
  const inStock = Number(item.quantity) > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <Link to={`/item/${item.id}`} className="block relative aspect-[4/3] bg-secondary overflow-hidden">
        {item.media_url ? (
          item.media_type === "video" ? (
            <div className="w-full h-full flex items-center justify-center relative">
              <video src={item.media_url} className="w-full h-full object-cover" muted />
              <PlayCircle className="absolute w-10 h-10 text-white drop-shadow-lg" />
            </div>
          ) : (
            <img
              src={item.media_url}
              alt={item.item_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package2 className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${
            inStock ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </Link>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-foreground leading-tight truncate">{item.item_name}</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
          <p className="text-muted-foreground">Qty: <span className="text-foreground font-medium">{item.quantity}</span></p>
          <p className="text-muted-foreground">Price: <span className="text-foreground font-medium">Rs {Number(item.price).toLocaleString()}</span></p>
          <p className="text-muted-foreground">Bags: <span className="text-foreground font-medium">{item.number_of_bags}</span></p>
          <p className="text-muted-foreground">Value: <span className="text-foreground font-medium">Rs {Number(item.evaluation).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span></p>
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          {item.date_added} &middot; {item.time_added}
        </p>

        <div className="flex items-center justify-end gap-1 pt-2 border-t border-border mt-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
            aria-label="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}