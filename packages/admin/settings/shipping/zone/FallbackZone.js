/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import { useState } from '@wordpress/element';
import { ScCard, ScFormControl, ScSelect } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import Error from '../../../components/Error';

export default ({ loading, shippingProfile, onEditShippingProfile }) => {
	const [error, setError] = useState();
	const { shippingZones, loadingZones } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'shipping-zone',
			{
				per_page: 100,
				shipping_profile_ids: [shippingProfile?.id],
			},
		];

		const zones = (
			select(coreStore).getEntityRecords(...queryArgs) || []
		).map((zone) => ({
			label: zone.name,
			value: zone.id,
		}));

		return {
			loadingZones: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
			shippingZones: zones,
		};
	});

	if (!shippingZones?.length) {
		return null;
	}

	return (
		<SettingsBox
			title={__('Rest Of The World', 'surecart')}
			description={__(
				'The shipping zone that should be the fallback when a specific shipping zone does not match the checkout\'s shipping address. This is commonly referred to as a "Rest of World" shipping zone.',
				'surecart'
			)}
			wrapperTag="div"
			loading={loading || loadingZones}
			css={css`
				position: relative;
			`}
		>
			<ScCard>
				<Error setError={setError} error={error} />
				<ScFormControl label={__('Rest of the world zone', 'surecart')}>
					<ScSelect
						value={shippingProfile?.fallback_shipping_zone}
						choices={shippingZones}
						onScChange={(e) =>
							onEditShippingProfile(
								'fallback_shipping_zone',
								e.target.value
							)
						}
					></ScSelect>
				</ScFormControl>
			</ScCard>
		</SettingsBox>
	);
};
