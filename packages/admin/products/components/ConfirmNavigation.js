import Confirm from '../../components/confirm';
import { __ } from '@wordpress/i18n';

export default ({ open, loading, onConfirm, onRequestClose }) => {
	return (
		<Confirm
			open={open}
			loading={loading}
			onConfirm={onConfirm}
			confirmButtonText={__('Save and go to editor', 'surecart')}
			cancelButtonText={__('Cancel', 'surecart')}
			onRequestClose={() => {
				if (loading) {
					return;
				}
				onRequestClose();
			}}
		>
			{__('Save your changes before going to the editor?', 'surecart')}
		</Confirm>
	);
};
