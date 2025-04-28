import { useState } from 'react';
import Confirm from '../../components/confirm';
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function DuplicateModel(props) {
	const [confirm, setConfirm] = useState(null);
	const {
		children,
		type = 'product',
		onConfirm,
		id,
		onSuccess,
		message = 'Duplicate',
	} = props;

	const onClick = () => setConfirm(true);

	const onConfirmDuplicate = async () => {
		// save current product first.
		if (onConfirm) {
			await onConfirm();
		}

		const { baseURL } = select(coreStore).getEntityConfig('surecart', type);

		try {
			const duplicate = await apiFetch({
				path: `${baseURL}/${id}/duplicate`,
				method: 'POST',
			});
			if (onSuccess) {
				onSuccess(duplicate);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{children({ ...props, onClick })}
			{confirm && (
				<Confirm
					open={confirm}
					confirmButtonText={__('Duplicate', 'surecart')}
					cancelButtonText={__('Cancel', 'surecart')}
					onConfirm={onConfirmDuplicate}
					onRequestClose={() => setConfirm(false)}
				>
					{message ||
						__('Are you sure you wish to duplicate?', 'surecart')}
				</Confirm>
			)}
		</>
	);
}
