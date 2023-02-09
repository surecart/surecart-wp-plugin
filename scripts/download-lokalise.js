const shell = require('shelljs');
const path = require('path');

const file = path.join(__dirname, '..', 'languages', 'surecart-en.po');

shell.exec(
  'lokalise2 --config ./scripts/config.yml file download --format po --original-filenames=false --bundle-structure surecart-%LANG_ISO%.%FORMAT% --unzip-to ./languages'
);

shell.exec(
  'rm "' + file + '"'
);
