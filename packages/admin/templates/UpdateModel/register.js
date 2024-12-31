const plugins = {};
import { getQueryArg } from '@wordpress/url';

export function registerAddon(name, settings) {
	if (typeof settings !== 'object') {
		console.error('No settings object provided!');
		return null;
	}
	if (typeof name !== 'string') {
		console.error('Plugin name must be string.');
		return null;
	}
	if (!/^[a-z][a-z0-9-]*$/.test(name)) {
		console.error(
			'Plugin name must include only lowercase alphanumeric characters or dashes, and start with a letter. Example: "my-plugin".'
		);
		return null;
	}
	if (plugins[name]) {
		console.error(`Plugin "${name}" is already registered.`);
	}

	const { render, scope } = settings;

	if (typeof render !== 'function') {
		console.error(
			'The "render" property must be specified and must be a valid function.'
		);
		return null;
	}

	if (scope) {
		if (typeof scope !== 'string') {
			console.error('Plugin scope must be string.');
			return null;
		}

		if (!/^[a-z][a-z0-9-]*$/.test(scope)) {
			console.error(
				'Plugin scope must include only lowercase alphanumeric characters or dashes, and start with a letter. Example: "my-page".'
			);
			return null;
		}
	}

	plugins[name] = {
		name,
		title:
			settings.title ||
			name
				.replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
				.split(' ')
				.map(
					(word) =>
						word.charAt(0).toUpperCase() +
						word.slice(1).toLowerCase()
				)
				.join(' '),
		...settings,
	};

	return settings;
}

export function getAddons(scope) {
	return Object.values(plugins).filter((plugin) => plugin.scope === scope);
}

export function getCurrentPage() {
	return getQueryArg(window.location, 'page');
}

export function getCurrentPageId() {
	return getQueryArg(window.location, 'id');
}

window.surecart = window.surecart || {};
window.surecart.registerAddon = registerAddon;
window.surecart.getCurrentPage = getCurrentPage;
window.surecart.getCurrentPageId = getCurrentPageId;
