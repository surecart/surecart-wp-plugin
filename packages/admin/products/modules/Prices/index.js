/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScEmpty,
	ScIcon,
	ScSpacing,
} from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Box from '../../../ui/Box';
import List from './List';
import NewPrice from './NewPrice';
import ShowArchivedToggle from './ShowArchivedToggle';
import useSelectPrices from '../../hooks/useSelectPrices';

export default ({ product, productId }) => {
	const [newPriceModal, setNewPriceModal] = useState(false);
	const [showArchived, setShowArchived] = useState(false);

	const { active, archived, updating, loading, allPrices } = useSelectPrices({
		productId,
	});

	const footer = () => {
		if (product?.variants_enabled || !product?.id) {
			return null;
		}

		if (!archived?.length && !active?.length) {
			return null;
		}

		return (
			<>
				{!!active?.length && (
					<ScButton onClick={() => setNewPriceModal(true)}>
						<ScIcon name="plus" slot="prefix"></ScIcon>
						{__('Add Another Price', 'surecart')}
					</ScButton>
				)}

				{!!archived?.length && (
					<ShowArchivedToggle
						prices={archived}
						show={showArchived}
						setShow={setShowArchived}
					/>
				)}
			</>
		);
	};

	return (
		<>
			<Box
				title={__('Pricing', 'surecart')}
				loading={loading}
				footer={footer()}
				css={
					!loading &&
					css`
						* {
							box-sizing: border-box;
						}
						.components-card-body {
							padding: 0;
						}
					`
				}
			>
				<div>
					<List
						prices={active}
						product={product}
						allPrices={allPrices}
					>
						<ScEmpty icon="shopping-bag">
							<ScSpacing>
								<p
									css={css`
										font-size: 14px;
									`}
								>
									{__(
										'Set up pricing for your product.',
										'surecart'
									)}
								</p>
								<ScButton
									onClick={() => setNewPriceModal(true)}
								>
									<ScIcon name="plus" slot="prefix"></ScIcon>
									{__('Add A Price', 'surecart')}
								</ScButton>
							</ScSpacing>
						</ScEmpty>
					</List>

					{!!archived?.length && (
						<div
							css={css`
								display: grid;
								gap: var(--sc-spacing-medium);
							`}
						>
							{!!showArchived && (
								<List prices={archived} product={product} />
							)}
						</div>
					)}
				</div>
				{updating && <ScBlockUi spinner></ScBlockUi>}
			</Box>

			{!!product?.id && (
				<NewPrice
					isOpen={newPriceModal}
					onRequestClose={() => setNewPriceModal(false)}
					product={product}
				/>
			)}
		</>
	);
};
