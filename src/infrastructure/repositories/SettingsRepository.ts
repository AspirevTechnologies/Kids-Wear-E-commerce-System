import { DatabaseClient } from '../database/DatabaseClient';
import { StoreSettings } from '@/core/entities/StoreSettings';
import { SRI_LANKAN_BANK_ACCOUNTS } from '@/core/constants/BankAccounts';

/**
 * SettingsRepository (SADP Repository Pattern)
 * Persists store configurations (Bank Accounts, Delivery Fees, Contact Info)
 * in the centralized DatabaseClient singleton.
 */
const DEFAULT_DISTRICT_RATES = [
  { id: 'rate-colombo', name: 'Colombo City & Suburbs', districts: ['Colombo'], fee: 350, estimatedDays: 'Same-Day / 1 Day' },
  { id: 'rate-wp', name: 'Western Province (Gampaha & Kalutara)', districts: ['Gampaha', 'Kalutara'], fee: 400, estimatedDays: '1-2 Days' },
  { id: 'rate-central', name: 'Central (Kandy, Matale, Nuwara Eliya)', districts: ['Kandy', 'Matale', 'Nuwara Eliya'], fee: 450, estimatedDays: '2-3 Days' },
  { id: 'rate-southern', name: 'Southern (Galle, Matara, Hambantota)', districts: ['Galle', 'Matara', 'Hambantota'], fee: 450, estimatedDays: '2-3 Days' },
  { id: 'rate-outstation', name: 'Outstation Islandwide (All Other Districts)', districts: ['*'], fee: 500, estimatedDays: '2-3 Days' },
];

const DEFAULT_CATEGORIES = [
  'Dresses & Frocks',
  'Rompers & Onesies',
  'T-Shirts & Tops',
  'Pants & Shorts',
  'Sleepwear & Pyjamas',
  'Festive & Ethnic Wear',
  'Accessories & Shoes',
];

export class SettingsRepository {
  private static readonly STORAGE_KEY = 'store_settings';
  private db: DatabaseClient;

  constructor() {
    this.db = DatabaseClient.getInstance();
    if (!this.db.has(SettingsRepository.STORAGE_KEY)) {
      const defaultSettings: StoreSettings = {
        bankAccounts: [...SRI_LANKAN_BANK_ACCOUNTS],
        delivery: {
          colomboFee: 350,
          westernProvinceFee: 400,
          outstationFee: 500,
          freeShippingThreshold: 5000,
          codMinOrder: 1000,
          codMaxOrder: 50000,
          districtRates: [...DEFAULT_DISTRICT_RATES],
        },
        contact: {
          phone: '077 123 4567',
          whatsapp: '94771234567',
          address: 'No. 45, Galle Road, Colombo 03, Sri Lanka',
          email: 'orders@littlestyles.lk',
          workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM',
        },
        categories: [...DEFAULT_CATEGORIES],
        updatedAt: new Date().toISOString(),
      };
      this.db.set(SettingsRepository.STORAGE_KEY, defaultSettings);
    }
  }

  public async getSettings(): Promise<StoreSettings> {
    const stored = this.db.get<StoreSettings>(SettingsRepository.STORAGE_KEY);
    if (!stored || !stored.bankAccounts || stored.bankAccounts.length === 0) {
      const defaultSettings: StoreSettings = {
        bankAccounts: [...SRI_LANKAN_BANK_ACCOUNTS],
        delivery: stored?.delivery || {
          colomboFee: 350,
          westernProvinceFee: 400,
          outstationFee: 500,
          freeShippingThreshold: 5000,
          codMinOrder: 1000,
          codMaxOrder: 50000,
          districtRates: [...DEFAULT_DISTRICT_RATES],
        },
        contact: stored?.contact || {
          phone: '077 123 4567',
          whatsapp: '94771234567',
          address: 'No. 45, Galle Road, Colombo 03, Sri Lanka',
          email: 'orders@littlestyles.lk',
          workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM',
        },
        categories: stored?.categories || [...DEFAULT_CATEGORIES],
        updatedAt: new Date().toISOString(),
      };
      if (!defaultSettings.delivery.districtRates || defaultSettings.delivery.districtRates.length === 0) {
        defaultSettings.delivery.districtRates = [...DEFAULT_DISTRICT_RATES];
      }
      this.db.set(SettingsRepository.STORAGE_KEY, defaultSettings);
      return defaultSettings;
    }
    if (!stored.delivery.districtRates || stored.delivery.districtRates.length === 0) {
      stored.delivery.districtRates = [...DEFAULT_DISTRICT_RATES];
      this.db.set(SettingsRepository.STORAGE_KEY, stored);
    }
    if (!stored.categories || stored.categories.length === 0) {
      stored.categories = [...DEFAULT_CATEGORIES];
      this.db.set(SettingsRepository.STORAGE_KEY, stored);
    }
    return stored;
  }

  public async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();
    const updated: StoreSettings = {
      ...current,
      bankAccounts: updates.bankAccounts && updates.bankAccounts.length > 0 ? updates.bankAccounts : current.bankAccounts,
      delivery: {
        ...current.delivery,
        ...(updates.delivery || {}),
      },
      contact: {
        ...current.contact,
        ...(updates.contact || {}),
      },
      categories: updates.categories && updates.categories.length > 0 ? updates.categories : current.categories,
      updatedAt: new Date().toISOString(),
    };
    this.db.set(SettingsRepository.STORAGE_KEY, updated);
    return updated;
  }
}
