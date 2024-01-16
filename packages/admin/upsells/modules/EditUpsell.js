import { ScDrawer, ScForm } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Discount from './Discount';
import Template from './Template';

export default ({ open, onRequestClose }) => {
	return (
		<ScForm
			style={{
				'--sc-form-row-spacing': 'var(--sc-spacing-large)',
			}}
			onScSubmit={(e) => {
				e.stopImmediatePropagation();
			}}
			onScSubmitForm={(e) => e.stopImmediatePropagation()}
		>
			<ScDrawer
				label={__('Edit Offer', 'surecart')}
				style={{ '--sc-drawer-size': '600px' }}
				open={open}
				onScRequestClose={onRequestClose}
			>
				<Discount />
				<Template />
			</ScDrawer>
		</ScForm>
	);
};
