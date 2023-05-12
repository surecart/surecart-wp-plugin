/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import { Fragment, useState } from '@wordpress/element';
import {
	ScCard,
	ScFlex,
	ScFormControl,
	ScIcon,
	ScSelect,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import Error from '../../../components/Error';

export default ({ loading, shippingProfile, onEditShippingProfile }) => {
	const [error, setError] = useState();
	const [showAdvanced, setShowAdvanced] = useState(false);
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

	return (
		<div>
			<ScFlex
				alignItems="center"
				justifyContent="flex-start"
				slot="heading"
				css={css`
					cursor: pointer;
				`}
				onClick={() => setShowAdvanced(!showAdvanced)}
			>
				Advanced Options <ScIcon name="chevron-down" />
			</ScFlex>
			{showAdvanced && (
				<SettingsBox
					wrapperTag="div"
					loading={loading || loadingZones}
					css={css`
						position: relative;
					`}
				>
					<ScCard>
						<Error setError={setError} error={error} />
						<ScFormControl label={__('Fallback Zone', 'surecart')}>
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
			)}
		</div>
	);
};
