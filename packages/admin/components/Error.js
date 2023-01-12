import { __ } from '@wordpress/i18n';
import { ScAlert } from '@surecart/components-react';

export default ({
	error,
	setError,
	margin = '0',
	scrollOnOpen = true,
	children,
}) => {
	if (!error || !Object.keys(error).length) {
		return null;
	}

	return (
		<ScAlert
			open={true}
			type="danger"
			closable
			scrollOnOpen={scrollOnOpen}
			scrollMargin={margin}
			onScHide={() => !!setError && setError(null)}
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
			{children}
		</ScAlert>
	);
};
