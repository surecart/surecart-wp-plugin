/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ScInput, ScSelect } from '@surecart/components-react';
import SettingsTemplate from '../SettingsTemplate';
import SettingsBox from '../SettingsBox';
import useEntity from '../../hooks/useEntity';
import Error from '../../components/Error';
import useSave from '../UseSave';
import { useEntityProp } from '@wordpress/core-data';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'account'
	);
	const [scReCaptchaSiteData, setScReCaptchaSiteData] = useEntityProp(
		'root',
		'site',
		'sc_recaptcha_site_key'
	);
	const [scReCaptchaSecretData, setScReCaptchaSecretData] = useEntityProp(
		'root',
		'site',
		'sc_recaptcha_secret_key'
	);
	const [scReCaptchaMinScoreData, setScReCaptchaMinScoreData] = useEntityProp(
		'root',
		'site',
		'sc_recaptcha_min_score'
	);
	const [scReCaptchaMaxScoreData, setScReCaptchaMaxScoreData] = useEntityProp(
		'root',
		'site',
		'sc_recaptcha_max_score'
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

	/**
	 * Get the symbol for the currency.
	 */
	const getCurrencySymbol = (code) => {
		const [currency] = new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: code,
		}).formatToParts();
		return currency?.value;
	};

	return (
		<SettingsTemplate
			title={__('Store Settings', 'surecart')}
			icon={<sc-icon name="sliders"></sc-icon>}
			onSubmit={onSubmit}
			loading={!hasLoadedItem}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Store Details', 'surecart')}
				description={__(
					'The name of your store will be visible to customers, so you should use a name that is recognizable and identifies your store to your customers.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScInput
						value={item?.name}
						label={__('Store Name', 'surecart')}
						placeholder={__('Store Name', 'surecart')}
						onScInput={(e) => editItem({ name: e.target.value })}
						help={__(
							'This is displayed in the UI and in notifications.',
							'surecart'
						)}
						required
					></ScInput>

					<ScInput
						value={item?.url}
						label={__('Store URL', 'surecart')}
						placeholder={__('https://example.com', 'surecart')}
						onScInput={(e) => editItem({ url: e.target.value })}
						help={__(
							'This should be your live storefront URL.',
							'surecart'
						)}
						type="url"
					></ScInput>

					<ScSelect
						search
						value={item?.currency}
						onScChange={(e) =>
							editItem({ currency: e.target.value })
						}
						choices={Object.keys(
							scData?.supported_currencies || {}
						).map((value) => {
							const label = scData?.supported_currencies[value];
							return {
								label: `${label} (${getCurrencySymbol(value)})`,
								value,
							};
						})}
						label={__('Default Currency', 'surecart')}
						help={__(
							'The default currency for new products.',
							'surecart'
						)}
						required
					></ScSelect>

					<ScSelect
						search
						value={item?.time_zone}
						onScChange={(e) =>
							editItem({ time_zone: e.target.value })
						}
						choices={Object.keys(scData?.time_zones || {}).map(
							(value) => {
								const label = scData?.time_zones[value];
								return {
									label,
									value,
								};
							}
						)}
						label={__('Time Zone', 'surecart')}
						help={__(
							'Change this if you want the store to be in a different time zone than your server.',
							'surecart'
						)}
						required
					></ScSelect>
				</div>
			</SettingsBox>

			<SettingsBox
				title={__('reCaptcha Settings', 'surecart')}
				description={__(
					'Change your plugin reCaptcha settings.',
					'surecart'
				)}
				loading={!hasLoadedItem}
			>
				<div
					css={css`
						gap: var(--sc-form-row-spacing);
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
					`}
				>
					<ScInput
						value={scReCaptchaSiteData}
						label={__('reCaptcha Site Key', 'surecart')}
						placeholder={__('reCaptcha Site Key', 'surecart')}
						onScChange={(e) => setScReCaptchaSiteData( e.target.value )} 
						type="password"
						help={__(
							'This is use reCaptcha.',
							'surecart'
						)}
					></ScInput>
					<ScInput
						value={scReCaptchaSecretData}
						label={__('reCaptcha Secret Key', 'surecart')}
						placeholder={__('reCaptcha Secret Key', 'surecart')}
						onScChange={(e) => setScReCaptchaSecretData( e.target.value )} 
						type="password"
						help={__(
							'This is use reCaptcha.',
							'surecart'
						)}
					></ScInput>
					<ScInput
						value={scReCaptchaMinScoreData}
						label={__('Threshold Min Score', 'surecart')}
						placeholder={__('0.1', 'surecart')}
						onScChange={(e) => setScReCaptchaMinScoreData( e.target.value )} 
						type="number"
						min="0"
						step="0.1"
						max="1"
						help={__(
							'This is use reCaptcha threshold min score.',
							'surecart'
						)}
					></ScInput>
					<ScInput
						value={scReCaptchaMaxScoreData}
						label={__('Threshold Max Score', 'surecart')}
						placeholder={__('1', 'surecart')}
						onScChange={(e) => setScReCaptchaMaxScoreData( e.target.value )} 
						type="number"
						min="0"
						max="1"
						step="0.1"
						help={__(
							'This is use reCaptcha threshold max score.',
							'surecart'
						)}
					></ScInput>
				</div>
			</SettingsBox>

		</SettingsTemplate>
	);
};
