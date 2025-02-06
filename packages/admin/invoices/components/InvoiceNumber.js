/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ orderNumber }) => {
	return (
		<PanelRow>
			<div>{__('Invoice Number', 'surecart')}</div>
			<div>#{orderNumber}</div>
		</PanelRow>
	);
};
