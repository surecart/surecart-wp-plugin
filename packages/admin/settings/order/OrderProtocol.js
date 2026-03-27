import Error from '../../components/Error';
import useEntity from '../../hooks/useEntity';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import {
	ScFlex,
	ScInput,
	ScSelect,
	ScSwitch,
	ScTextarea,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'order_protocol'
	);

	/**
	 * Form is submitted.
	 */
	const onSubmit = async () => {
		setError(null);
		try {
			await save({
				successMessage: __('Settings Updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	return (
		<SettingsTemplate
			title={__('Orders & Invoices', 'surecart')}
			icon={<sc-icon name="shopping-bag"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Order Numbering', 'surecart')}
				description={__(
					'Configure your order numbering style.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScInput
					label={__('Order Number Prefix', 'surecart')}
					value={item?.number_prefix}
					onScInput={(e) =>
						editItem({ number_prefix: e.target.value || null })
					}
					help={__(
						'If you would like your order numbers to have a special prefix, you can enter it here. It must not contain underscores, spaces or dashes.',
						'surecart'
					)}
				/>
				<ScFlex>
					<ScSelect
						style={{ flex: 1 }}
						label={__('Order Numbers Counter', 'surecart')}
						value={item?.number_type}
						help={__(
							'Choose the style of order numbers.',
							'surecart'
						)}
						onScChange={(e) =>
							editItem({ number_type: e.target.value })
						}
						unselect={false}
						choices={[
							{
								value: 'sequential',
								label: __('Sequential', 'surecart'),
							},
							{
								value: 'token',
								label: __(
									'Random Numbers And Letters',
									'surecart'
								),
							},
						]}
					/>
					{item?.number_type == 'sequential' && (
						<ScInput
							style={{ flex: 1 }}
							label={__('Start Order Number At', 'surecart')}
							value={item?.next_sequential_number}
							onScInput={(e) =>
								editItem({
									next_sequential_number:
										e.target.value || null,
								})
							}
							help={__(
								'It must be greater than the largest existing order number.',
								'surecart'
							)}
						/>
					)}
				</ScFlex>
			</SettingsBox>

			<SettingsBox
				title={__('Payment', 'surecart')}
				description={__('Configure payment settings.', 'surecart')}
				loading={!hasLoadedItem}
			>
				<ScSwitch
					checked={item?.require_reusable_payment_methods}
					onScChange={(e) =>
						editItem({
							require_reusable_payment_methods: e.target.checked,
						})
					}
				>
					{__('Reusable Payment Methods Only', 'surecart')}
					<span slot="description">
						{__(
							'Require all checkouts to only display reusable payment methods - even if a subscription is not present. This allows the payment method to be saved for future purchases, but can limit the payment methods available to customers.',
							'surecart'
						)}
					</span>
				</ScSwitch>
			</SettingsBox>

			<SettingsBox
				title={__('Invoices & Receipts', 'surecart')}
				description={__(
					'Add additional information to receipts and invoices.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<ScTextarea
					label={__('Memo', 'surecart')}
					value={item?.memo}
					onScInput={(e) => editItem({ memo: e.target.value })}
					help={__(
						'This appears in the memo area of your invoices and receipts.',
						'surecart'
					)}
				></ScTextarea>
				<ScTextarea
					label={__('Footer', 'surecart')}
					value={item?.footer}
					onScInput={(e) => editItem({ footer: e.target.value })}
					help={__(
						'The default memo that is shown on all order statements (i.e. invoices and receipts).',
						'surecart'
					)}
				></ScTextarea>
			</SettingsBox>

			<SettingsBox
				title={__('Upsells', 'surecart')}
				description={__('Upsell behavior settings.', 'surecart')}
				loading={!hasLoadedItem}
			>
				<ScInput
					label={__('Time Limit', 'surecart')}
					value={item?.upsells_expire_after_minutes}
					onScInput={(e) =>
						editItem({
							upsells_expire_after_minutes: e.target.value,
						})
					}
					help={__(
						'The number of minutes that the upsell offer will be available for after the initial purchase.',
						'surecart'
					)}
					type="number"
					step="1"
					min="0"
					max="1440"
				>
					<span slot="suffix">{__('Minutes', 'surecart')}</span>
				</ScInput>
			</SettingsBox>
		</SettingsTemplate>
	);
};
