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
			'Please ensure that your site is not in debug mode as this may interfere with API responses. <a>More Information</a>'
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
