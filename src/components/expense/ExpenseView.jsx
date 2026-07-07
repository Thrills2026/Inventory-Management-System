import React, { useState, useMemo } from "react";
import { Edit2, Trash2, Plus, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Date ko DD/MM/YYYY mein format karne ka chota function
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export default function ExpenseView({ expenses, onAdd, onEdit, onDelete }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExpenses = useMemo(() => {
    let result = expenses;
    
    // Search Filter
    if (searchQuery && searchQuery.trim() !== "") {
      result = result.filter(e => 
        e.expenseName.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }
    
    // Date Filters (Comparison ke liye ISO format use kar rahe hain)
    if (fromDate) result = result.filter(e => e.date >= fromDate);
    if (toDate) result = result.filter(e => e.date <= toDate);
    
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, fromDate, toDate, searchQuery]);

  const totalExpense = filteredExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  const clearFilters = () => { 
    setFromDate(""); 
    setToDate(""); 
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-8 w-full sm:w-[180px]" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input type="date" className="w-auto" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <span className="text-muted-foreground text-sm">to</span>
            <Input type="date" className="w-auto" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>

          {(fromDate || toDate || searchQuery) && (
            <Button variant="ghost" onClick={clearFilters}>Clear</Button>
          )}
        </div>
        <Button onClick={onAdd}><Plus className="w-4 h-4 mr-2" /> Add Expense</Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date (DD/MM/YYYY)</th>
                <th className="px-4 py-3">Expense Name</th>
                <th className="px-4 py-3">Comments</th>
                <th className="px-4 py-3 text-right">Amount (PKR)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="border-b border-border">
                  <td className="px-4 py-3">{formatDate(exp.date)}</td>
                  <td className="px-4 py-3 font-medium">{exp.expenseName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{exp.comments || "-"}</td>
                  <td className="px-4 py-3 text-right font-semibold">{Number(exp.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(exp)}><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(exp.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted-foreground">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-secondary/30 p-4 border-t border-border flex justify-between items-center">
          <span className="font-medium text-muted-foreground">Total Filtered Expense</span>
          <span className="text-xl font-bold text-destructive">PKR {totalExpense.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}