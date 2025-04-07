import type { PaymentToken } from './PaymentToken';
import type { Payment, PaymentType } from './Payment';
import type { Shop } from './Shop';
import NativeYookassa from './NativeYookassa'

export class YandexPayment {
  static show(shop: Shop, payment: Payment): Promise<PaymentToken> {
    return NativeYookassa.attach({
      SHOP_ID: shop.id,
      SHOP_TOKEN: shop.token,
      SHOP_NAME: shop.name,
      SHOP_RETURN_URL: shop.returnUrl
        ? shop.returnUrl
        : 'https://custom.redirect.url/',
      SHOP_DESCRIPTION: shop.description,
      PAYMENT_AMOUNT: payment.amount,
      PAYMENT_CURRENCY: payment.currency,
      PAYMENT_TYPES_ARRAY: payment.types || [],
      PAYMENT_SAVE_TYPE: payment.savePaymentMethod || 'OFF',
      PAYMENT_YOO_MONEY_CLIENT_ID: payment.yooKassaClientId,
    }).then(
      (arr: [string, PaymentType]): PaymentToken => ({
        token: arr[0],
        type: arr[1],
      })
    );
  }

  static show3ds(
    requestUrl: string,
    paymentType: PaymentType,
    clientApplicationKey: string,
    shopId: string
  ): Promise<'RESULT_OK'> {
    return NativeYookassa.show3ds(
      requestUrl,
      paymentType,
      clientApplicationKey,
      shopId
    ).then((result?: 'RESULT_OK') => {
      if (result !== 'RESULT_OK') {
        throw new Error('3ds cancelled');
      }
      return result;
    });
  }

  static close() {
    return NativeYookassa.close();
  }
}
