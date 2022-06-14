import { __ } from '@wordpress/i18n';
import { ScDialog } from '@surecart/components-react';
import RegistrationForm from './RegistrationForm';

export default ({ region, registration, open, onRequestClose }) => {
	return (
		<ScDialog
			label={__('Collect Tax', 'surecart')}
			onScRequestClose={onRequestClose}
			open={open}
		>
			{open && (
				<RegistrationForm
					region={region}
					registration={registration}
					onSubmitted={onRequestClose}
					onDeleted={onRequestClose}
				/>
			)}
		</ScDialog>
	);
};
