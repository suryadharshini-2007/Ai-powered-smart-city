export type ProductCategory = 'RICE' | 'VEGETABLES' | 'TOMATO' | 'WHEAT';

export interface ProductDetail {
  id: string;
  name: string;
  pricePerKg: number;
  displayPrice: string;
  stock: string;
  stockStatus: 'Available' | 'Low Stock' | 'Out of Stock';
  stockPercent: number;
  origin: string;
  organicStatus: string;
  recommendation: string;
  traceabilityHash: string;
  harvestDate: string;
  nutritionalHighlights: string[];
}

export type RobotAction =
  | 'WELCOME CUSTOMER'
  | 'SHOW PRODUCTS'
  | 'ASSIST CUSTOMER'
  | 'START PURCHASE';

export interface RobotShopkeeperState {
  id: string;
  name: string;
  status: 'ACTIVE' | 'ASSISTING' | 'NAVIGATING' | 'PURCHASING';
  customersAssisted: number;
  currentTask: string;
  dialogue: string;
}

export type CheckoutStage =
  | 'IDLE'
  | 'PRODUCT_SCAN'
  | 'CART_TOTAL'
  | 'DIGITAL_PAYMENT'
  | 'PAYMENT_SUCCESSFUL';

export interface ScannedProduct {
  id: string;
  name: string;
  category: string;
  weightKg: number;
  pricePerKg: number;
  total: number;
  rfidTag: string;
}

export interface MarketMetrics {
  customersToday: number;
  productsAvailable: number;
  robotsActive: number;
  avgScanSpeedMs: number;
  organicCertificationRate: number;
}
