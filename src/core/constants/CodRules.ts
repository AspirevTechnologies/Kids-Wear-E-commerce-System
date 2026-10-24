/**
 * SADP - Domain Business Rules (Sri Lanka Local Retail)
 * Cash on Delivery (COD) configuration and fraud-prevention thresholds in LKR.
 */

export const COD_RULES = {
  MIN_ORDER_AMOUNT: 1500,       // Below Rs. 1,500, COD is disabled to protect delivery unit economics
  MAX_ORDER_AMOUNT: 35000,      // Above Rs. 35,000, COD is restricted to prevent High Return-to-Origin (RTO) loss
  COD_HANDLING_FEE: 350,        // Islandwide courier partner cash collection & handling charge
  FREE_COD_THRESHOLD: 6500,     // Free COD & Delivery on carts above Rs. 6,500
  OTP_VERIFICATION_REQUIRED: true, // Mandatory phone verification for COD orders in Sri Lanka
  BLOCKED_PINCODES: ['00000', '99999'] as readonly string[], // Restricted logistic zones
};
