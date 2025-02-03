import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ExchangeRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRateSubmit: (rate: number) => void;
  conversionType: "EURO-TAKA" | "TAKA-EURO";
}

export function ExchangeRateDialog({
  open,
  onOpenChange,
  onRateSubmit,
  conversionType,
}: ExchangeRateDialogProps) {
  const [rate, setRate] = useState<string>("");

  const handleSubmit = () => {
    const numRate = parseFloat(rate);
    if (numRate > 0) {
      onRateSubmit(numRate);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Exchange Rate</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="rate" className="text-sm font-medium text-gray-700">
              Current Exchange Rate (1 {conversionType === "EURO-TAKA" ? "€" : "৳"} = ?{conversionType === "EURO-TAKA" ? "৳" : "€"})
            </label>
            <Input
              id="rate"
              type="number"
              step="any"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter current rate"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Update Rate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
