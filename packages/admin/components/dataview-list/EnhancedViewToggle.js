/** @jsx jsx */
import { jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { seen, unseen } from '@wordpress/icons';

export default ({ enabled, onToggle }) => (
	<Button
		icon={enabled ? unseen : seen}
		label={
			enabled
				? __('Exit enhanced view', 'surecart')
				: __('Enter enhanced view', 'surecart')
		}
		onClick={onToggle}
		size="small"
	/>
);
