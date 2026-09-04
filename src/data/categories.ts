import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'oils',
    name: 'زيوت الشعر',
    iconName: 'oil',
    color: '#82532E',
  },
  {
    id: 'henna',
    name: 'الحنة',
    iconName: 'leaf',
    color: '#34533F',
  },
  {
    id: 'shampoo',
    name: 'شامبو',
    iconName: 'shampoo',
    color: '#D97706',
  },
  {
    id: 'care',
    name: 'العناية',
    iconName: 'sparkles',
    color: '#EAB308',
  },
];

export const PRESET_IMAGES = [
  {
    title: 'زيت الحشيش الهندي الأصلي',
    category: 'زيوت الشعر',
    url: 'https://images.unsplash.com/photo-1608248597359-21799276d479?w=800&auto=format&fit=crop&q=80',
    description: 'زيت هندي طبيعي ومكثف لتقوية بصيلات الشعر، ومنع التساقط، وتحفيز نمو شعر صحي ولامع.',
    price: 25000,
  },
  {
    title: 'حنة راجستان الطبيعية النقية',
    category: 'الحنة',
    url: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80',
    description: 'حنة هندية معصورة على البارد من مزارع راجستان، تغذي الفروة وتمنح الشعر لوناً دافئاً ولمعاناً فائقاً.',
    price: 15000,
  },
  {
    title: 'شامبو الأيورفيدا بالأعشاب الطبيعية',
    category: 'شامبو',
    url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
    description: 'شامبو غني بخلاصة الشيكاكاي والأملا لتنظيف الفروة بلطف دون تجريدها من الزيوت الطبيعية.',
    price: 18000,
  },
  {
    title: 'سيروم ماء الورد والزعفران للبشرة',
    category: 'العناية',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    description: 'إكسير نضارة هندي ببتلات الورد وزهرة الزعفران، لترطيب عميق وتوحيد لون البشرة وإشراقتها.',
    price: 22000,
  },
];
