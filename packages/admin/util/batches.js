import apiFetch from '@wordpress/api-fetch';

// The platform Batch API rejects requests with more operations than this,
// and also rejects a new batch while a previous one still has unprocessed
// operations (both HTTP 422).
export const MAX_BATCH_OPERATIONS = 50;

const POLL_INTERVAL_MS = 1000;

// Stop waiting after ~2 minutes so a platform hiccup can't hang the UI.
const MAX_POLLS = 120;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Poll a batch until the platform finishes processing it.
 *
 * @param {string} batchId Batch UUID.
 */
async function waitUntilFinished(batchId) {
	for (let i = 0; i < MAX_POLLS; i++) {
		await sleep(POLL_INTERVAL_MS);
		const batch = await apiFetch({
			path: `/surecart/v1/batches/${batchId}`,
		});
		if (!['pending', 'in_progress'].includes(batch?.status)) {
			return;
		}
	}
}

/**
 * Submit operations to the Batch API, chunked to the platform's per-request
 * limit, and resolve only once every batch has finished processing.
 *
 * Waiting on the final batch too means callers can refetch immediately and
 * see the result — no "refresh in a moment" needed.
 *
 * @param {Array<{http_method: string, path: string, body?: Object}>} operations Batch operations.
 * @return {Promise<Array>} The created batch objects.
 */
export async function submitBatchOperations(operations) {
	const batches = [];
	for (let i = 0; i < operations.length; i += MAX_BATCH_OPERATIONS) {
		const batch = await apiFetch({
			path: '/surecart/v1/batches',
			method: 'POST',
			data: {
				batch_operations: operations.slice(i, i + MAX_BATCH_OPERATIONS),
			},
		});
		batches.push(batch);
		await waitUntilFinished(batch.id);
	}
	return batches;
}
