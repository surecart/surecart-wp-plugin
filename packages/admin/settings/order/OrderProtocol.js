/** @jsx jsx */
import Error from '../../components/Error';
import useEntity from '../../hooks/useEntity';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import { css, jsx } from '@emotion/core';
import { ScInput, ScSelect, ScTextarea } from '@surecart/components-react';
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
			title={__('Orders & Receipts', 'surecart')}
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
				<ScSelect
					label={__('Order Numbers Counter', 'surecart')}
					value={item?.number_type}
					help={__('Choose the style of order numbers.', 'surecart')}
					onScChange={(e) =>
						editItem({ number_type: e.target.value })
					}
					choices={[
						{
							value: 'sequential',
							label: __('Sequential', 'surecart'),
						},
						{
							value: 'token',
							label: __('Random Numbers And Letters', 'surecart'),
						},
					]}
				/>
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
		</SettingsTemplate>
	);
};
