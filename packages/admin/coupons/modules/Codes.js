import { sprintf, __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import {
	ScBlockUi,
	ScButton,
	ScEmpty,
	ScFlex,
	ScIcon,
	ScSwitch,
} from '@surecart/components-react';
import { useState, Fragment } from '@wordpress/element';
import Code from './Code';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditPromotionCode from './EditPromotionCode';

export default ({ id }) => {
	const [showArchived, setShowArchived] = useState(false);
	const [modal, setModal] = useState(false);

	const { promotions, archivedPromotions, isLoading, isBusy } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'promotion',
				{
					coupon_ids: [id],
					per_page: 100,
				},
			];
			const promotions = select(coreStore).getEntityRecords(...queryArgs);
			const resolving = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				promotions: (promotions || []).filter(
					(promotion) => !promotion.archived
				),
				archivedPromotions: (promotions || []).filter(
					(promotion) => promotion.archived
				),
				isLoading: !promotions?.length && resolving,
				isBusy: promotions?.length && resolving,
			};
		}
	);

	return (
		<Box
			title={__('Promotion Codes', 'surecart')}
			loading={isLoading}
			footer={
				!isLoading && (
					<Fragment>
						<ScButton onClick={() => setModal(true)}>
							<ScIcon slot="prefix" name="plus" />
							{__('Add Promotion Code', 'surecart')}
						</ScButton>
						{!!archivedPromotions?.length && (
							<ScFlex justifyContent="flex-end">
								<ScSwitch
									checked={!!showArchived}
									onClick={(e) => {
										e.preventDefault();
										setShowArchived(!showArchived);
									}}
								>
									{sprintf(
										!showArchived
											? __(
													'Show %d Archived Promotion Codes',
													'surecart'
											  )
											: __(
													'Hide %d Archived Promotion Codes',
													'surecart'
											  ),
										archivedPromotions?.length
									)}
								</ScSwitch>
							</ScFlex>
						)}
					</Fragment>
				)
			}
		>
			{(promotions || []).map((promotion) => (
				<Code promotion={promotion} key={promotion?.id} />
			))}

			{!!showArchived &&
				(archivedPromotions || []).map((promotion) => (
					<Code promotion={promotion} key={promotion?.id} />
				))}

			{!!modal && (
				<EditPromotionCode
					couponId={id}
					onRequestClose={() => setModal(false)}
				/>
			)}

			{!!isBusy && <ScBlockUi spinner />}
		</Box>
	);
};
