/**
 * SADP - Shared Utilities
 * Formatter for Sri Lankan Rupee (LKR) currency display (e.g., Rs. 2,490)
 */

export function formatLKR(amount: number): string {
  const formatted = new Intl.NumberFormat('en-LK', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rs. ${formatted}`;
}

// Backward compatibility alias for any existing code
export const formatINR = formatLKR;
