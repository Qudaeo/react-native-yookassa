type PaymentType =
  | 'YOO_MONEY'
  | 'GOOGLE_PAY'
  | 'BANK_CARD'
  | 'SBERBANK'
  | 'SBP';
type SavePaymentMethodType = 'ON' | 'OFF' | 'USER_SELECTS';
type Currency = 'RUB' | 'USD' | 'EUR';

export interface Payment {
  /**
   * Amount of the payment (price)
   */
  amount: number;
  currency: Currency;
  types: PaymentType[];
  savePaymentMethod: SavePaymentMethodType;
  yooKassaClientId: string;
}
