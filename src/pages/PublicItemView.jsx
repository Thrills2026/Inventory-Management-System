import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Package, Calendar, Banknote, Tag, PlayCircle } from "lucide-react";

export default function PublicItemView({ itemId }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await base44.entities.InventoryItem.get(itemId);
        if (data) {
          setItem(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Item Not Found</h1>
        <p className="text-muted-foreground mt-2">The item you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const evaluation = (Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="max-w-3xl w-full bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
        
        {/* Media Section */}
        <div className="relative w-full aspect-video bg-secondary">
          {item.media_url ? (
            item.media_type === "video" ? (
              <video src={item.media_url} className="w-full h-full object-cover" controls autoPlay muted />
            ) : (
              <img src={item.media_url} alt={item.item_name} className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <span className="absolute top-4 left-4 px-3 py-1.5 bg-primary/90 text-primary-foreground text-sm font-medium rounded-full shadow-sm">
            {item.media_type === "video" ? "Video Demo" : "Product Image"}
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <h1 className="text-3xl font-display font-bold text-foreground">{item.item_name || "Unnamed Item"}</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
              <Tag className="w-6 h-6 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price per unit</p>
                <p className="text-xl font-bold text-foreground">PKR {Number(item.price || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
              <Package className="w-6 h-6 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Quantity</p>
                <p className="text-xl font-bold text-foreground">{item.quantity || 0} Pieces</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
              <Banknote className="w-6 h-6 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Evaluation</p>
                <p className="text-xl font-bold text-primary">PKR {evaluation}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
              <Calendar className="w-6 h-6 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Added On</p>
                <p className="text-lg font-medium text-foreground">
                  {item.date_added || "N/A"} <span className="text-sm text-muted-foreground ml-1">{item.time_added || ""}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-xs text-muted-foreground">Thrills Inventory Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}