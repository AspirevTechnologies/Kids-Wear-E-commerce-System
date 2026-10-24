/**
 * SADP - Kids Sizing Standards
 * Mapping standard sizes by age bracket, height, and fabric suitability.
 */

export interface KidSizeChartItem {
  sizeTag: string;
  recommendedAge: string;
  heightCm: string;
  chestCm: string;
}

export const KIDS_SIZE_CHARTS: Record<string, KidSizeChartItem[]> = {
  INFANT: [
    { sizeTag: '0-3M', recommendedAge: '0 to 3 Months', heightCm: '55-61', chestCm: '40-43' },
    { sizeTag: '3-6M', recommendedAge: '3 to 6 Months', heightCm: '61-67', chestCm: '43-45' },
    { sizeTag: '6-12M', recommendedAge: '6 to 12 Months', heightCm: '67-78', chestCm: '45-48' },
  ],
  TODDLER: [
    { sizeTag: '1-2Y', recommendedAge: '12 to 24 Months', heightCm: '78-88', chestCm: '48-51' },
    { sizeTag: '2-3Y', recommendedAge: '2 to 3 Years', heightCm: '88-96', chestCm: '51-53' },
    { sizeTag: '3-4Y', recommendedAge: '3 to 4 Years', heightCm: '96-104', chestCm: '53-55' },
  ],
  LITTLE_KIDS: [
    { sizeTag: '4-5Y', recommendedAge: '4 to 5 Years', heightCm: '104-110', chestCm: '55-57' },
    { sizeTag: '5-6Y', recommendedAge: '5 to 6 Years', heightCm: '110-116', chestCm: '57-60' },
    { sizeTag: '6-7Y', recommendedAge: '6 to 7 Years', heightCm: '116-122', chestCm: '60-63' },
  ],
};
