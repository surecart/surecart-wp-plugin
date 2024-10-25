import { __ } from '@wordpress/i18n';
import { ScAlert } from '@surecart/components-react';
import { createInterpolateElement } from '@wordpress/element';

export default ({
	error,
	setError,
	margin = '0',
	scrollOnOpen = true,
	children,
	...rest
}) => {
	if (!error) {
		return null;
	}

	if (typeof error === 'string') {
		error = { message: error };
	}

	const invalidJSONErrorMessage = createInterpolateElement(
		__(
			'If you are using debug logging, please ensure that WP_DEBUG_LOG, WP_DEBUG_DISPLAY, or other debug settings are disabled from the wp-config.php file. This may interfere with API responses. For more details, please check the <a>Debug Settings</a> or contact support.'
		),
		{
			a: (
				<a
					href="https://surecart.com/docs/is-not-a-valid-json-response/"
					target="_blank"
					rel="noopener noreferrer"
				/>
			),
		}
	);

	return (
		<ScAlert
			open={true}
			type="danger"
			closable
			scrollOnOpen={scrollOnOpen}
			scrollMargin={margin}
			onScHide={() => !!setError && setError(null)}
			{...rest}
		>
			<span slot="title">
				{error?.message || __('Something went wrong.', 'surecart')}
			</span>
			{error?.additional_errors?.length && (
				<ul>
					{(error?.additional_errors || []).map((error, index) => (
						<li key={index}>{error?.message}</li>
					))}
				</ul>
			)}
			{error?.code === 'invalid_json' && invalidJSONErrorMessage}
			{children}
		</ScAlert>
	);
};
