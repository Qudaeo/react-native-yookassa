package com.yookassa

import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*
import com.yookassa.result.ActivityResultListener
import com.yookassa.result.InlineActivityResult
import com.yookassa.result.Result
import ru.yoomoney.sdk.kassa.payments.*
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.*
import java.math.BigDecimal
import java.util.*

class YandexPaymentImpl(reactContext: ReactApplicationContext) {

    private val reactApplicationContext = reactContext

    fun getConstants(): Map<String, Any> {
        val constants = HashMap<String, Any>()
        constants["SFHOP_ID"] = SHOP_ID
        constants["SHOP_TOKEN"] = SHOP_TOKEN
        constants["SHOP_NAME"] = SHOP_NAME
        constants["SHOP_DESCRIPTION"] = SHOP_DESCRIPTION
        constants["SHOP_RETURN_URL"] = SHOP_RETURN_URL
        return constants
    }

    fun attach(map: ReadableMap, promise: Promise) {
        try {
            val shop = mapShop(map)
            val payment = mapPayment(map)

            val paymentParameters = PaymentParameters(
                    amount = Amount(BigDecimal(payment.amount), Currency.getInstance(payment.currency)),
                    title = shop.name,
                    subtitle = shop.description,
                    clientApplicationKey = shop.token,
                    shopId = shop.id,
                    savePaymentMethod = payment.savePaymentMethod,
                    paymentMethodTypes = payment.types,
                    gatewayId = null,
                    customReturnUrl = null,
                    userPhoneNumber = null,
                    authCenterClientId = payment.yooKassaClientId,
                    customerId = null,
            )

            // expose to JS
            val testParameters = TestParameters(true, false)
            val intent = Checkout.createTokenizeIntent(reactApplicationContext.currentActivity!!,
                    paymentParameters, testParameters
            )
            InlineActivityResult.startForResult(
                    reactApplicationContext.currentActivity!!,
                    intent,
                    object : ActivityResultListener {
                        override fun onSuccess(result: Result) {
                            val tokenizationResult: TokenizationResult = Checkout.createTokenizationResult(result.data!!)

                            val successResult = WritableNativeArray()
                            successResult.pushString(tokenizationResult.paymentToken)
                            successResult.pushString(tokenizationResult.paymentMethodType.toString())

                            promise.resolve(successResult)
                        }

                        override fun onFailed(result: Result) {
                            promise.reject(RESULT_CANCELED, RuntimeException("Token canceled"))
                        }
                    })

        } catch (error: Exception) {
            promise.reject(error)
        }
    }

    fun close() {
        // dummy method, just for compatibility with ios
    }

    fun show3ds(requestUrl: String, paymentType: String, clientApplicationKey: String,
                shopId: String, promise: Promise,
    ) {
        try {
            val intent = Checkout.createConfirmationIntent(
              reactApplicationContext.currentActivity!!,
              requestUrl,
              paymentType.toPaymentMethodType(),
              clientApplicationKey,
              shopId,
            )

            InlineActivityResult.startForResult(
                    reactApplicationContext.currentActivity as FragmentActivity,
                    intent,
                    object : ActivityResultListener {
                        override fun onSuccess(result: Result) {
                            promise.resolve(RESULT_OK)
                        }

                        override fun onFailed(result: Result) {
                            val map = WritableNativeMap()
                            if (result.data != null) {
                                // WebViewClient.ERROR_* или Checkout.ERROR_NOT_HTTPS_URL
                                result.data.getIntExtra(Checkout.EXTRA_ERROR_CODE, 0).let { map.putInt(EXTRA_ERROR_CODE, it) }
                                map.putString(EXTRA_ERROR_DESCRIPTION, result.data.getStringExtra(Checkout.EXTRA_ERROR_DESCRIPTION))
                                map.putString(EXTRA_ERROR_FAILING_URL, result.data.getStringExtra(Checkout.EXTRA_ERROR_FAILING_URL))
                            }

                            if (result.resultCode == Checkout.RESULT_ERROR) {
                                promise.reject(RESULT_ERROR, map)
                            } else {
                                promise.reject(RESULT_3DS_CLOSED, map)
                            }
                        }
                    })
        } catch (err: Exception) {
            promise.reject(err)
        }
    }

