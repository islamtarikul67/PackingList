import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ExchangeRateDialog } from "@/components/ui/exchange-rate-dialog";
import { NetworkBackground } from "@/components/ui/network-background";

interface ConversionForm {
  amount: number;
  conversionType: "EURO-TAKA" | "TAKA-EURO";
  exchangeRate: number;
  includeIncentive: boolean;
  includeCommission: boolean;
}

export default function CurrencyConverter() {
  const [results, setResults] = useState<{
    initialAmount: number;
    convertedAmount: number;
    incentiveAmount?: number;
    commissionAmount?: number;
    finalAmount: number;
  } | null>(null);

  const [showRateDialog, setShowRateDialog] = useState(true);

  // Mouse tracking for background animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const form = useForm<ConversionForm>({
    defaultValues: {
      amount: 0,
      conversionType: "EURO-TAKA",
      exchangeRate: 0,
      includeIncentive: false,
      includeCommission: false,
    },
  });

  // Show dialog when conversion type changes
  useEffect(() => {
    setShowRateDialog(true);
  }, [form.watch("conversionType")]);

  const calculateConversion = (data: ConversionForm) => {
    const convertedAmount = data.conversionType === "EURO-TAKA" 
      ? data.amount * data.exchangeRate 
      : data.amount / data.exchangeRate;

    const incentiveAmount = data.includeIncentive ? convertedAmount * 0.025 : 0;
    const subtotal = convertedAmount + incentiveAmount;
    const commissionAmount = data.includeCommission ? Math.ceil(subtotal / 1000) * 18.50 : 0;
    const finalAmount = subtotal - (data.includeCommission ? commissionAmount : 0);

    setResults({
      initialAmount: data.amount,
      convertedAmount,
      incentiveAmount: data.includeIncentive ? incentiveAmount : undefined,
      commissionAmount: data.includeCommission ? commissionAmount : undefined,
      finalAmount,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <motion.div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <NetworkBackground mouseX={mouseX.get()} mouseY={mouseY.get()} />

      <ExchangeRateDialog
        open={showRateDialog}
        onOpenChange={setShowRateDialog}
        onRateSubmit={(rate) => form.setValue("exchangeRate", rate)}
        conversionType={form.watch("conversionType")}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10 p-4"
      >
        <Card className="backdrop-blur-xl bg-white/95 border-white/20 shadow-2xl">
          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-lg relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Currency Exchange</h1>
            <p className="text-white/80 text-sm font-medium tracking-wide">Convert between Euro and Taka with real-time rates</p>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute right-4 bottom-4 text-white/70 font-medium">€ ↔ ৳</div>
          </motion.div>

          <div className="p-6 space-y-6">
            <motion.div layout className="space-y-6">
              <CurrencyInput
                label="Amount"
                {...form.register("amount", { valueAsNumber: true })}
                onChange={(e) => form.setValue("amount", parseFloat(e.target.value) || 0)}
              />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 tracking-tight">Exchange Direction</label>
                <motion.select
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all hover:border-indigo-300 font-medium"
                  {...form.register("conversionType")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <option value="EURO-TAKA">Euro (€) → Taka (৳)</option>
                  <option value="TAKA-EURO">Taka (৳) → Euro (€)</option>
                </motion.select>
              </div>

              <CurrencyInput
                label={`Exchange Rate (1 ${form.watch("conversionType") === "EURO-TAKA" ? "€" : "৳"} = ?${form.watch("conversionType") === "EURO-TAKA" ? "৳" : "€"})`}
                value={form.watch("exchangeRate")}
                onChange={(e) => form.setValue("exchangeRate", parseFloat(e.target.value) || 0)}
                onClick={() => setShowRateDialog(true)}
              />

              <motion.div layout className="space-y-4 bg-gray-50/80 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="incentive"
                    checked={form.watch("includeIncentive")}
                    onCheckedChange={(checked) => form.setValue("includeIncentive", checked === true)}
                  />
                  <label htmlFor="incentive" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Include 2.5% Incentive Bonus
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="commission"
                    checked={form.watch("includeCommission")}
                    onCheckedChange={(checked) => form.setValue("includeCommission", checked === true)}
                  />
                  <label htmlFor="commission" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Calculate Commission (18.50৳/1000৳)
                  </label>
                </div>
              </motion.div>

              <Button
                className="w-full font-semibold text-base"
                onClick={form.handleSubmit(calculateConversion)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Convert Currency
              </Button>

              <AnimatePresence>
                {results && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-lg p-4 space-y-3 border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <span className="font-medium">Initial Amount:</span>
                      <span className="font-semibold">{form.watch("conversionType") === "EURO-TAKA" ? "€" : "৳"} {results.initialAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <span className="font-medium">Converted Amount:</span>
                      <span className="font-semibold">{form.watch("conversionType") === "EURO-TAKA" ? "৳" : "€"} {results.convertedAmount.toFixed(2)}</span>
                    </div>
                    {results.incentiveAmount !== undefined && (
                      <div className="flex justify-between text-green-600 p-2 hover:bg-green-50 rounded-lg transition-colors">
                        <span className="font-medium">Incentive Bonus (2.5%):</span>
                        <span className="font-semibold">{form.watch("conversionType") === "EURO-TAKA" ? "৳" : "€"} {results.incentiveAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {results.commissionAmount !== undefined && (
                      <div className="flex justify-between text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="font-medium">Commission:</span>
                        <span className="font-semibold">৳ {results.commissionAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <motion.div 
                      className="flex justify-between text-lg pt-2 border-t"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="font-bold text-indigo-600 tracking-tight">Final Amount:</span>
                      <span className="font-extrabold text-indigo-600 tracking-tight">{form.watch("conversionType") === "EURO-TAKA" ? "৳" : "€"} {results.finalAmount.toFixed(2)}</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}