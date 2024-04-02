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

export default ({ url, loading }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);

	const ref = useCopyToClipboard(url, () =>
		createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
			type: 'snackbar',
		})
	);

	return (
		<Box title={__('Referral Url', 'surecart')} loading={loading}>
			<Definition
				title={url}
				css={css`
					word-break: break-all;
				`}
			>
				<ScButton ref={ref} slot="suffix" size="small">
					<ScIcon name="clipboard" slot="prefix" />
					{__('Copy', 'surecart')}
				</ScButton>
			</Definition>
		</Box>
	);
};
