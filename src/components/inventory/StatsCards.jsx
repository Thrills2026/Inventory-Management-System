import React from "react";
import { Package2, Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({ data = [], mode }) {
  // Safe check taa kay data hamesha array form mein rahay aur app crash na ho
  const safeData = Array.isArray(data) ? data : [];

  if (mode === "expenses") {
    const totalExp = safeData.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-6">
        <Card>
          <CardContent className="p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">PKR {totalExp.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalItems = safeData.length;
  const totalValue = safeData.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <Card>
        <CardContent className="p-6 flex flex-row items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Package2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-1 lg:col-span-2">
        <CardContent className="p-6 flex flex-row items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Inventory Value</p>
            <p className="text-2xl font-bold">PKR {totalValue.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}