    companion object {
        const val NAME = "YandexPayment"

        private const val SHOP_ID = "SHOP_ID"
        private const val SHOP_TOKEN = "SHOP_TOKEN"
        private const val SHOP_NAME = "SHOP_NAME"
        private const val SHOP_DESCRIPTION = "SHOP_DESCRIPTION"
        private const val SHOP_RETURN_URL = "SHOP_RETURN_URL"

        private const val PAYMENT_AMOUNT = "PAYMENT_AMOUNT"
        private const val PAYMENT_CURRENCY = "PAYMENT_CURRENCY"
        private const val PAYMENT_TYPES_ARRAY = "PAYMENT_TYPES_ARRAY"
        private const val PAYMENT_SAVE_TYPE = "PAYMENT_SAVE_TYPE"
        private const val PAYMENT_YOO_MONEY_CLIENT_ID = "PAYMENT_YOO_MONEY_CLIENT_ID"

        private const val EXTRA_ERROR_CODE = "EXTRA_ERROR_CODE"
        private const val EXTRA_ERROR_DESCRIPTION = "EXTRA_ERROR_DESCRIPTION"
        private const val EXTRA_ERROR_FAILING_URL = "EXTRA_ERROR_FAILING_URL"

        private const val RESULT_3DS_CLOSED = "RESULT_3DS_CLOSED"
        private const val RESULT_ERROR = "RESULT_ERROR"
        private const val RESULT_CANCELED = "RESULT_CANCELED"
        private const val RESULT_OK = "RESULT_OK"
    }

    private fun mapShop(map: ReadableMap): Shop {
        return Shop(
                map.getString(SHOP_ID)!!,
                map.getString(SHOP_TOKEN)!!,
                map.getString(SHOP_NAME)!!,
                map.getString(SHOP_DESCRIPTION)!!,
                map.getString(SHOP_RETURN_URL)!!
        )
    }

    private fun mapPayment(map: ReadableMap): Payment {
        return Payment(
                amount = map.getDouble(PAYMENT_AMOUNT),
                currency = map.getString(PAYMENT_CURRENCY)!!,
                types = map.getArray(PAYMENT_TYPES_ARRAY)!!.toSetPayment(),
                savePaymentMethod = map.getString(PAYMENT_SAVE_TYPE)!!.toSavePaymentMethod(),
                yooKassaClientId = map.getString(PAYMENT_YOO_MONEY_CLIENT_ID)!!
        )
    }

    private fun ReadableArray.toSetPayment(): Set<PaymentMethodType> {
        val set = mutableSetOf<PaymentMethodType>()
        (0 until this.size()).forEach { index ->
            when (this.getString(index)) {
                PaymentMethodType.BANK_CARD.name -> set.add(PaymentMethodType.BANK_CARD)
                PaymentMethodType.YOO_MONEY.name -> set.add(PaymentMethodType.YOO_MONEY)
                PaymentMethodType.SBP.name -> set.add(PaymentMethodType.SBP)
                PaymentMethodType.SBERBANK.name -> set.add(PaymentMethodType.SBERBANK)
                //PaymentMethodType.GOOGLE_PAY.name, "PAY" -> set.add(PaymentMethodType.GOOGLE_PAY)
            }
        }
        if (set.isEmpty()) {
            set.addAll(PaymentMethodType.entries.toTypedArray())
        }
        return set
    }

    private fun String.toSavePaymentMethod(): SavePaymentMethod {
      return when (this) {
        SavePaymentMethod.ON.name -> SavePaymentMethod.ON
        SavePaymentMethod.OFF.name -> SavePaymentMethod.OFF
        SavePaymentMethod.USER_SELECTS.name -> SavePaymentMethod.USER_SELECTS
        else -> SavePaymentMethod.OFF
      }
    }

  private fun String.toPaymentMethodType(): PaymentMethodType {
    return when (this) {
      PaymentMethodType.BANK_CARD.name -> PaymentMethodType.BANK_CARD
      PaymentMethodType.YOO_MONEY.name -> PaymentMethodType.YOO_MONEY
      PaymentMethodType.SBP.name -> PaymentMethodType.SBP
      PaymentMethodType.SBERBANK.name -> PaymentMethodType.SBERBANK
      else -> PaymentMethodType.BANK_CARD
    }
  }
}
