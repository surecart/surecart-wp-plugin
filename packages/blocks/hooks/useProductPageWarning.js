import { Warning } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getQueryArg } from '@wordpress/url';

export default () => {
	const postId = getQueryArg(window.location.href, 'postId');

	if (
		!postId ||
		(!postId.includes('sc-products') &&
			!postId.includes('surecart/surecart'))
	) {
		return (
			<Warning>
				{__(
					'This block only works on SureCart Product pages.',
					'surecart'
				)}
			</Warning>
		);
	}
	return false;
};
