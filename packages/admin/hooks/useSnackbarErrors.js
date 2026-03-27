/**
 * External dependencies.
 */
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { useState, useEffect } from '@wordpress/element';

export default function useSnackbarErrors() {
	const { createErrorNotice: createNotice } = useDispatch(noticesStore);
	const [errorMessage, setErrorMessage] = useState(null);

	const createErrorNotice = (error) => {
		console.error(error);

		// Stop if error is empty.
		if (!error) {
			return;
		}

		// If error is string, we will set the error message.
		if (typeof error === 'string') {
			setErrorMessage(error);
			return;
		}

		// If error.message is not empty, we will set the error message.
		if (error?.message) {
			setErrorMessage(error.message);
		}

		// If additional_errors is an array, we will loop through it and update the error message.
		if (error?.additional_errors?.length) {
			error.additional_errors.forEach((item) => {
				setErrorMessage((prevErrorMessage) => {
					return prevErrorMessage
						? `${prevErrorMessage} ${item?.message}`
						: item?.message;
				});
			});
		}
	};

	// If errorMessage is not empty, we will create an error notice.
	useEffect(() => {
		if (errorMessage) {
			createNotice(errorMessage, { type: 'snackbar' });
			setErrorMessage(null);
		}
	}, [errorMessage, createNotice]);

	return {
		createErrorNotice,
	};
}
