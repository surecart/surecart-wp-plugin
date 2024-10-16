import { __, sprintf } from '@wordpress/i18n';
import { ScAlert } from '@surecart/components-react';

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

	if (error?.code === 'invalid_json') {
		error.message = __(
			'The response is not a valid JSON response.',
			'surecart'
		);
		const debugSettingsUrl =
			'https://wordpress.org/support/article/debugging-in-wordpress/';
		error.additional_errors = [
			{
				code: 'invalid_json',
				message: sprintf(
					/* translators: %s: URL to debug settings page */
					__(
						'If you are using debug logging, please ensure that WP_DEBUG_LOG, WP_DEBUG_DISPLAY, or other debug settings are disabled from the wp-config.php file. This may interfere with API responses. For more details, please check the %s or contact support.',
						'surecart'
					),
					`<a href="${debugSettingsUrl}" target="_blank" rel="noopener noreferrer">${__(
						'Debug Settings',
						'surecart'
					)}</a>`
				),
				isHTMl: true,
			},
		];
	}
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
					{(error?.additional_errors || []).map((error, index) =>
						error.isHTMl ? (
							<li
								key={index}
								dangerouslySetInnerHTML={{
									__html: error?.message,
								}}
							/>
						) : (
							<li key={index}>{error?.message}</li>
						)
					)}
				</ul>
			)}
			{children}
		</ScAlert>
	);
};
