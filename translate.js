var shell = require('shelljs');

// Peast JS parsing can exceed PHP's default 128M; WP-CLI reads this in bin/wp.
var potEnv = Object.assign({}, process.env, {
	WP_CLI_PHP_ARGS: '-d memory_limit=512M',
});

function makePot(args) {
	shell.exec('./vendor/bin/wp i18n make-pot ' + args, { env: potEnv });
}

// app directory
makePot('./app languages/surecart.pot --ignore-domain --skip-audit');
// views directory
makePot('./views languages/surecart.pot --ignore-domain --merge --skip-audit');
// templates directory
makePot('./templates languages/surecart.pot --ignore-domain --merge --skip-audit');
// admin directory
makePot('./packages/admin languages/surecart.pot --ignore-domain --merge --skip-audit');
// blocks directory
makePot(
	'./packages/blocks --exclude=node_modules,dist languages/surecart.pot --ignore-domain --merge --skip-audit'
);
// blocks-next directory
makePot(
	'./packages/blocks-next --exclude=node_modules,dist,build languages/surecart.pot --ignore-domain --merge --skip-audit'
);
// components directory
makePot(
	'./packages/components/dist/components --include=*.js languages/surecart.pot --ignore-domain --merge --skip-audit'
);
