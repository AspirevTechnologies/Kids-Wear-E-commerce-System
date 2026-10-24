import { DatabaseClient } from '../database/DatabaseClient';
import { StoreSettings, StoreCategoryItem } from '@/core/entities/StoreSettings';
import { SRI_LANKAN_BANK_ACCOUNTS } from '@/core/constants/BankAccounts';

/**
 * SettingsRepository (SADP Repository Pattern)
 * Persists store configurations (Bank Accounts, Delivery Fees, Contact Info, Categories with Images)
 * in the centralized DatabaseClient singleton.
 */
const DEFAULT_DISTRICT_RATES = [
  { id: 'rate-colombo', name: 'Colombo City & Suburbs', districts: ['Colombo'], fee: 350, estimatedDays: 'Same-Day / 1 Day' },
  { id: 'rate-wp', name: 'Western Province (Gampaha & Kalutara)', districts: ['Gampaha', 'Kalutara'], fee: 400, estimatedDays: '1-2 Days' },
  { id: 'rate-central', name: 'Central (Kandy, Matale, Nuwara Eliya)', districts: ['Kandy', 'Matale', 'Nuwara Eliya'], fee: 450, estimatedDays: '2-3 Days' },
  { id: 'rate-southern', name: 'Southern (Galle, Matara, Hambantota)', districts: ['Galle', 'Matara', 'Hambantota'], fee: 450, estimatedDays: '2-3 Days' },
  { id: 'rate-outstation', name: 'Outstation Islandwide (All Other Districts)', districts: ['*'], fee: 500, estimatedDays: '2-3 Days' },
];

export const DEFAULT_CATEGORY_ITEMS: StoreCategoryItem[] = [
  { id: 'cat-dresses', name: 'Dresses & Frocks', image: '/images/categories/girls.jpg' },
  { id: 'cat-rompers', name: 'Rompers & Onesies', image: '/images/categories/baby.jpg' },
  { id: 'cat-tshirts', name: 'T-Shirts & Tops', image: '/images/categories/boys.jpg' },
  { id: 'cat-pants', name: 'Pants & Shorts', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80' },
  { id: 'cat-sleepwear', name: 'Sleepwear & Pyjamas', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80' },
  { id: 'cat-ethnic', name: 'Festive & Ethnic Wear', image: '/images/categories/outfits.jpg' },
  { id: 'cat-accessories', name: 'Accessories & Shoes', image: '/images/categories/accessories.jpg' },
];

const DEFAULT_CATEGORIES = DEFAULT_CATEGORY_ITEMS.map((c) => c.name);

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
        categoryDetails: [...DEFAULT_CATEGORY_ITEMS],
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
        categoryDetails: stored?.categoryDetails || [...DEFAULT_CATEGORY_ITEMS],
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
    if (!stored.categoryDetails || stored.categoryDetails.length === 0) {
      stored.categoryDetails = [...DEFAULT_CATEGORY_ITEMS];
      stored.categories = stored.categoryDetails.map((c) => c.name);
      this.db.set(SettingsRepository.STORAGE_KEY, stored);
    } else if (!stored.categories || stored.categories.length === 0) {
      stored.categories = stored.categoryDetails.map((c) => c.name);
      this.db.set(SettingsRepository.STORAGE_KEY, stored);
    }
    return stored;
  }

  public async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();

    let finalCategoryDetails = updates.categoryDetails ?? current.categoryDetails ?? [...DEFAULT_CATEGORY_ITEMS];
    let finalCategories = updates.categories ?? current.categories ?? DEFAULT_CATEGORIES;

    if (updates.categoryDetails) {
      finalCategoryDetails = updates.categoryDetails;
      finalCategories = updates.categoryDetails.map((c) => c.name);
    } else if (updates.categories) {
      finalCategories = updates.categories;
      const existingMap = new Map((current.categoryDetails || []).map((c) => [c.name.toLowerCase(), c]));
      finalCategoryDetails = updates.categories.map((name) => {
        const found = existingMap.get(name.toLowerCase());
        if (found) return found;
        return {
          id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name,
          image: '/images/categories/outfits.jpg',
        };
      });
    }

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
      categories: finalCategories,
      categoryDetails: finalCategoryDetails,
      updatedAt: new Date().toISOString(),
    };
    this.db.set(SettingsRepository.STORAGE_KEY, updated);
    return updated;
  }
}
