export const MANAGER_AVATAR = '/src/assets/images/manager_avatar_1794998818566.jpg';

export const PROMO_CHICKEN_IMAGE = '/src/assets/images/chicken_whole_1794998816005.jpg';

export const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'LayoutGrid' },
  { id: 'whole', label: 'Whole Chicken', icon: 'Bird' },
  { id: 'pieces', label: 'Pieces', icon: 'Boxes' },
  { id: 'breast', label: 'Breast', icon: 'Slice' },
  { id: 'leg', label: 'Leg', icon: 'Drumstick' },
  { id: 'wings', label: 'Wings', icon: 'Feather' },
  { id: 'liver', label: 'Liver', icon: 'Heart' },
  { id: 'gizzard', label: 'Gizzard', icon: 'CircleDot' },
  { id: 'boneless', label: 'Boneless', icon: 'Package' },
];

export const PRODUCTS = [
  {
    id: 'whole-chicken',
    name: 'Whole Chicken',
    subtitle: '',
    pricePerKg: 280,
    category: 'whole',
    sku: 'FF-101',
    defaultAddWeight: 1.0,
    stockKg: 18.5,
    image: '/src/assets/images/chicken_whole_1794998816005.jpg',
  },
  {
    id: 'chicken-pieces',
    name: 'Chicken Pieces',
    subtitle: '(Curry Cut)',
    pricePerKg: 320,
    category: 'pieces',
    sku: 'FF-102',
    defaultAddWeight: 0.5,
    stockKg: 9.2,
    image: '/src/assets/images/chicken_curry_pieces_1794998817430.jpg',
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    subtitle: '(Boneless)',
    pricePerKg: 420,
    category: 'breast',
    secondaryCategories: ['boneless'],
    sku: 'FF-103',
    defaultAddWeight: 0.5,
    stockKg: 6.4,
    image: '/src/assets/images/chicken_breast_boneless_1794998817406.jpg',
  },
  {
    id: 'chicken-leg',
    name: 'Chicken Leg',
    subtitle: '(Drumstick)',
    pricePerKg: 300,
    category: 'leg',
    sku: 'FF-104',
    defaultAddWeight: 0.5,
    stockKg: 5.0,
    image: '/src/assets/images/chicken_leg_drumstick_1794998817373.jpg',
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    subtitle: '',
    pricePerKg: 340,
    category: 'wings',
    sku: 'FF-105',
    defaultAddWeight: 0.5,
    stockKg: 3.1,
    image: '/src/assets/images/chicken_wings_1794998817423.jpg',
  },
  {
    id: 'chicken-liver',
    name: 'Chicken Liver',
    subtitle: '',
    pricePerKg: 260,
    category: 'liver',
    sku: 'FF-106',
    defaultAddWeight: 0.25,
    stockKg: 1.5,
    image: '/src/assets/images/chicken_liver_1794998817431.jpg',
  },
  {
    id: 'chicken-gizzard',
    name: 'Chicken Gizzard',
    subtitle: '(Cleaned)',
    pricePerKg: 250,
    category: 'gizzard',
    sku: 'FF-107',
    defaultAddWeight: 0.5,
    stockKg: 0.8,
    image: '/src/assets/images/chicken_liver_1794998817431.jpg',
  },
  {
    id: 'boneless-cubes',
    name: 'Boneless Cubes',
    subtitle: '(Tikka Cut)',
    pricePerKg: 440,
    category: 'boneless',
    sku: 'FF-108',
    defaultAddWeight: 0.5,
    stockKg: 0.7,
    image: '/src/assets/images/chicken_boneless_cubes_1794998818110.jpg',
  },
];

export const WEIGHT_PRESETS = [0.5, 1, 1.5, 2, 2.5, 3];

export const RATE_OPTIONS = [240, 250, 260, 280, 300, 320, 340, 380, 420, 440];

