import { ModuleEditProps } from '@divi/module-library';
import {
  FormatBreakpointStateAttr,
  InternalAttrs,
  type Element,
  type Module,
} from '@divi/types';
import { CarouselAttrs } from '../carousel/types';

export interface CarouselItemCssAttr extends Module.Css.AttributeValue {
  mainElement?: string;
}

export type CarouselItemCssGroupAttr = FormatBreakpointStateAttr<CarouselItemCssAttr>;

export interface CarouselItemAttrs extends InternalAttrs {
  css?: CarouselItemCssGroupAttr;
  module?: {
    meta?: Element.Meta.Attributes;
    advanced?: {
      link?: Element.Advanced.Link.Attributes;
      htmlAttributes?: Element.Advanced.IdClasses.Attributes;
      text?: Element.Advanced.Text.Attributes;
    };
    decoration?: Element.Decoration.PickedAttributes<
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
  image?: {
    innerContent?: FormatBreakpointStateAttr<{
      src?: string;
      id?: number;
      alt?: string;
      titleText?: string;
    }>;
  };
  title?: Element.Types.Title.Attributes;

}

export type CarouselItemEditProps = ModuleEditProps<CarouselItemAttrs, CarouselAttrs>;
