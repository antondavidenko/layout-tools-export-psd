/* eslint-disable newline-per-chained-call */
import { exportL10nFromPsd } from './export-l10n-from-psd.command';
import { exportTextStyleFromPsd } from './export-text-style-from-psd.command';

class ExportTextStyleAndL10nFromPsd {

  async run() {
    await exportL10nFromPsd.run();
    await exportTextStyleFromPsd.run();
    return new Promise((resolve) => { resolve(true); });
  }

}

export const exportTextStyleAndL10nFromPsd = new ExportTextStyleAndL10nFromPsd();
