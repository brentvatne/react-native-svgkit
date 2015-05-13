#import "RNSvg.h"
#import "UIView+React.h"
#import "SVGKit/Source/SVGKit.h"

@implementation RNSvg {
  SVGKImage *_image;
  SVGKFastImageView *_imageView;
  NSString *_src;
  NSData *_data;
  float _originalWidth;
  float _originalHeight;
}

- (id)init {
  if ((self = [super init])) { }
  return self;
}

- (void)setData:(NSString *)newData {
  _data = [newData dataUsingEncoding:NSUTF8StringEncoding];
}

- (void)setSrc:(NSString *)newSrc {
  _src = newSrc;
}

- (void)setOriginalWidth:(float)originalWidth
{
  _originalWidth = originalWidth;
}


- (void)setOriginalHeight:(float)originalHeight
{
  _originalHeight = originalHeight;
}

- (void)setForceUpdate:(float)throwaway {
  // only re-render once initialized
  if(_imageView) {
    [self renderImage];
  }
}

- (void)renderImage
{
  [_imageView removeFromSuperview];

  // Create the SVGKImage
  if (_data) {
      _image = [[SVGKImage alloc] initWithData:_data];
  } else if (_src) {
    _image = [SVGKImage imageNamed:_src];
  } else {
    return;
  }

  // Determine the appropriate size given the frame, maintaining aspect ratio
  CGSize newSize;
  CGSize frameSize = self.frame.size;

  float widthRatio = (float)frameSize.width / _originalWidth;
  float heightRatio = (float)frameSize.height / _originalHeight;

  if (widthRatio == heightRatio) {
    newSize = frameSize;
  } else if (widthRatio > heightRatio) {
    newSize = CGSizeMake(_originalWidth * heightRatio, frameSize.height);
  } else {
    newSize = CGSizeMake(frameSize.width, _originalHeight * widthRatio);
  }

  // Create the view and render it
  [_image setSize:newSize];
  _imageView = [[SVGKFastImageView alloc] initWithSVGKImage:_image];
  [self addSubview:_imageView];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  [self renderImage];
}

@end
