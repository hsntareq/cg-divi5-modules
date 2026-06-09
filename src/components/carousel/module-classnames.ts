import { ModuleClassnamesParams, textOptionsClassnames } from '@divi/module';
import { CarouselAttrs } from './types';

export const moduleClassnames = ({
  classnamesInstance,
  attrs,
}: ModuleClassnamesParams<CarouselAttrs>): void => {
  classnamesInstance.add(textOptionsClassnames(attrs?.module?.advanced?.text ?? {}));
};
