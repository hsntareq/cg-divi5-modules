import { ModuleEditProps } from '@divi/module-library';
import {
  FormatBreakpointStateAttr,
  InternalAttrs,
  type Element,
  type Module,
} from '@divi/types';

export interface TextMarqueeCssAttr extends Module.Css.AttributeValue {
  mainElement?: string;
}

export type TextMarqueeCssGroupAttr = FormatBreakpointStateAttr<TextMarqueeCssAttr>;

export interface TextMarqueeAttrs extends InternalAttrs {
  css?: TextMarqueeCssGroupAttr;
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
  text?: Element.Types.Title.Attributes;
  speed?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  direction?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  pauseOnHover?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
}

export type TextMarqueeEditProps = ModuleEditProps<TextMarqueeAttrs>;
