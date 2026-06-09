import { ModuleClassnamesParams, textOptionsClassnames } from '@divi/module';
import { CarouselItemAttrs } from './types';

export const moduleClassnames = ({
  classnamesInstance,
  attrs,
}: ModuleClassnamesParams<CarouselItemAttrs>): void => {
  classnamesInstance.add(textOptionsClassnames(attrs?.module?.advanced?.text ?? {}));
};
