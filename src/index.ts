#!/usr/bin/env node
import { prompts } from 'prompts';
import { exportElementsFromPsd } from './commands/export-elements-from-psd.command';
import { exportPositionsFromPsd } from './commands/export-positions-from-psd.command';
import { exportTextStyleAndL10nFromPsd } from './commands/export-text-style-and-l10n-from-psd.command';
import { buildLayoutTypings } from './commands/build-layout-typings.command';
import { filePaths } from './file-paths.model';

const config = {
  type: 'multiselect',
  name: 'value',
  message: 'Select layout tools commands',
  choices: [
    { title: 'export-elements-from-psd', value: exportElementsFromPsd },
    { title: 'export-positions-from-psd', value: exportPositionsFromPsd },
    { title: 'export-text-style-and-l10n-from-psd', value: exportTextStyleAndL10nFromPsd },
    { title: 'build-layout-typings', value: buildLayoutTypings },
  ],
};

(async () => {
  await filePaths.init(process.cwd(), __dirname, process.argv[2]);
  const response = await prompts.multiselect(config as any);
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const i in response) {
    await response[i].run();
  }
})();
