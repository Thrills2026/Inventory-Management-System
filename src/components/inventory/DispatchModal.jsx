import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DispatchModal({ open, onOpenChange, item, onSave, editData = null }) {
  const [shopName, setShopName] = useState("");
  const [pieces, setPieces] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (editData) {
        setShopName(editData.shopName || "");
        setPieces(editData.pieces || "");
        setDispatchDate(editData.date || "");
      } else {
        setShopName(""); setPieces(""); setDispatchDate(new Date().toISOString().split("T")[0]);
      }
    }
  }, [open, editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      id: editData ? editData.id : Date.now().toString(),
      shopName, pieces: Number(pieces), date: dispatchDate || new Date().toISOString().split("T")[0]
    });
    setLoading(false);
    onOpenChange(false);
  };

  if (!item) return null;
  const maxAllowed = editData ? Number(item.quantity) + Number(editData.pieces) : Number(item.quantity);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editData ? "Edit Dispatch" : "Send to Shop"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Shop Name</Label><Input value={shopName} onChange={(e) => setShopName(e.target.value)} required /></div>
          <div><Label>Pieces</Label><Input type="number" min="1" max={maxAllowed} value={pieces} onChange={(e) => setPieces(e.target.value)} required /></div>
          <div><Label>Date</Label><Input type="date" value={dispatchDate} onChange={(e) => setDispatchDate(e.target.value)} required /></div>
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={loading}>Save</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}