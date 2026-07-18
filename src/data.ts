import type { MenuCategory } from './types';

export const RESTAURANT = {
  name: 'بيتزا لاتسيو',
  nameEn: 'Pizza Lazio',
  tagline: 'الطعم الإيطالي الأصيل',
  address: '42 شارع خاتم المرسلين، الجيزة، مصر',
  addressEn: '42 Khatem El Morsaleen St., Giza, Egypt',
  phone: '01285559610',
  phoneIntl: '201285559610',
  coords: { lat: 29.9984715, lng: 31.2114755 },
};

export const WHATSAPP_NUMBER = '201285559610';

export const DELIVERY = {
  baseFee: 15,
  corridorWidthM: 500,
  stepM: 500,
  stepFee: 5,
};

/** Khatem El Morsaleen street boundary points for delivery calc. */
export const STREET_BOUNDARIES = {
  west: { lat: 30.003312, lng: 31.205711 }, // Teraat El Zomar side
  east: { lat: 29.991612, lng: 31.21852 }, // Osman Moharram side
};

/** Price of the "البيتزا الشرقي" pie add-on, depends on pie size. */
export const SHARQI_PIZZA_PRICE: Partial<Record<'S' | 'M' | 'L', number>> = {
  S: 30,
  M: 30,
  L: 60,
};

export const SHARQI_PIZZA_LABEL = 'البيتزا الشرقي';

export const STUFFED_CRUST_OPTIONS = [
  { key: 'none', label: 'بدون', short: '—', price: 0 },
  { key: 'stuffed_crust_s', label: 'حشو S', short: 'S', price: 40 },
  { key: 'stuffed_crust_m', label: 'حشو M', short: 'M', price: 45 },
  { key: 'stuffed_crust_l', label: 'حشو L', short: 'L', price: 60 },
] as const;

export const SAUCE_PRICE = {
  S: 20,
  M: 20,
  L: 30,
};

export const SIZE_LABELS: Record<string, string> = {
  S: 'صغير',
  M: 'وسط',
  L: 'كبير',
};

export const CURRENCY = 'ج.م';

