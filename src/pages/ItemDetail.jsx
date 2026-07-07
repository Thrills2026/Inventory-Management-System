import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, Pencil, Trash2, Package2, Share2, Send } from "lucide-react";
import { motion } from "framer-motion";
import ItemFormModal from "@/components/inventory/ItemFormModal";
import DeleteConfirmDialog from "@/components/inventory/DeleteConfirmDialog";
import DispatchModal from "@/components/inventory/DispatchModal";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [editingDispatch, setEditingDispatch] = useState(null);

  const loadItem = () => {
    base44.entities.InventoryItem.get(id).then((data) => {
      setItem(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async (formData) => {
    setSaving(true);
    const now = new Date();
    await base44.entities.InventoryItem.update(item.id, {
      ...formData,
      last_modified_date: now.toLocaleDateString(),
      last_modified_time: now.toLocaleTimeString(),
    });
    setSaving(false);
    setEditOpen(false);
    loadItem();
  };

  const handleDelete = async () => {
    await base44.entities.InventoryItem.delete(item.id);
    navigate("/");
  };

  const handleShare = () => {
    const link = `${window.location.origin}/Inventory-Management-System/?view=${item.id}`;
    navigator.clipboard.writeText(link);
    // Alert popup remove kar diya gaya hai
  };

  const handleSaveDispatch = async (dispatchData) => {
    const historyList = item.dispatch_history || [];
    let newHistory = [];
    let quantityDifference = 0;

    if (editingDispatch) {
      const oldEntry = historyList.find(h => h.id === dispatchData.id);
      quantityDifference = Number(oldEntry.pieces) - Number(dispatchData.pieces);
      newHistory = historyList.map(h => 
        h.id === dispatchData.id 
        ? { ...h, shopName: dispatchData.shopName, pieces: dispatchData.pieces, evaluation: dispatchData.pieces * h.lockedPrice, date: dispatchData.date } 
        : h
      );
    } else {
      const lockedPrice = Number(item.price || 0);
      const newEntry = {
        id: dispatchData.id,
        shopName: dispatchData.shopName,
        pieces: dispatchData.pieces,
        lockedPrice: lockedPrice,
        evaluation: dispatchData.pieces * lockedPrice,
        date: dispatchData.date
      };
      newHistory = [...historyList, newEntry];
      quantityDifference = -Number(dispatchData.pieces);
    }

    const newMainQuantity = Number(item.quantity || 0) + quantityDifference;
    const newMainEvaluation = newMainQuantity * Number(item.price || 0); // Evaluation theek calculation

    await base44.entities.InventoryItem.update(item.id, {
      quantity: newMainQuantity,
      evaluation: newMainEvaluation, // Database mein nayi value save hogi
      dispatch_history: newHistory
    });
    
    setEditingDispatch(null);
    loadItem();
  };

  const handleDeleteDispatch = async (dispatchId) => {
    if(!window.confirm("Are you sure you want to delete this dispatch record? Quantity will be returned to stock.")) return;
    
    const historyList = item.dispatch_history || [];
    const entryToDelete = historyList.find(h => h.id === dispatchId);
    const newHistory = historyList.filter(h => h.id !== dispatchId);
    
    const newMainQuantity = Number(item.quantity || 0) + Number(entryToDelete.pieces);
    const newMainEvaluation = newMainQuantity * Number(item.price || 0);

    await base44.entities.InventoryItem.update(item.id, {
      quantity: newMainQuantity,
      evaluation: newMainEvaluation, // History delete honay par bhi evaluation theek hogi
      dispatch_history: newHistory
    });
    
    loadItem();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">Item not found.</p>
        <Link to="/" className="text-foreground underline mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const inStock = Number(item.quantity) > 0;
  const dispatchHistory = item.dispatch_history || [];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
      >
        <div className="relative aspect-video bg-secondary max-h-[400px]">
          {item.media_url ? (
            item.media_type === "video" ? (
              <video src={item.media_url} className="w-full h-full object-cover" controls autoPlay muted />
            ) : (
              <img src={item.media_url} alt={item.item_name} className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package2 className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <span
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-medium ${
              inStock ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground tracking-tight">{item.item_name}</h1>
            
            <div className="flex items-center gap-2 shrink-0 bg-secondary/50 p-1.5 rounded-full border border-border">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full hover:bg-background transition-colors text-foreground"
                title="Copy Public Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setEditingDispatch(null); setDispatchModalOpen(true); }}
                className="p-2.5 rounded-full hover:bg-background transition-colors text-foreground"
                title="Send to Shop"
              >
                <Send className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-border mx-1"></div>
              <button
                onClick={() => setEditOpen(true)}
                className="p-2.5 rounded-full hover:bg-background transition-colors text-foreground"
                title="Edit Item"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="p-2.5 rounded-full hover:bg-destructive/10 transition-colors text-destructive"
                title="Delete Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-secondary/20 p-6 rounded-2xl border border-border">
            <Field label="Quantity" value={item.quantity} />
            <Field label="Price" value={`PKR ${Number(item.price).toLocaleString()}`} />
            <Field label="Evaluation" value={`PKR ${Number(item.evaluation).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} />
            <Field label="Number of Bags" value={item.number_of_bags} />
            <Field label="Items per Bag" value={item.items_in_each_bag ?? "—"} />
            <Field label="Date Added" value={`${item.date_added || "—"} ${item.time_added || ""}`} />
          </div>

          {item.comments && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Comments</p>
              <p className="text-foreground bg-secondary/30 rounded-xl p-4 whitespace-pre-wrap border border-border">{item.comments}</p>
            </div>
          )}

          <div className="pt-6 border-t border-border mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-foreground">Dispatch History</h2>
            </div>

            {dispatchHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-secondary/30 rounded-xl p-6 text-center border border-border">
                No items have been sent to any shop yet.
              </p>
            ) : (
              <div className="bg-secondary/20 rounded-xl overflow-hidden border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Shop</th>
                        <th className="px-4 py-3">Pieces</th>
                        <th className="px-4 py-3">Rate</th>
                        <th className="px-4 py-3">Evaluation</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dispatchHistory.map((historyItem) => (
                        <tr key={historyItem.id} className="hover:bg-secondary/40 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">{historyItem.date}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{historyItem.shopName}</td>
                          <td className="px-4 py-3">{historyItem.pieces}</td>
                          <td className="px-4 py-3">PKR {Number(historyItem.lockedPrice).toLocaleString()}</td>
                          <td className="px-4 py-3 font-semibold text-primary">PKR {Number(historyItem.evaluation).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => { setEditingDispatch(historyItem); setDispatchModalOpen(true); }} 
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDispatch(historyItem.id)} 
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors ml-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      </motion.div>

      <ItemFormModal open={editOpen} onOpenChange={setEditOpen} item={item} onSave={handleSave} saving={saving} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} />
      
      <DispatchModal 
        open={dispatchModalOpen} 
        onOpenChange={setDispatchModalOpen} 
        item={item} 
        onSave={handleSaveDispatch} 
        editData={editingDispatch} 
      />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-foreground font-medium">{value}</p>
    </div>
  );
}