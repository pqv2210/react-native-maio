#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <Maio/Maio.h>

@interface RNMaio : RCTEventEmitter <RCTBridgeModule, MaioDelegate>

#define NAME @"Maio"
#define TYPE @"type"
#define VERSION @"version"
#define SKIPPED @"skipped"
#define INITIALIZED @"initialized"
#define CLICKED @"clicked"
#define STARTED @"started"
#define FINISHED @"finished"
#define CLOSED @"closed"
#define ERROR @"error"

@end
