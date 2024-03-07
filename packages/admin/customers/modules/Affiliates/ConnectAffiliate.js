/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import { ScSelect } from '@surecart/components-react';

export default ({ customer, updateCustomer }) => {
	const { affiliations, loading } = useSelect(
		(select) => {
			if (!customer?.id) {
				return {
					affiliations: [],
					loading: false,
				};
			}
			const entityData = [
				'surecart',
				'affiliation',
				{
					per_page: 100,
				},
			];

			const affiliations =
				select(coreStore)?.getEntityRecords?.(...entityData) || [];

			return {
				affiliations,
				loading:
					!select(coreStore)?.hasFinishedResolution?.(
						'getEntityRecords',
						[...entityData]
					) && !affiliations?.length,
			};
		},
		[customer?.id]
	);

	return (
		<ScSelect
			label={__('Connect an affiliate', 'surecart')}
			value={customer?.affiliation}
			choices={affiliations.map((affiliation) => ({
				value: affiliation?.id,
				label: affiliation?.first_name + ' ' + affiliation?.last_name,
			}))}
			onScChange={(e) =>
				updateCustomer({
					affiliation: e?.target?.value,
				})
			}
			placeholder={__('Select an affiliate', 'surecart')}
			loading={loading}
			help={__(
				'This will give the affiliate commissions for a specified period of time.',
				'surecart'
			)}
		/>
	);
};
