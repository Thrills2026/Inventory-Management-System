import React, { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Plus, Package2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useSearch } from "@/lib/SearchContext";
import StatsCards from "@/components/inventory/StatsCards";
import FilterTabs from "@/components/inventory/FilterTabs";
import InventoryCard from "@/components/inventory/InventoryCard";
import ItemFormModal from "@/components/inventory/ItemFormModal";
import DeleteConfirmDialog from "@/components/inventory/DeleteConfirmDialog";
import ExpenseView from "@/components/expense/ExpenseView";
import ExpenseFormModal from "@/components/expense/ExpenseFormModal";

export default function Dashboard() {
  const { searchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState("products");

  const [items, setItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const [expFormOpen, setExpFormOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsData, expData] = await Promise.all([
        base44.entities.InventoryItem.list("-created_date"),
        base44.entities.Expense.list("-created_date").catch(() => [])
      ]);
      setItems(itemsData || []);
      setExpenses(expData || []);
    } catch (error) {
      console.error("Failed to load data", error);
    }
    setLoading(false);
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;
    if (filter !== "all") result = result.filter((i) => i.media_type === filter);
    if (searchTerm.trim()) {
      result = result.filter((i) => i.item_name.toLowerCase().includes(searchTerm.trim().toLowerCase()));
    }
    return result;
  }, [items, filter, searchTerm]);

  // Product Handlers
  const handleAdd = () => { 
    setEditingItem(null); 
    setFormOpen(true); 
  };
  
  const handleEdit = (item) => { 
    setEditingItem(item); 
    setFormOpen(true); 
  };

  const handleSaveItem = async (formData) => {
    setSaving(true);
    const now = new Date();
    if (editingItem) {
      await base44.entities.InventoryItem.update(editingItem.id, {
        ...formData,
        last_modified_date: now.toLocaleDateString(),
        last_modified_time: now.toLocaleTimeString(),
      });
    } else {
      await base44.entities.InventoryItem.create({
        ...formData,
        date_added: now.toLocaleDateString(),
        time_added: now.toLocaleTimeString(),
      });
    }
    setSaving(false); 
    setFormOpen(false); 
    loadData();
  };

  const handleDeleteItem = async () => {
    await base44.entities.InventoryItem.delete(deletingItem.id);
    setDeletingItem(null);
    loadData();
  };

  // Expense Handlers
  const handleSaveExp = async (formData) => {
    setSaving(true);
    if (editingExp) {
      await base44.entities.Expense.update(editingExp.id, formData);
    } else {
      await base44.entities.Expense.create(formData);
    }
    setSaving(false); 
    setExpFormOpen(false); 
    loadData();
  };

  const handleDeleteExp = async (id) => {
    if(window.confirm("Are you sure you want to delete this expense?")) { 
      await base44.entities.Expense.delete(id); 
      loadData(); 
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border pb-4">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab("products")} 
            className={`text-xl sm:text-2xl font-display font-semibold pb-2 border-b-2 transition-all tracking-tight ${activeTab === 'products' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab("expenses")} 
            className={`text-xl sm:text-2xl font-display font-semibold pb-2 border-b-2 transition-all tracking-tight ${activeTab === 'expenses' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}
          >
            Expenses
          </button>
        </div>
        
        {activeTab === "products" && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        )}
      </div>

      <StatsCards data={activeTab === "products" ? items : expenses} mode={activeTab} />

      {activeTab === "products" ? (
        <>
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
        </>
      ) : (
        <ExpenseView 
          expenses={expenses} 
          onAdd={() => { setEditingExp(null); setExpFormOpen(true); }} 
          onEdit={(exp) => { setEditingExp(exp); setExpFormOpen(true); }} 
          onDelete={handleDeleteExp} 
        />
      )}

      {/* Modals & Dialogs */}
      <ItemFormModal open={formOpen} onOpenChange={setFormOpen} item={editingItem} onSave={handleSaveItem} saving={saving} />
      <DeleteConfirmDialog open={!!deletingItem} onOpenChange={(v) => !v && setDeletingItem(null)} onConfirm={handleDeleteItem} />
      <ExpenseFormModal open={expFormOpen} onOpenChange={setExpFormOpen} editData={editingExp} onSave={handleSaveExp} saving={saving} />
    </div>
  );
}