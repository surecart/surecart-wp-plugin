import { useState, useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

const useListMutation = ({ defaultErrorMessage } = {}) => {
	const [isMutating, setIsMutating] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);

	const run = useCallback(
		async (operation, { errorMessage } = {}) => {
			setIsMutating(true);
			try {
				return await operation();
			} catch (error) {
				createErrorNotice(
					error?.message ||
						errorMessage ||
						defaultErrorMessage ||
						__('Something went wrong.', 'surecart'),
					{ type: 'snackbar' }
				);
				// Re-throw so DataViews' confirm flow registers the failure.
				throw error;
			} finally {
				setIsMutating(false);
			}
		},
		[createErrorNotice, defaultErrorMessage]
	);

	return { isMutating, run };
};

export default useListMutation;
