// ============================================
// TypeScript Types — KWU Store E-Commerce
// ============================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string; // decimal comes as string from DB
  comparePrice: string | null;
  categoryId: number | null;
  images: string[];
  stock: number | null;
  orderCount: number | null;
  isActive: boolean | null;
  weight: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  category?: Category | null;
}

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  stock: number;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote: string | null;
  items: OrderItem[];
  subtotal: string;
  total: string;
  status: string | null;
  createdAt: Date | null;
}

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
}

export interface SiteConfig {
  id: number;
  storeName: string;
  storeTagline: string | null;
  logoUrl: string | null;
  whatsappNumber: string;
  aboutTitle: string | null;
  aboutText: string | null;
  aboutImageUrl: string | null;
  address: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  operationalHours: string | null;
  createdAt: Date | null;
}

export interface LocalOrder {
  orderNumber: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
  customerName: string;
}

export interface ProfileData {
  name: string;
  phone: string;
  address: string;
  avatarInitials: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface ProductResponse {
  product: Product;
}

export interface RecommendedResponse {
  products: Product[];
}

export interface OrderResponse {
  order: Order;
  orderNumber: string;
}

export interface SiteConfigResponse {
  config: SiteConfig;
}

export interface CategoriesResponse {
  categories: Category[];
}
