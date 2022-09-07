#import <Foundation/Foundation.h>
#import <Maio.h>
#import "RNMaio.h"

@implementation RNMaio {
  bool hasListeners;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_MODULE();

- (instancetype) init
{
  self = [super init];
  NSString *maioADSMediaEID = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"MaioMediaEID"];
#ifdef DEBUG
  [Maio setAdTestMode:YES];
#else
  [Maio setAdTestMode:NO];
#endif
  [Maio startWithMediaId:maioADSMediaEID delegate:self];
  return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[NAME];
}

- (void)startObserving {
  hasListeners = YES;
  [self maioDidInitialize];
}

- (void)stopObserving {
  hasListeners = NO;
}

- (void)maioDidInitialize {
  if (hasListeners) {
    NSDictionary* event = @{TYPE: INITIALIZED, VERSION: [Maio sdkVersion]};
    [self sendEventWithName:NAME body:event];
  }
}

- (void)maioWillStartAd:(NSString *)zoneId {
  [self onSentEvent:STARTED];
}

- (void)maioDidFinishAd:(NSString *)zoneId playtime:(NSInteger)playtime skipped:(BOOL)skipped rewardParam:(NSString *)rewardParam {
  if (hasListeners) {
    NSDictionary* event = @{TYPE: FINISHED, SKIPPED: @(skipped)};
    [self sendEventWithName:NAME body:event];
  }
}

- (void)maioDidClickAd:(NSString *)zoneId {
  [self onSentEvent:CLICKED];
}

- (void)maioDidCloseAd:(NSString *)zoneId {
  [self onSentEvent:CLOSED];
}

- (void)maioDidFail:(NSString *)zoneId reason:(MaioFailReason)reason {
  if (hasListeners) {
    NSDictionary* event = @{TYPE: ERROR, ERROR: [self getError:reason]};
    [self sendEventWithName:NAME body:event];
  }
}

- (NSString *)getError:(MaioFailReason)reason {
  switch (reason) {
    case MaioFailReasonNetworkConnection:
      return @"Network connection";
    case MaioFailReasonNetworkServer:
      return @"Network server error";
    case MaioFailReasonNetworkClient:
      return @"Network client error";
    case MaioFailReasonSdk:
      return @"SDK error";
    case MaioFailReasonDownloadCancelled:
      return @"Download cancelled";
    case MaioFailReasonAdStockOut:
      return @"Ad stock out";
    case MaioFailReasonVideoPlayback:
      return @"Video playback";
    case MaioFailReasonIncorrectMediaId:
      return @"Incorrect MediaId";
    case MaioFailReasonIncorrectZoneId:
      return @"Incorrect ZoneId";
    case MaioFailReasonNotFoundViewContext:
      return @"View Context not found";
    default:
      return @"Unknown";
  }
}

- (void)onSentEvent:(NSString* _Nonnull)eventType {
  if (hasListeners) {
    NSDictionary* event = @{TYPE: eventType};
    [self sendEventWithName:NAME body:event];
  }
}

RCT_EXPORT_METHOD(isAdvertisingReady: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  resolve(@([Maio canShow]));
}

RCT_EXPORT_METHOD(onShowAdvertising) {
  UIViewController *rootViewController = (UIViewController *)[[[[UIApplication sharedApplication]delegate] window] rootViewController];
  [Maio showWithViewController:rootViewController];
}

RCT_EXPORT_METHOD(onCheckAndShowAdvertising) {
  if ([Maio canShow]) {
      [self onShowAdvertising];
  }
}

@end
