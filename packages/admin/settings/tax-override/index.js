/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import SettingsBox from '../SettingsBox';
import TaxOverrideList from './TaxOverrideList';

export default ({ region, registrations, hasLoadedItem }) => {
	return (
		<>
			<SettingsBox
				title={__('Tax Rates and Exemptions', 'surecart')}
				description={''}
				noButton
				loading={!hasLoadedItem}
				wrapperTag="div"
			>
				<TaxOverrideList
					type="shipping"
					region={region}
					registrations={registrations}
				/>

				<div
					css={css`
						margin-top: var(--sc-spacing-large);
					`}
				>
					<TaxOverrideList
						type="product"
						region={region}
						registrations={registrations}
					/>
				</div>
			</SettingsBox>
		</>
	);
};
