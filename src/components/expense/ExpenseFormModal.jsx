import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExpenseFormModal({ open, onOpenChange, onSave, editData = null, saving }) {
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (open) {
      setExpenseName(editData?.expenseName || "");
      setAmount(editData?.amount || "");
      setDate(editData?.date || new Date().toISOString().split("T")[0]);
      setComments(editData?.comments || "");
    }
  }, [open, editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ expenseName, amount: Number(amount), date, comments });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editData ? "Edit Expense" : "Add Expense"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Expense Name</Label>
            <Input value={expenseName} onChange={e => setExpenseName(e.target.value)} required />
          </div>
          <div>
            <Label>Amount (PKR)</Label>
            <Input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div>
            <Label>Comments</Label>
            <Input value={comments} onChange={e => setComments(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}