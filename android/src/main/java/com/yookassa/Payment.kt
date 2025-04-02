package com.yookassa

import ru.yoomoney.sdk.kassa.payments.checkoutParameters.PaymentMethodType
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.SavePaymentMethod

/**
 * @since 2019
 * @author Anton Vlasov - whalemare
 */
data class Payment(
  val amount: Double,
  val currency: String,
  val types: Set<PaymentMethodType>,
  val savePaymentMethod: SavePaymentMethod,
  val yooKassaClientId: String
)
