#import "RNSvgManager.h"
#import "RNSvg.h"
#import "RCTBridge.h"

@implementation RNSvgManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
  return [[RNSvg alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(src, NSString);
RCT_EXPORT_VIEW_PROPERTY(data, NSString);
RCT_EXPORT_VIEW_PROPERTY(originalWidth, float);
RCT_EXPORT_VIEW_PROPERTY(originalHeight, float);
RCT_EXPORT_VIEW_PROPERTY(forceUpdate, NSString);

@end
