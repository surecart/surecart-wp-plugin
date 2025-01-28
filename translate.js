var shell = require('shelljs');

// app directory
shell.exec(
	'./vendor/bin/wp i18n make-pot ./app languages/surecart.pot --ignore-domain --skip-audit'
);
// views directory
shell.exec(
	'./vendor/bin/wp i18n make-pot ./views languages/surecart.pot --ignore-domain --merge --skip-audit'
);
// templates directory
shell.exec(
	'./vendor/bin/wp i18n make-pot ./templates languages/surecart.pot --ignore-domain --merge --skip-audit'
);
// admin directory
shell.exec(
	'./vendor/bin/wp i18n make-pot ./packages/admin languages/surecart.pot --ignore-domain --merge --skip-audit'
);
// blocks directory
shell.exec(
	'./vendor/bin/wp i18n make-pot ./packages/blocks --exclude=node_modules,dist languages/surecart.pot --ignore-domain --merge --skip-audit'
);
// blocks-next directory
shell.exec(
	'./vendor/bin/wp i18n make-pot ./packages/blocks-next --exclude=node_modules,dist languages/surecart.pot --ignore-domain --merge --skip-audit'
);
// components directory
shell.exec(
	'./vendor/bin/wp i18n make-pot ./packages/components/dist/components --include=*.js languages/surecart.pot --ignore-domain --merge --skip-audit'
);
