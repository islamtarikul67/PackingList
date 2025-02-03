export function formatCurrency(value: number, currency: string): string {
  return `${currency} ${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function calculateCommission(amount: number): number {
  return Math.ceil(amount / 1000) * 18.50;
}

export function calculateIncentive(amount: number): number {
  return amount * 0.025;
}