export const INITIAL_CART = [
  {
    id: 'whole-chicken',
    name: 'Whole Chicken',
    subtitle: '',
    pricePerKg: 280,
    weightKg: 1.0,
    image: '/src/assets/images/chicken_whole_1794998816005.jpg',
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    subtitle: '(Boneless)',
    pricePerKg: 420,
    weightKg: 0.5,
    image: '/src/assets/images/chicken_breast_boneless_1794998817406.jpg',
  },
  {
    id: 'chicken-liver',
    name: 'Chicken Liver',
    subtitle: '',
    pricePerKg: 260,
    weightKg: 0.25,
    image: '/src/assets/images/chicken_liver_1794998817431.jpg',
  },
];

export const INITIAL_KHATA_CUSTOMERS = [
  { id: 'kh-1', name: 'Al-Madina Biryani House', phone: '+91 98204 11230', balance: 6450, lastOrder: 'Today, 09:40 AM' },
  { id: 'kh-2', name: 'Royal Tandoor Caterers', phone: '+91 98192 44810', balance: 5280, lastOrder: 'Yesterday' },
  { id: 'kh-3', name: 'Imran Khan (Regular)', phone: '+91 97650 33192', balance: 1890, lastOrder: 'Yesterday' },
  { id: 'kh-4', name: 'Spice Route Kitchen', phone: '+91 98331 77420', balance: 4700, lastOrder: '2 days ago' },
];

export const INITIAL_SUPPLIERS = [
  { id: 'sup-1', name: 'Sahyadri Poultry Farms', contact: 'Ramesh Patil', phone: '+91 98220 55410', birdsDelivered: 120, weightKg: 196.5, payable: 7560, status: 'Settled Today' },
  { id: 'sup-2', name: 'Deccan Hatcheries Pvt Ltd', contact: 'Suhail Qureshi', phone: '+91 97641 22901', birdsDelivered: 85, weightKg: 142.0, payable: 4200, status: 'Pending' },
  { id: 'sup-3', name: 'Kaveri Broiler Traders', contact: 'Manoj Deshmukh', phone: '+91 98901 64312', birdsDelivered: 60, weightKg: 98.4, payable: 0, status: 'Paid' },
];

export const INITIAL_EXPENSES = [
  { id: 'exp-1', title: 'Morning Ice Blocks & Cold Storage', category: 'Operations', amount: 850, time: '07:15 AM', mode: 'Cash' },
  { id: 'exp-2', title: 'HDPE Carry Bags & Packaging Roll', category: 'Packaging', amount: 650, time: '08:30 AM', mode: 'Cash' },
  { id: 'exp-3', title: 'Delivery Van Fuel Refill', category: 'Transport', amount: 800, time: '10:05 AM', mode: 'UPI' },
];

export const INITIAL_TRANSACTIONS = [
  { id: 'INV-2048', customer: 'Walk-in Cash', itemsCount: 3, weightKg: 2.5, amount: 740, paymentMode: 'Cash', time: '11:18 AM' },
  { id: 'INV-2047', customer: 'Al-Madina Biryani House', itemsCount: 2, weightKg: 8.0, amount: 2480, paymentMode: 'Khata', time: '10:42 AM' },
  { id: 'INV-2046', customer: 'Walk-in Cash', itemsCount: 1, weightKg: 1.5, amount: 480, paymentMode: 'UPI / QR', time: '10:15 AM' },
  { id: 'INV-2045', customer: 'Walk-in Cash', itemsCount: 4, weightKg: 3.25, amount: 1090, paymentMode: 'Cash', time: '09:30 AM' },
];

export const SIDEBAR_ITEMS = [
  { id: 'pos', label: 'Counter POS', icon: 'Home' },
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutGrid' },
  { id: 'khata', label: 'Khata (Customers)', icon: 'Users' },
  { id: 'suppliers', label: 'Suppliers', icon: 'Truck' },
  { id: 'stock', label: 'Live Stock', icon: 'Package' },
  { id: 'expenses', label: 'Expenses', icon: 'ReceiptText' },
  { id: 'reports', label: 'Reports', icon: 'FileBarChart2' },
  { id: 'products', label: 'Products', icon: 'ShoppingBag' },
  { id: 'categories', label: 'Categories', icon: 'Layers' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];
