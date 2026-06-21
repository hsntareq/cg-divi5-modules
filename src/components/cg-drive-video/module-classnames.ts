import { ModuleClassnamesParams } from '@divi/module';
import { CGDriveVideoAttrs } from './types';

export const moduleClassnames = ({
  classnamesInstance,
}: ModuleClassnamesParams<CGDriveVideoAttrs>): void => {
  classnamesInstance.add('cg_drive_video');
};
