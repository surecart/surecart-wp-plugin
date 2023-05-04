/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsTemplate from '../../SettingsTemplate';
import { getQueryArg, removeQueryArgs } from '@wordpress/url';
import { useState } from '@wordpress/element';
import SettingsBox from '../../SettingsBox';
import { ScInput } from '@surecart/components-react';
import useEntity from '../../../hooks/useEntity';
import Error from '../../../components/Error';
import Products from './Products';

export default () => {
	const [error, setError] = useState();
	const shippingProfileId = getQueryArg(window.location.href, 'profile');

	const {
		item: shippingProfile,
		hasLoadedItem: hasLoadedShippingProfile,
		itemError: shippingProfileError,
		editItem: editShippingProfile,
		saveItem: saveShippingProfile,
	} = useEntity('shipping-profile', shippingProfileId, {
		expand: ['products'],
	});

	const onSubmit = async () => {
		setError(null);
		try {
			await saveShippingProfile({
				successMessage: __('Settings Updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	return (
		<SettingsTemplate
			title={__('Manage Shipping Profile')}
			prefix={
				<sc-button
					href={removeQueryArgs(
						window.location.href,
						'type',
						'profile'
					)}
					circle
					size="small"
				>
					<sc-icon name="arrow-left"></sc-icon>
				</sc-button>
			}
			onSubmit={onSubmit}
			noButton
		>
			<Error
				error={error || shippingProfileError}
				setError={setError}
				margin="80px"
			/>
			<SettingsBox loading={!hasLoadedShippingProfile}>
				<ScInput
					label={__('Name', 'surecart')}
					type="text"
					required
					value={shippingProfile?.name}
					onScInput={(e) => {
						editShippingProfile({
							name: e.target.value || null,
						});
					}}
					help={__("Customers won't see this.", 'surecart')}
				/>
			</SettingsBox>
			<Products
				shippingProfileId={shippingProfile?.id}
				loading={!hasLoadedShippingProfile}
				products={shippingProfile?.products?.data}
			/>
		</SettingsTemplate>
	);
};
