package com.yookassa

import com.facebook.react.bridge.*

class YookassaModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  val implementation = YandexPaymentImpl(reactContext)

  override fun getName(): String {
    return YandexPaymentImpl.NAME
  }

  override fun getConstants(): Map<String, Any> {
    return implementation.getConstants()
  }

  @ReactMethod
  fun attach(map: ReadableMap, promise: Promise) {
    return implementation.attach(map, promise)
  }

  @ReactMethod
  fun close() {
    return implementation.close()
  }

  @ReactMethod
  fun show3ds(requestUrl: String, paymentType: String, clientApplicationKey: String,
              shopId: String, promise: Promise,
  ) {
    return implementation.show3ds(requestUrl, paymentType, clientApplicationKey, shopId, promise)
  }
}
