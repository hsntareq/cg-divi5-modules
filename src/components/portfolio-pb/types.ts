// Divi dependencies.
import { ModuleEditProps } from '@divi/module-library';
import {
  FormatBreakpointStateAttr,
  InternalAttrs,
  type Element,
  type Module,
} from '@divi/types';

export interface PortfolioPBCssAttr extends Module.Css.AttributeValue {
  container?: string;
  tabs?: string;
  tab?: string;
  radios?: string;
  grid?: string;
  card?: string;
}

export type PortfolioPBCssGroupAttr = FormatBreakpointStateAttr<PortfolioPBCssAttr>;

export interface PortfolioPBAttrs extends InternalAttrs {
  // CSS options
  css?: PortfolioPBCssGroupAttr;

  // Module
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

  // Custom Settings
  postType?: {
    innerContent?: {
      desktop?: {
        value: string;
      };
    };
  };

  postsNumber?: {
    innerContent?: {
      desktop?: {
        value: string;
      };
    };
  };

  gridColumns?: {
    innerContent?: {
      desktop?: {
        value: string;
      };
    };
  };

  hideEmptySubcats?: {
    innerContent?: {
      desktop?: {
        value: string;
      };
    };
  };

  directSubcatLabel?: {
    innerContent?: {
      desktop?: {
        value: string;
      };
    };
  };

  showLoadMore?: {
    innerContent?: {
      desktop?: {
        value: string;
      };
    };
  };

  loadMoreText?: {
    innerContent?: {
      desktop?: {
        value: string;
      };
    };
  };

  activeColor?: {
    innerContent?: {
      desktop?: {
        value: string;
      };
    };
  };

  titleText?: Element.Types.Title.Attributes;
  tabText?: Element.Types.Title.Attributes;
  radioPillText?: Element.Types.Title.Attributes;
  loadMoreBtn?: Element.Types.Title.Attributes;
  item?: any;
}

export type PortfolioPBEditProps = ModuleEditProps<PortfolioPBAttrs>;
