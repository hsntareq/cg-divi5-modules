import { ModuleClassnamesParams, textOptionsClassnames } from '@divi/module';
import { TextMarqueeAttrs } from './types';

export const moduleClassnames = ({
  classnamesInstance,
  attrs,
}: ModuleClassnamesParams<TextMarqueeAttrs>): void => {
  classnamesInstance.add(textOptionsClassnames(attrs?.module?.advanced?.text ?? {}));
};
