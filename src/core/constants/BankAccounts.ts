import { BankAccountDetails } from '@/shared/types/common';

/**
 * Approved Sri Lankan Bank Accounts for Manual Bank Transfers
 * Matches the client-approved local banking details for LittleStyles Kids Wear.
 */
export const SRI_LANKAN_BANK_ACCOUNTS: BankAccountDetails[] = [
  {
    bankName: 'Commercial Bank of Ceylon (COMBANK)',
    accountName: 'LittleStyles Kids Wear (Pvt) Ltd',
    accountNumber: '1000293847',
    branch: 'Kollupitiya Branch, Colombo 03',
    branchCode: '045',
    swiftCode: 'CCBCLKHX',
  },
  {
    bankName: 'Bank of Ceylon (BOC)',
    accountName: 'LittleStyles Kids Wear (Pvt) Ltd',
    accountNumber: '0004928371',
    branch: 'Corporate Branch, Colombo 01',
    branchCode: '001',
    swiftCode: 'BCEYLKLX',
  },
  {
    bankName: 'Hatton National Bank (HNB)',
    accountName: 'LittleStyles Kids Wear (Pvt) Ltd',
    accountNumber: '0392817462',
    branch: 'Green Path Branch, Colombo 07',
    branchCode: '039',
    swiftCode: 'HBLILKLX',
  },
];

export const BANK_ACCOUNTS = SRI_LANKAN_BANK_ACCOUNTS;

export const BANK_TRANSFER_INSTRUCTIONS = [
  'Transfer the exact order total via Online Banking, Mobile App (e.g. Flash, Q+), or Cash Deposit Machine (CDM).',
  'Strictly include your Order Reference (e.g. LS-XXXX) in the transfer description/remark.',
  'Submit your transfer slip or transaction reference on the order confirmation screen or via WhatsApp.',
  'Orders will be dispatched promptly once our finance team manually reconciles the statement with your reference.',
];
