/** @jsx jsx */

import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { ScButton, ScSwitch } from '@surecart/components-react';
import { useState, Fragment } from '@wordpress/element';
import { css, jsx } from '@emotion/core';
import useEntities from '../../mixins/useEntities';
import Code from './Code';
import { useEffect } from 'react';
import useEntity from '../../mixins/useEntity';
import ErrorFlash from '../../components/ErrorFlash';

export default ({ id, loading }) => {
	const { promotions, addPromotion, draftPromotions } =
		useEntities('promotion');
	const { promotionErrors, clearPromotionErrors } = useEntity('promotion');
	const activePromotions = (promotions || []).filter((p) => !p.archived);
	const archivedPromotions = (promotions || []).filter((p) => p.archived);

	const [showArchived, setShowArchived] = useState(false);

	useEffect(() => {
		if (!id) {
			addPromotion({
				currency: scData?.currency_code || 'usd',
			});
		}
	}, []);

	const renderLoading = () => {
		return (
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				<sc-skeleton
					style={{
						'--border-radius':
							'var(--sc-input-border-radius-medium)',
						height: 'var( --sc-input-height-medium )',
						width: '100%',
					}}
				></sc-skeleton>
				<sc-skeleton
					style={{
						width: '80%',
					}}
				></sc-skeleton>
			</div>
		);
	};

	const renderPromotionsList = (promotions) => {
		return (promotions || []).map((promotion, index) => {
			return <Code promotion={promotion} key={index} index={index} />;
		});
	};

	return (
		<Box
			title={__('Promotion Codes', 'surecart')}
			footer={
				!loading && (
					<Fragment>
						<ScButton
							class={'sc-promotion-code-add'}
							onClick={(e) => {
								e.preventDefault();
								addPromotion({
									currency: scData?.currency_code || 'usd',
									coupon_id: id,
								});
							}}
						>
							<svg
								slot="prefix"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							{__('Add Another Promotion Code', 'surecart')}
						</ScButton>

						{!!archivedPromotions?.length && (
							<div
								css={css`
									display: flex;
									justify-content: flex-end;
								`}
							>
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
							</div>
						)}
					</Fragment>
				)
			}
		>
			<ErrorFlash
				errors={promotionErrors}
				onHide={clearPromotionErrors}
			/>
			{loading ? renderLoading() : renderPromotionsList()}
			{renderPromotionsList(activePromotions)}
			{renderPromotionsList(draftPromotions)}
			{showArchived && renderPromotionsList(archivedPromotions)}
		</Box>
	);
};
