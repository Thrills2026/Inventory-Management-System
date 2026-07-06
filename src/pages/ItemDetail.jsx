import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, Pencil, Trash2, Package2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import ItemFormModal from "@/components/inventory/ItemFormModal";
import DeleteConfirmDialog from "@/components/inventory/DeleteConfirmDialog";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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
    toast({ title: "Item updated successfully" });
    loadItem();
  };

  const handleDelete = async () => {
    await base44.entities.InventoryItem.delete(item.id);
    toast({ title: "Item deleted successfully" });
    navigate("/");
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

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
      >
        <div className="relative aspect-video bg-secondary">
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

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground tracking-tight">{item.item_name}</h1>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEditOpen(true)}
                className="p-2.5 rounded-full hover:bg-secondary transition-colors text-foreground"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="p-2.5 rounded-full hover:bg-destructive/10 transition-colors text-destructive"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Quantity" value={item.quantity} />
            <Field label="Price" value={`Rs ${Number(item.price).toLocaleString()}`} />
            <Field label="Evaluation" value={`Rs ${Number(item.evaluation).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} />
            <Field label="Number of Bags" value={item.number_of_bags} />
            <Field label="Items per Bag" value={item.items_in_each_bag ?? "—"} />
            <Field label="Date Added" value={`${item.date_added || "—"} ${item.time_added || ""}`} />
          </div>

          {item.comments && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1.5">Comments</p>
              <p className="text-foreground bg-secondary/50 rounded-xl p-4 whitespace-pre-wrap">{item.comments}</p>
            </div>
          )}
        </div>
      </motion.div>

      <ItemFormModal open={editOpen} onOpenChange={setEditOpen} item={item} onSave={handleSave} saving={saving} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} />
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