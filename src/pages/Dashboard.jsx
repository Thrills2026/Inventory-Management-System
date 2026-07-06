import React, { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Plus, Package2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useSearch } from "@/lib/SearchContext";
import StatsCards from "@/components/inventory/StatsCards";
import FilterTabs from "@/components/inventory/FilterTabs";
import InventoryCard from "@/components/inventory/InventoryCard";
import ItemFormModal from "@/components/inventory/ItemFormModal";
import DeleteConfirmDialog from "@/components/inventory/DeleteConfirmDialog";

export default function Dashboard() {
  const { toast } = useToast();
  const { searchTerm } = useSearch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadItems = () => {
    base44.entities.InventoryItem.list("-created_date").then((data) => {
      setItems(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;
    if (filter !== "all") result = result.filter((i) => i.media_type === filter);
    if (searchTerm.trim()) {
      result = result.filter((i) => i.item_name.toLowerCase().includes(searchTerm.trim().toLowerCase()));
    }
    return result;
  }, [items, filter, searchTerm]);

  const handleAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    if (editingItem) {
      const now = new Date();
      await base44.entities.InventoryItem.update(editingItem.id, {
        ...formData,
        last_modified_date: now.toLocaleDateString(),
        last_modified_time: now.toLocaleTimeString(),
      });
      toast({ title: "Item updated successfully" });
    } else {
      const now = new Date();
      await base44.entities.InventoryItem.create({
        ...formData,
        date_added: now.toLocaleDateString(),
        time_added: now.toLocaleTimeString(),
      });
      toast({ title: "Item added successfully" });
    }
    setSaving(false);
    setFormOpen(false);
    loadItems();
  };

  const handleDelete = async () => {
    await base44.entities.InventoryItem.delete(deletingItem.id);
    toast({ title: "Item deleted successfully" });
    setDeletingItem(null);
    loadItems();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your Thrills Store inventory.</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <StatsCards items={items} />

      <FilterTabs active={filter} onChange={setFilter} />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package2 className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">No items found</p>
          <p className="text-muted-foreground text-sm mt-1">
            {searchTerm ? "Try a different search term" : "Add your first inventory item to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <InventoryCard key={item.id} item={item} onEdit={handleEdit} onDelete={setDeletingItem} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ItemFormModal open={formOpen} onOpenChange={setFormOpen} item={editingItem} onSave={handleSave} saving={saving} />
      <DeleteConfirmDialog open={!!deletingItem} onOpenChange={(v) => !v && setDeletingItem(null)} onConfirm={handleDelete} />
    </div>
  );
}