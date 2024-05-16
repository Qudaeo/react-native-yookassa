export type PaymentType =
  | 'YOO_MONEY'
  | 'GOOGLE_PAY'
  | 'BANK_CARD'
  | 'SBERBANK'
  | 'SBP';
type SavePaymentMethodType = 'ON' | 'OFF' | 'USER_SELECTS';
type Currency = 'RUB' | 'USD' | 'EUR' | 'CUSTOM';

export interface Payment {
  amount: number;
  currency: Currency;
  types: PaymentType[];
  savePaymentMethod: SavePaymentMethodType;
  yooKassaClientId: string;
}
