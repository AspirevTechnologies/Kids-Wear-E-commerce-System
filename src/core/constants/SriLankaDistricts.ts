export interface DistrictDeliveryRule {
  district: string;
  province: string;
  deliveryFee: number;
  deliveryDays: string;
  isCodAvailable: boolean;
  majorTowns: string[];
}

export const SRI_LANKA_DISTRICTS: DistrictDeliveryRule[] = [
  {
    district: 'Colombo',
    province: 'Western Province',
    deliveryFee: 350,
    deliveryDays: '1 - 2 Business Days',
    isCodAvailable: true,
    majorTowns: ['Colombo 01-15', 'Dehiwala', 'Mount Lavinia', 'Nugegoda', 'Maharagama', 'Kotte', 'Rajagiriya', 'Battaramulla', 'Moratuwa', 'Homagama'],
  },
  {
    district: 'Gampaha',
    province: 'Western Province',
    deliveryFee: 350,
    deliveryDays: '1 - 2 Business Days',
    isCodAvailable: true,
    majorTowns: ['Negombo', 'Gampaha', 'Wattala', 'Ja-Ela', 'Kelaniya', 'Kadawatha', 'Kiribathgoda', 'Minuwangoda'],
  },
  {
    district: 'Kalutara',
    province: 'Western Province',
    deliveryFee: 400,
    deliveryDays: '2 - 3 Business Days',
    isCodAvailable: true,
    majorTowns: ['Panadura', 'Kalutara', 'Horana', 'Beruwala', 'Aluthgama', 'Matugama'],
  },
  {
    district: 'Kandy',
    province: 'Central Province',
    deliveryFee: 450,
    deliveryDays: '2 - 3 Business Days',
    isCodAvailable: true,
    majorTowns: ['Kandy City', 'Peradeniya', 'Katugastota', 'Gampola', 'Kundasale'],
  },
  {
    district: 'Galle',
    province: 'Southern Province',
    deliveryFee: 450,
    deliveryDays: '2 - 3 Business Days',
    isCodAvailable: true,
    majorTowns: ['Galle Fort', 'Karapitiya', 'Hikkaduwa', 'Ambalangoda', 'Elpitiya'],
  },
  {
    district: 'Matara',
    province: 'Southern Province',
    deliveryFee: 450,
    deliveryDays: '2 - 3 Business Days',
    isCodAvailable: true,
    majorTowns: ['Matara', 'Weligama', 'Dikwella', 'Akuressa'],
  },
  {
    district: 'Kurunegala',
    province: 'North Western Province',
    deliveryFee: 450,
    deliveryDays: '2 - 3 Business Days',
    isCodAvailable: true,
    majorTowns: ['Kurunegala', 'Kuliyapitiya', 'Narammala', 'Pannala'],
  },
  {
    district: 'Jaffna',
    province: 'Northern Province',
    deliveryFee: 500,
    deliveryDays: '3 - 4 Business Days',
    isCodAvailable: true,
    majorTowns: ['Jaffna Town', 'Nallur', 'Chavakachcheri', 'Point Pedro'],
  },
  {
    district: 'Matale',
    province: 'Central Province',
    deliveryFee: 450,
    deliveryDays: '2 - 3 Business Days',
    isCodAvailable: true,
    majorTowns: ['Matale', 'Dambulla', 'Ukuwela'],
  },
  {
    district: 'Nuwara Eliya',
    province: 'Central Province',
    deliveryFee: 480,
    deliveryDays: '3 - 4 Business Days',
    isCodAvailable: true,
    majorTowns: ['Nuwara Eliya', 'Hatton', 'Talawakele'],
  },
  {
    district: 'Hambantota',
    province: 'Southern Province',
    deliveryFee: 480,
    deliveryDays: '3 - 4 Business Days',
    isCodAvailable: true,
    majorTowns: ['Tangalle', 'Hambantota', 'Beliatta', 'Tissamaharama'],
  },
  {
    district: 'Ratnapura',
    province: 'Sabaragamuwa Province',
    deliveryFee: 450,
    deliveryDays: '2 - 3 Business Days',
    isCodAvailable: true,
    majorTowns: ['Ratnapura', 'Embilipitiya', 'Balangoda', 'Pelmadulla'],
  },
  {
    district: 'Kegalle',
    province: 'Sabaragamuwa Province',
    deliveryFee: 450,
    deliveryDays: '2 - 3 Business Days',
    isCodAvailable: true,
    majorTowns: ['Kegalle', 'Mawanella', 'Warakapola'],
  },
  {
    district: 'Anuradhapura',
    province: 'North Central Province',
    deliveryFee: 480,
    deliveryDays: '3 - 4 Business Days',
    isCodAvailable: true,
    majorTowns: ['Anuradhapura Town', 'Kekirawa', 'Medawachchiya'],
  },
  {
    district: 'Badulla',
    province: 'Uva Province',
    deliveryFee: 480,
    deliveryDays: '3 - 4 Business Days',
    isCodAvailable: true,
    majorTowns: ['Badulla', 'Bandarawela', 'Ella', 'Haputale'],
  },
];

export const DEFAULT_DELIVERY_RULE: DistrictDeliveryRule = {
  district: 'Other Sri Lanka',
  province: 'Sri Lanka',
  deliveryFee: 450,
  deliveryDays: '3 - 4 Business Days',
  isCodAvailable: true,
  majorTowns: [],
};
