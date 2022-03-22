import { __ } from '@wordpress/i18n';
import { ScButton } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';

import { store as uiStore } from '../../store/ui';

export default ({ style, children }) => {
	const isSaving = useSelect((select) => select(uiStore).isSaving());

	return (
		<ScButton
			type="primary"
			submit
			style={style}
			className={'sc-save-model'}
			disabled={isSaving}
			loading={isSaving}
		>
			{children}
		</ScButton>
	);
};
