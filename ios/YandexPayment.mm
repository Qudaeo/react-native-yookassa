#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"
#import "React/RCTViewManager.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNYookassaSpec/RNYookassaSpec.h>

using namespace facebook::react;
#endif

@interface RCT_EXTERN_MODULE(YandexPayment, RCTViewManager)

RCT_EXTERN_METHOD(attach: (NSDictionary *) map
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(close)

RCT_EXTERN_METHOD(show3ds: (NSString *) requestUrl
                  paymentType:(NSString *) paymentType
                  clientApplicationKey:(NSString *) clientApplicationKey
                  shopId:(NSString *) shopId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

#ifdef RCT_NEW_ARCH_ENABLED
 - (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
 {
    return std::make_shared<facebook::react::NativeYookassaSpecJSI>(params);
 }
#endif

@end
