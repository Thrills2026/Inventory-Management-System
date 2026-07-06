import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MediaUpload from "./MediaUpload";
import { Loader2 } from "lucide-react";

const emptyForm = {
  item_name: "",
  quantity: "",
  price: "",
  number_of_bags: "",
  items_in_each_bag: "",
  comments: "",
  media_url: "",
  media_type: "none",
};

export default function ItemFormModal({ open, onOpenChange, item, onSave, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              item_name: item.item_name || "",
              quantity: item.quantity ?? "",
              price: item.price ?? "",
              number_of_bags: item.number_of_bags ?? "",
              items_in_each_bag: item.items_in_each_bag ?? "",
              comments: item.comments || "",
              media_url: item.media_url || "",
              media_type: item.media_type || "none",
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, item]);

  const evaluation = (Number(form.quantity) || 0) * (Number(form.price) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.item_name.trim()) newErrors.item_name = "Item name is required";
    if (form.quantity === "" || Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity)))
      newErrors.quantity = "Enter a valid whole number";
    if (form.price === "" || Number(form.price) < 0) newErrors.price = "Enter a valid price";
    if (form.number_of_bags === "" || Number(form.number_of_bags) < 0)
      newErrors.number_of_bags = "Number of bags is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...form,
      quantity: Number(form.quantity),
      price: Number(form.price),
      number_of_bags: Number(form.number_of_bags),
      items_in_each_bag: form.items_in_each_bag === "" ? null : Number(form.items_in_each_bag),
      evaluation,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Item Name *</label>
            <input
              value={form.item_name}
              onChange={(e) => setForm({ ...form, item_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. Denim Jacket"
            />
            {errors.item_name && <p className="text-xs text-destructive mt-1">{errors.item_name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Quantity *</label>
              <input
                type="number"
                step="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0"
              />
              {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Price *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0.00"
              />
              {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Evaluation (auto-calculated)</label>
            <div className="w-full px-3.5 py-2.5 rounded-xl bg-secondary text-foreground font-medium">
              Rs {evaluation.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Number of Bags *</label>
              <input
                type="number"
                step="1"
                value={form.number_of_bags}
                onChange={(e) => setForm({ ...form, number_of_bags: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0"
              />
              {errors.number_of_bags && <p className="text-xs text-destructive mt-1">{errors.number_of_bags}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Items in Each Bag</label>
              <input
                type="number"
                step="1"
                value={form.items_in_each_bag}
                onChange={(e) => setForm({ ...form, items_in_each_bag: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Image or Video</label>
            <MediaUpload
              mediaUrl={form.media_url}
              mediaType={form.media_type}
              onChange={(url, type) => setForm({ ...form, media_url: url, media_type: type })}
              uploading={uploading}
              setUploading={setUploading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Comments</label>
            <textarea
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Additional notes..."
            />
          </div>

          <Button type="submit" disabled={saving || uploading} className="w-full rounded-xl py-6 text-base">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {item ? "Save Changes" : "Add Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}