export const menuData: MenuCategory[] = [
  {
    category: 'البيتزا الإيطالي',
    items: [
      { name: 'مارغريتا', prices: { S: 90, M: 100, L: 125 } },
      { name: 'خضروات', prices: { S: 95, M: 105, L: 125 } },
      { name: 'سوسيس', prices: { S: 110, M: 120, L: 135 } },
      { name: 'سموكد تركي', prices: { S: 120, M: 130, L: 145 } },
      { name: 'بسطرمة', prices: { S: 120, M: 130, L: 150 } },
      { name: 'تونة مفتتة', prices: { S: 110, M: 120, L: 140 } },
      { name: 'تونة قطع', prices: { S: 120, M: 130, L: 155 } },
      { name: 'عشاق جبن', prices: { S: 110, M: 120, L: 140 } },
      { name: 'مشروم', prices: { S: 110, M: 125, L: 140 } },
      { name: 'سجق', prices: { S: 110, M: 120, L: 135 } },
      { name: 'سجق بلدي', prices: { S: 120, M: 130, L: 150 } },
      { name: 'بولونيز (لحمة مفرومة)', prices: { S: 110, M: 125, L: 145 } },
      { name: 'فاهيتا فراخ', prices: { S: 120, M: 130, L: 150 } },
      { name: 'جمبري', prices: { S: 120, M: 130, L: 150 } },
      { name: 'سلامي', prices: { S: 120, M: 130, L: 145 } },
      { name: 'بولوبيف', prices: { S: 150, M: 175, L: 200 } },
      { name: 'تريببيانا', prices: { S: 125, M: 135, L: 160 } },
      { name: 'سوبر سوبريم', prices: { S: 130, M: 140, L: 160 } },
      { name: 'فواكه البحر', prices: { S: 130, M: 140, L: 160 } },
      { name: 'بيتزا لاتسيو (الدلوعة)', prices: { S: 140, M: 160, L: 185 } },
      { name: 'بيتزا لاتسيو (المجنونة)', prices: { S: 130, M: 140, L: 160 } },
      { name: 'نابوليتانا (أنشوجة)', prices: { M: 165, L: 220 } },
    ],
  },
  {
    category: 'الفطائر الحادق الإسكندراني',
    items: [
      { name: 'جبنة رومي', prices: { S: 95, M: 105, L: 125 } },
      { name: 'جبنة موزاريلا', prices: { S: 95, M: 105, L: 125 } },
      { name: 'جبنة كيري', prices: { S: 120, M: 130, L: 150 } },
      { name: 'مكس جبن', prices: { S: 120, M: 130, L: 160 } },
      { name: 'سجق إسكندراني', prices: { S: 105, M: 115, L: 135 } },
      { name: 'سجق بلدي', prices: { S: 120, M: 130, L: 150 } },
      { name: 'لحمة مفرومة', prices: { S: 115, M: 125, L: 145 } },
      { name: 'فراخ', prices: { S: 120, M: 130, L: 150 } },
      { name: 'مشروم', prices: { S: 110, M: 120, L: 135 } },
      { name: 'بسطرمة', prices: { S: 115, M: 125, L: 155 } },
      { name: 'سوسيس', prices: { S: 105, M: 115, L: 135 } },
      { name: 'بولوبيف', prices: { S: 120, M: 135, L: 155 } },
      { name: 'لاتسيو لحوم', prices: { S: 125, M: 135, L: 160 } },
      { name: 'سلامي', prices: { S: 120, M: 130, L: 150 } },
      { name: 'تونة مفتتة', prices: { S: 110, M: 120, L: 135 } },
      { name: 'تونة قطع', prices: { S: 120, M: 130, L: 155 } },
      { name: 'جمبري', prices: { S: 120, M: 135, L: 155 } },
      { name: 'أنشوجة', prices: { M: 165, L: 220 } },
      { name: 'سي فود', prices: { S: 130, M: 140, L: 165 } },
    ],
  },
  {
    category: 'الصواريخ',
    items: [
      { name: 'جبنه رومي', prices: { M: 105, L: 125 } },
      { name: 'جبنه موزاريلا', prices: { M: 105, L: 125 } },
      { name: 'مكس جبن', prices: { M: 125, L: 145 } },
      { name: 'سجق إسكندراني', prices: { M: 105, L: 130 } },
      { name: 'سجق بلدي', prices: { M: 115, L: 145 } },
      { name: 'لحمة', prices: { M: 110, L: 135 } },
      { name: 'بسطرمة', prices: { M: 120, L: 145 } },
      { name: 'فراخ', prices: { M: 120, L: 145 } },
      { name: 'سوسيس', prices: { M: 105, L: 135 } },
      { name: 'مشروم وسوسيس', prices: { M: 125, L: 145 } },
      { name: 'تونة', prices: { M: 105, L: 135 } },
      { name: 'جمبري', prices: { M: 120, L: 145 } },
      { name: 'لاتسيو لحوم', prices: { M: 125, L: 155 } },
      { name: 'سي فود', prices: { M: 130, L: 155 } },
      { name: 'سلامي', prices: { M: 120, L: 145 } },
    ],
  },
  {
    category: 'بنا لاتسيو (مكرونة قلم)',
    items: [
      { name: 'خضروات', prices: { M: 85 } },
      { name: 'فراخ', prices: { M: 100 } },
      { name: 'لحمة مفرومة', prices: { M: 100 } },
      { name: 'مشروم', prices: { M: 100 } },
      { name: 'سوسيس', prices: { M: 100 } },
      { name: 'سجق', prices: { M: 100 } },
      { name: 'جمبري', prices: { M: 110 } },
      { name: 'ميكس لحوم', prices: { M: 120 } },
      { name: 'سي فود', prices: { M: 130 } },
    ],
  },
  {
    category: 'الفطير المشلتت',
    items: [
      { name: 'مشلتت بالسمنة البلدي', prices: { S: 100, M: 120, L: 140 } },
      { name: 'مشلتت بالقشطة والعسل', prices: { S: 120, M: 140, L: 160 } },
    ],
  },
  {
    category: 'الفطائر الحلو',
    items: [
      { name: 'سكر سادة', prices: { M: 55, L: 70 } },
      { name: 'سكر ولبن', prices: { M: 70, L: 90 } },
      { name: 'كريمة', prices: { M: 65, L: 85 } },
      { name: 'شوكولاتة', prices: { M: 80, L: 100 } },
      { name: 'مكسرات', prices: { M: 85, L: 100 } },
      { name: 'قشطة وعسل', prices: { M: 80, L: 100 } },
      { name: 'ميكس لاتسيو', prices: { M: 80, L: 100 } },
    ],
  },
  {
    category: 'حواوشي',
    items: [
      { name: 'حواوشي اسكندراني سجق', prices: { M: 120, L: 140 } },
      { name: 'حواوشي اسكندراني لحمة', prices: { M: 125, L: 145 } },
    ],
  },
  {
    category: 'الإضافات',
    items: [
      { name: 'شيدر', prices: { M: 40, L: 60 } },
      { name: 'مشروم', prices: { M: 30, L: 60 } },
      { name: 'زيتون', prices: { M: 20, L: 30 } },
      { name: 'خضار', prices: { M: 20, L: 30 } },
      { name: 'كيري', prices: { M: 25, L: 50 } },
      { name: 'موزاريلا', prices: { M: 40, L: 60 } },
      { name: 'لحمة', prices: { M: 40, L: 60 } },
      { name: 'سوسيس', prices: { M: 40, L: 60 } },
      { name: 'سجق', prices: { M: 40, L: 60 } },
      { name: 'بسطرمة', prices: { M: 40, L: 60 } },
      { name: 'سلامي', prices: { M: 40, L: 60 } },
      { name: 'فراخ', prices: { M: 40, L: 60 } },
      { name: 'تونة', prices: { M: 40, L: 60 } },
      { name: 'جمبري', prices: { M: 40, L: 60 } },
      { name: 'كاليماري', prices: { M: 40, L: 60 } },
    ],
  },
  {
    category: 'المشروبات',
    items: [
      { name: 'كانز كولا', prices: { M: 25 } },
      { name: 'كانز بيبسي', prices: { M: 25 } },
      { name: 'لتر ونصف كولا', prices: { M: 45 } },
      { name: 'لتر ونصف بيبسي', prices: { M: 45 } },
      { name: 'مياه معدنية صغيرة', prices: { M: 10 } },
      { name: 'مياه معدنية كبيرة', prices: { M: 20 } },
    ],
  },
];

export const PIZZA_CATEGORY = 'البيتزا الإيطالي';
export const PIE_CATEGORY = 'الفطائر الحادق الإسكندراني';
