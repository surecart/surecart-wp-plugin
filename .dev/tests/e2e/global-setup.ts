/**
 * External dependencies
 */
import { request } from '@playwright/test';
import type { FullConfig } from '@playwright/test';

/**
 * WordPress dependencies
 */
import { RequestUtils } from '@wordpress/e2e-test-utils-playwright';
import cleanup from './cleanup';

async function globalSetup(config: FullConfig) {
	const { storageState, baseURL } = config.projects[0].use;
	const storageStatePath =
		typeof storageState === 'string' ? storageState : undefined;

	const requestContext = await request.newContext({
		baseURL,
	});

	const requestUtils = await RequestUtils.setup({
		storageStatePath
	});

	// Authenticate and save the storageState to disk.
	await requestUtils.setupRest();

	// clean database and get ready.
	await cleanup(requestUtils);

	await requestContext.dispose();
}

export default globalSetup;
