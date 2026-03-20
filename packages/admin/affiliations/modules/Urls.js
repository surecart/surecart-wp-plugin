/** @jsx jsx */
/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import { ScButton, ScIcon } from '@surecart/components-react';
import { useCopyToClipboard } from '@wordpress/compose';
import Definition from '../../ui/Definition';

export default ({ referralUrl, websiteUrl, loading }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);

	const referralUrlRef = useCopyToClipboard(referralUrl, () =>
		createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
			type: 'snackbar',
		})
	);

	const websiteUrlRef = useCopyToClipboard(websiteUrl, () =>
		createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
			type: 'snackbar',
		})
	);

	return (
		<>
			<Box title={__('Referral Url', 'surecart')} loading={loading}>
				<Definition
					title={referralUrl}
					css={css`
						word-break: break-all;
					`}
				>
					<ScButton ref={referralUrlRef} slot="suffix" size="small">
						<ScIcon name="clipboard" slot="prefix" />
						{__('Copy', 'surecart')}
					</ScButton>
				</Definition>
			</Box>
			<Box title={__('Website Url', 'surecart')} loading={loading}>
				<Definition
					title={websiteUrl}
					css={css`
						word-break: break-all;
					`}
				>
					<ScButton ref={websiteUrlRef} slot="suffix" size="small">
						<ScIcon name="clipboard" slot="prefix" />
						{__('Copy', 'surecart')}
					</ScButton>
				</Definition>
			</Box>
		</>
	);
};
