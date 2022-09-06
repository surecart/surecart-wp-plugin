/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import {
	ScAddress,
	ScFormControl,
	ScInput,
	ScSelect,
} from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import { __ } from '@wordpress/i18n';
import ColorPopup from '../../../blocks/components/ColorPopup';
import Error from '../../components/Error';
import useSave from '../UseSave';
import Logo from './Logo';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'brand'
	);
	const [scThemeData, setScThemeData] = useEntityProp(
		'root',
		'site',
		'surecart_theme'
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
			title={__('Design & Branding', 'surecart')}
			icon={<sc-icon name="pen-tool"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Brand Settings', 'surecart')}
				description={__(
					'Customize how your brand appears globally across SureCart. Your logo and colors will be used on hosted pages and emails that are sent to your customers.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<div
					css={css`
						gap: 2em;
						display: grid;
						align-items: flex-start;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<Logo brand={item} editBrand={editItem} />

					<ScFormControl
						label={__('Brand Color', 'surecart')}
						help={__(
							'This color will be used for the main button color, links, and various UI elements.',
							'surecart'
						)}
					>
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<ColorPopup
								color={`#${item?.color}`}
								setColor={(color) => {
									editItem({
										color: color?.hex.replace('#', ''),
									});
								}}
							/>
							<ScInput
								css={css`
									flex: 1;
								`}
								value={item?.color}
								onScInput={(e) =>
									editItem({
										color: e.target.value.replace('#', ''),
									})
								}
							>
								<div slot="prefix" style={{ opacity: '0.5' }}>
									#
								</div>
							</ScInput>
						</div>
					</ScFormControl>
					<ScSelect
						label={__('Select Theme (Beta)', 'surecart')}
						placeholder={__('Select Theme', 'surecart')}
						value={scThemeData}
						onScChange={(e) => setScThemeData(e.target.value)}
						help={__(
							'Choose "Dark" if your theme already has a dark background.',
							'surecart'
						)}
						unselect={false}
						choices={[
							{
								label: __('Light', 'surecart'),
								value: 'light',
							},
							{
								label: __('Dark', 'surecart'),
								value: 'dark',
							},
						]}
					></ScSelect>
				</div>
			</SettingsBox>

			<SettingsBox
				title={__('Contact Information', 'surecart')}
				description={__(
					'This information helps customers recognize your business and contact you when necessary. It will be visible on invoices/receipts and any emails that need to be CAN-SPAM compliant (i.e. abandoned order emails).',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(3, minmax(0, 1fr));
					`}
				>
					<ScInput
						label={__('Email', 'surecart')}
						value={item?.email}
						placeholder={__('Enter an email', 'surecart')}
						onScInput={(e) => editItem({ email: e.target.value })}
						type="email"
					/>
					<ScInput
						label={__('Phone', 'surecart')}
						value={item?.phone}
						placeholder={__('Enter an phone number', 'surecart')}
						onScInput={(e) => editItem({ phone: e.target.value })}
						type="tel"
					/>
					<ScInput
						label={__('Website', 'surecart')}
						value={item?.website}
						placeholder={__('Enter a website URL', 'surecart')}
						onScInput={(e) => editItem({ website: e.target.value })}
						type="url"
					/>
				</div>

				<ScAddress
					label={__('Address', 'surecart')}
					required={false}
					showName={true}
					showLine2={true}
					address={item?.address}
					names={{}}
					onScInputAddress={(e) => editItem({ address: e.detail })}
				/>
			</SettingsBox>
		</SettingsTemplate>
	);
};
