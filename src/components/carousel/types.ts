import { ModuleEditProps } from '@divi/module-library';
import {
  FormatBreakpointStateAttr,
  InternalAttrs,
  type Element,
  type Module,
} from '@divi/types';

export interface CarouselCssAttr extends Module.Css.AttributeValue {
  mainElement?: string;
}

export type CarouselCssGroupAttr = FormatBreakpointStateAttr<CarouselCssAttr>;

export interface CarouselAttrs extends InternalAttrs {
  css?: CarouselCssGroupAttr;
  module?: {
    meta?: Element.Meta.Attributes;
    advanced?: {
      link?: Element.Advanced.Link.Attributes;
      htmlAttributes?: Element.Advanced.IdClasses.Attributes;
      text?: Element.Advanced.Text.Attributes;
    };
    decoration?: Element.Decoration.PickedAttributes<
      'animation' |
      'background' |
      'border' |
      'boxShadow' |
      'disabledOn' |
      'filters' |
      'overflow' |
      'position' |
      'scroll' |
      'sizing' |
      'spacing' |
      'sticky' |
      'transform' |
      'transition' |
      'zIndex'
    >;
  };
  autoplay?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  speed?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  transitionSpeed?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  loop?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  arrows?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  dots?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  slidesToShow?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  marquee?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  showTitle?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  showImage?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  galleryIds?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
}

export type CarouselEditProps = ModuleEditProps<CarouselAttrs>;
