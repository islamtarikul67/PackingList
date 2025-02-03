import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Input
            type="number"
            step="any"
            min="0"
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all"
            ref={ref}
            {...props}
          />
        </motion.div>
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
