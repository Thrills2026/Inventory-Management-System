import React, { useState, useMemo } from "react";
import { Edit2, Trash2, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/SearchContext";

export default function ExpenseView({ expenses, onAdd, onEdit, onDelete }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  // Search context ko yahan import kar liya gaya hai
  const { searchTerm } = useSearch();

  const filteredExpenses = useMemo(() => {
    let result = expenses;
    
    // Date Filters
    if (fromDate) result = result.filter(e => e.date >= fromDate);
    if (toDate) result = result.filter(e => e.date <= toDate);
    
    // Search Filter by Name
    if (searchTerm && searchTerm.trim() !== "") {
      result = result.filter(e => 
        e.expenseName.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }
    
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, fromDate, toDate, searchTerm]);

  // Total expense ab hamesha filtered result ka hi sum nikalay ga
  const totalExpense = filteredExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  const clearFilters = () => { 
    setFromDate(""); 
    setToDate(""); 
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input type="date" className="w-auto" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <span className="text-muted-foreground">to</span>
            <Input type="date" className="w-auto" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          {(fromDate || toDate) && <Button variant="ghost" onClick={clearFilters}>Clear</Button>}
        </div>
        <Button onClick={onAdd}><Plus className="w-4 h-4 mr-2" /> Add Expense</Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Expense Name</th>
                <th className="px-4 py-3">Comments</th>
                <th className="px-4 py-3 text-right">Amount (PKR)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="border-b border-border">
                  <td className="px-4 py-3">{exp.date}</td>
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
                  <td colSpan="5" className="text-center py-8 text-muted-foreground">
                    No expenses found for selected filters or search.
                  </td>
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