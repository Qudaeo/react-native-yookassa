import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { type PaymentType } from './Payment'

export interface Spec extends TurboModule {
  attach(params: {
    SHOP_ID: string;
    SHOP_TOKEN: string;
    SHOP_NAME: string;
    SHOP_RETURN_URL: string;
    SHOP_DESCRIPTION: string;
    PAYMENT_AMOUNT: number;
    PAYMENT_CURRENCY: string;
    PAYMENT_TYPES_ARRAY: string[];
    PAYMENT_SAVE_TYPE: string;
    PAYMENT_YOO_MONEY_CLIENT_ID: string;
  }): Promise<[string, PaymentType]>;
  show3ds(
    requestUrl: string,
    paymentType: string,
    shopId: string,
    clientApplicationKey: string,
  ): Promise<'RESULT_OK' | undefined>;
  close(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('YandexPayment');
