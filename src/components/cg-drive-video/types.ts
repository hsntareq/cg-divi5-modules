import { ModuleEditProps } from '@divi/module-library';
import {
  FormatBreakpointStateAttr,
  InternalAttrs,
  type Element,
  type Module,
} from '@divi/types';

export interface CGDriveVideoCssAttr extends Module.Css.AttributeValue {
  mainElement?: string;
}

export type CGDriveVideoCssGroupAttr = FormatBreakpointStateAttr<CGDriveVideoCssAttr>;

export interface CGDriveVideoAttrs extends InternalAttrs {
  css?: CGDriveVideoCssGroupAttr;
  module?: {
    meta?: Element.Meta.Attributes;
    advanced?: {
      link?: Element.Advanced.Link.Attributes;
      htmlAttributes?: Element.Advanced.IdClasses.Attributes;
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
  videoSourceType?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  videoUrl?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  youtubeUrl?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  youtubeControls?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  seamlessMode?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  renderMode?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  videoCode?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  playOffscreen?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  dimensionType?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  aspectRatio?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  customAspectRatio?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  customWidth?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
  customHeight?: {
    innerContent?: FormatBreakpointStateAttr<string>;
  };
}

export type CGDriveVideoEditProps = ModuleEditProps<CGDriveVideoAttrs>;
