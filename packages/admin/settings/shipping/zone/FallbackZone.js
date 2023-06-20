/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import { useState } from '@wordpress/element';
import { ScCard, ScFormControl, ScSelect } from '@surecart/components-react';
import Error from '../../../components/Error';

export default ({
	loading,
	shippingZones,
	shippingProfile,
	onEditShippingProfile,
}) => {
	const [error, setError] = useState();

	return (
		<SettingsBox
			title={__('Rest Of The World Fallback Zone', 'surecart')}
			description={__(
				'This zone is optionally used for regions that are not included in any other shipping zone.',
				'surecart'
			)}
			wrapperTag="div"
			loading={loading}
			css={css`
				position: relative;
			`}
		>
			<ScCard>
				<Error setError={setError} error={error} />

				<ScFormControl label={__('Fallback Zone', 'surecart')}>
					<ScSelect
						value={shippingProfile?.fallback_shipping_zone}
						choices={(shippingZones || []).map((zone) => ({
							label: zone.name,
							value: zone.id,
						}))}
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
