import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Package, Calendar, Banknote, Tag } from "lucide-react";

export default function PublicItemView({ itemId }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await base44.entities.InventoryItem.get(itemId);
        if (data) setItem(data);
        else setError(true);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error || !item) return <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4"><Package className="w-16 h-16 text-muted-foreground mb-4" /><h1 className="text-2xl font-bold">Item Not Found</h1></div>;

  const evaluation = (Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString();

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-start">
      <div className="max-w-2xl w-full bg-card rounded-2xl shadow-sm border p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
          <h1 className="text-3xl font-display font-bold">{item.item_name || "Unnamed Item"}</h1>
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{item.media_type || "Standard"}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
            <Tag className="w-6 h-6 text-muted-foreground mt-0.5" />
            <div><p className="text-sm font-medium text-muted-foreground">Price per unit</p><p className="text-xl font-bold">PKR {Number(item.price || 0).toLocaleString()}</p></div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
            <Package className="w-6 h-6 text-muted-foreground mt-0.5" />
            <div><p className="text-sm font-medium text-muted-foreground">Available Quantity</p><p className="text-xl font-bold">{item.quantity || 0} Pieces</p></div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
            <Banknote className="w-6 h-6 text-muted-foreground mt-0.5" />
            <div><p className="text-sm font-medium text-muted-foreground">Total Evaluation</p><p className="text-xl font-bold">PKR {evaluation}</p></div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
            <Calendar className="w-6 h-6 text-muted-foreground mt-0.5" />
            <div><p className="text-sm font-medium text-muted-foreground">Added On</p><p className="text-lg font-medium">{item.date_added || "N/A"}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}