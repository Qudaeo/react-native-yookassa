Yookassa Checkout on React Native
=====

Android library: [7.0.3](https://git.yoomoney.ru/projects/SDK/repos/yookassa-android-sdk/browse)

iOS library: [7.3.0](https://git.yoomoney.ru/projects/SDK/repos/yookassa-payments-swift/browse)

Install
=======

yarn
```bash
yarn add react-native-yookassa
```

npm
```bash
npm install react-native-yookassa --save
```

Usage
=====

```ts
import YandexPayment, { Shop, Payment, PaymentToken } from 'react-native-yookassa';

const shop: Shop = {
    id: 'SHOP_ID',
    token: 'test_SHOP_TOKEN',
    name: 'Shop name',
    description: 'Shop description',
}
const payment: Payment = {
    amount: 399.99,
    currency: 'RUB', // 'RUB' | 'USD' | 'EUR'
    types: ['BANK_CARD'], // 'YANDEX_MONEY' | 'BANK_CARD' | 'SBERBANK' | 'PAY'. PAY - means Google Pay or Apple Pay
    yooKassaClientId: 'SHOP_ID',
    savePaymentMethod: 'OFF', // 'ON' | 'OFF' | 'USER_SELECTS'
}

try {
  const paymentToken: PaymentToken = await YandexPayment.show(shop, payment)
  console.warn(paymentToken.token) // payment token
  console.warn(paymentToken.type) // payment method type

// send token to your backend and get requestUrl for payment confirmation
// const requestUrl = <FETCH_FROM_BACKEND>

  await YandexPayment.show3ds(
    requestUrl,
    paymentToken.type,
    clientApplicationKey,
    shopId,
  )

  YandexPayment.close()
} catch (e) {
  console.error('Payment error')
}
```

Android
-------

minSdkVersion = 24

1. Add file `android/app/src/main/res/xml/ym_network_security_config.xml`
```xml
<domain-config cleartextTrafficPermitted="true">
  <domain includeSubdomains="true">certs.yoomoney.ru</domain>
</domain-config>
```

2. Add line in `android/app/src/main/AndroidManifest.xml`
```diff
    <application
       ...
+      android:networkSecurityConfig="@xml/ym_network_security_config"
       ...
    />
```

3. Add file `android/app/src/debug/res/xml/network_security_config.xml`
```xml
<network-security-config>
  <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```

4. Add lines in `android/app/src/debug/AndroidManifest.xml`
```diff
    <application
       ...
+      android:networkSecurityConfig="@xml/network_security_config"
+      tools:replace="android:networkSecurityConfig"
       ...
    />
```

5. For SBP payments add your unique app schema in `android/app/src/main/res/values/string.xml` [Details see on git.yoomoney.ru](https://git.yoomoney.ru/projects/SDK/repos/yookassa-android-sdk/browse)
```diff
<resources>
    ...
+    <string name="ym_app_scheme" translatable="false">exampleapp</string>
    ...
</resources>
```

6. Add lines in `android/build.gradle`
allprojects {
    repositories {
        maven {url 'https://developer.huawei.com/repo/'}
    }
}

iOS
---

Min CocoaPods version: 1.13.0

Min iOS version: 14.0

1. Add dependency in `ios/Podfile`
```ruby
source 'https://github.com/CocoaPods/Specs.git'
source 'https://git.yoomoney.ru/scm/sdk/cocoa-pod-specs.git'

...

platform :ios, '14.0'
use_frameworks!

...

target 'MyApp' do
  pod 'YooKassaPayments',
   :build_type => :dynamic_framework,
   :git => 'https://git.yoomoney.ru/scm/sdk/yookassa-payments-swift.git',
   :tag => '7.3.0'

# ... other dependencies

end
```

2. Install pods in `ios`
```bash
pod install
```
