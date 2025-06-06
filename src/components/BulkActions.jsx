import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  XCircle,
  ArrowRight,
  CheckSquare,
  CircleOff,
} from "lucide-react";


export default function BulkActions({
  onSelectAll,
  onClear,
  onContinue,
  onCancel,
  onDelete,
  disabled,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="sticky top-0 z-20 bg-white py-2 shadow-md flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search orders by ID or product"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-sm"
      />
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={onSelectAll}>
          <CheckSquare className="mr-2 h-4 w-4" /> Select All
        </Button>
        <Button variant="outline" onClick={onClear}>
          <CircleOff className="mr-2 h-4 w-4" /> Clear
        </Button>
        <Button onClick={onContinue} disabled={disabled}>
          <ArrowRight className="mr-2 h-4 w-4" /> Continue
        </Button>
        <Button variant="destructive" onClick={onCancel} disabled={disabled}>
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete} disabled={disabled}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  );
}
