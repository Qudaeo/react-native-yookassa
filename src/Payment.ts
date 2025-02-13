export type PaymentType =
  | 'YOO_MONEY'
  | 'GOOGLE_PAY'
  | 'BANK_CARD'
  | 'SBERBANK'
  | 'SBP';
export type SavePaymentMethodType = 'ON' | 'OFF' | 'USER_SELECTS';
export type Currency = 'RUB' | 'USD' | 'EUR' | 'CUSTOM';

export interface Payment {
  amount: number;
  currency: Currency;
  types: PaymentType[];
  savePaymentMethod: SavePaymentMethodType;
  yooKassaClientId: string;
}
