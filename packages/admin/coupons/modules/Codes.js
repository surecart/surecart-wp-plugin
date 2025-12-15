/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import {
	ScBlockUi,
	ScButton,
	ScFlex,
	ScIcon,
} from '@surecart/components-react';
import Code from './Code';
import EditPromotionCode from './EditPromotionCode';
import PrevNextButtons from '../../ui/PrevNextButtons';
import ArchivedPromotions from './ArchivedPromotions';

export default ({ id }) => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const [modal, setModal] = useState(false);
	const [archivedDrawer, setArchivedDrawer] = useState(false);
	const [page, setPage] = useState(1);
	const [promotions, setPromotions] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isBusy, setIsBusy] = useState(false);
	const perPage = 10;

	const fetchPromotions = async () => {
		try {
			if (promotions.length) {
				setIsBusy(true);
			} else {
				setIsLoading(true);
			}

			const response = await apiFetch({
				path: addQueryArgs('/surecart/v1/promotions', {
					coupon_ids: [id],
					archived: false,
					per_page: perPage,
					page,
				}),
				parse: false,
			});

			const data = await response.json();
			const total = parseInt(
				response.headers.get('X-WP-Total') || '0',
				10
			);

			setPromotions(data);
			setTotalCount(total);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
		} finally {
			setIsLoading(false);
			setIsBusy(false);
		}
	};

	useEffect(() => {
		fetchPromotions();
	}, [id, page]);

	const hasPagination = totalCount > perPage;

	return (
		<Box
			title={__('Promotion Codes', 'surecart')}
			loading={isLoading}
			footerStyle={{ flexDirection: 'column' }}
			footer={
				!isLoading && (
					<Fragment>
						{hasPagination && (
							<PrevNextButtons
								data={promotions}
								page={page}
								setPage={setPage}
								perPage={perPage}
								totalItems={totalCount}
								loading={isBusy}
							/>
						)}

						<ScFlex
							justifyContent="space-between"
							alignItems="center"
							style={{
								width: '100%',
								marginTop: 'var(--sc-spacing-medium)',
							}}
						>
							<ScButton onClick={() => setModal(true)}>
								<ScIcon slot="prefix" name="plus" />
								{__('Add Promotion Code', 'surecart')}
							</ScButton>

							<ScButton onClick={() => setArchivedDrawer(true)}>
								<ScIcon slot="prefix" name="archive" />
								{__('View Archived', 'surecart')}
							</ScButton>
						</ScFlex>
					</Fragment>
				)
			}
		>
			{promotions.map((promotion) => (
				<Code
					promotion={promotion}
					key={promotion?.id}
					onUpdate={fetchPromotions}
				/>
			))}

			{!!modal && (
				<EditPromotionCode
					couponId={id}
					onRequestClose={() => setModal(false)}
					onSuccess={fetchPromotions}
				/>
			)}

			<ArchivedPromotions
				open={archivedDrawer}
				couponId={id}
				onRequestClose={() => setArchivedDrawer(false)}
				onUpdate={fetchPromotions}
			/>

			{!!isBusy && <ScBlockUi spinner />}
		</Box>
	);
};
