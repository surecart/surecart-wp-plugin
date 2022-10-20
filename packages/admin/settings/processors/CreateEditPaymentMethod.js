import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
	ScInput,
	ScSwitch,
	ScTextarea,
	ScToggle,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ open, onRequestClose, paymentMethod }) => {
	const [data, setData] = useState(paymentMethod);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const { saveEntityRecord } = useDispatch(coreStore);

	const updateData = (update) => {
		setData({
			...(data || {}),
			...update,
		});
	};

	const { name, description, instructions, archived } = data || {};

	const onSubmit = async () => {
		try {
			setBusy(true);
			setError(null);
			await saveEntityRecord(
				'surecart',
				'manual_payment_method',
				{
					...data,
					...(paymentMethod?.id ? { id: paymentMethod?.id } : {}),
				},
				{
					throwOnError: true,
				}
			);
			setData(paymentMethod);
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(
				e?.message ||
					__('Something went wrong. Please try again.', 'surecart')
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScDialog
			label={
				paymentMethod?.id
					? __('Edit Manual Payment Method', 'surecart')
					: __('Create Manual Payment Method', 'surecart')
			}
			open={open}
			style={{ '--dialog-body-overflow': 'visible' }}
			onScRequestClose={onRequestClose}
		>
			<ScForm
				onScSubmit={(e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
					onSubmit();
				}}
				onScSubmitForm={(e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
				}}
			>
				{!!error && <ScAlert type="danger">{error}</ScAlert>}

				<ScInput
					label={__('Custom payment method name', 'surecart')}
					placeholder={__('I.E. Cash On Delivery', 'surecart')}
					value={name}
					onScInput={(e) => updateData({ name: e.target.value })}
					required
				/>
				<ScTextarea
					label={__('Description', 'surecart')}
					help={__(
						'The description of this payment method that will be shown in the checkout.',
						'surecart'
					)}
					placeholder={__(
						'I.E. Pay with cash upon delivery.',
						'surecart'
					)}
					value={description}
					onScInput={(e) =>
						updateData({ description: e.target.value })
					}
					required
				/>
				<ScTextarea
					label={__('Payment instructions', 'surecart')}
					help={__(
						'The instructions that you want your customers to follow to pay for an order. These instructions are shown on the confirmation page after a customer completes the checkout.',
						'surecart'
					)}
					placeholder={__('Instructions on how to pay.', 'surecart')}
					value={instructions}
					onScInput={(e) =>
						updateData({ instructions: e.target.value })
					}
					required
				/>

				<ScSwitch
					checked={!archived}
					onScChange={(e) => updateData({ archived: !archived })}
				>
					{__('Enabled', 'surecart')}
				</ScSwitch>

				<div>
					<ScButton type="primary" submit>
						{paymentMethod?.id
							? __('Update', 'surecart')
							: __('Create', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={onRequestClose}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
				{busy && <ScBlockUi spinner />}
			</ScForm>
		</ScDialog>
	);
};
