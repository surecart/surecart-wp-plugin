/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { BlockInspector } from '@wordpress/block-editor';
import { drawerLeft, drawerRight } from '@wordpress/icons';
import { isRTL, __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import PluginSidebar from './PluginSidebar';
import { SETTINGS_SIDEBAR_IDENTIFIER } from '../constants';
import Notice from './Notice';

export default function ({ smallScreenTitle, height }) {
	return (
		<PluginSidebar
			identifier={SETTINGS_SIDEBAR_IDENTIFIER}
			title={__('Settings', 'surecart')}
			icon={isRTL() ? drawerRight : drawerLeft}
			isActiveByDefault={true}
			header={<strong>{__('Settings', 'surecart')}</strong>}
			closeLabel={__('Close settings', 'surecart')}
			smallScreenTitle={smallScreenTitle}
			css={css`
				overflow-y: auto;
				height: ${height}px;
			`}
		>
			<BlockInspector />
			<Notice />
		</PluginSidebar>
	);
}
