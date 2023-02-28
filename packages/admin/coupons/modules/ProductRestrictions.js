/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScFormControl,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedList,
	ScStackedListRow,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import ModelSelector from '../../components/ModelSelector';
import Box from '../../ui/Box';
import Product from './Product';

export default ({ coupon, updateCoupon, loading }) => {
	const [drafts, setDrafts] = useState(0);
	const productIds = coupon?.product_ids || [];
	const onRemove = (id) =>
		updateCoupon({
			product_ids: productIds.filter((item) => item !== id),
		});

	return (
		<Box
			title={__('Product Restrictions', 'surecart')}
			loading={loading}
			footer={
				<ScButton onClick={() => setDrafts(drafts + 1)}>
					<ScIcon name="plus" slot="prefix" />
					{__('Add Product Restriction', 'surecart')}
				</ScButton>
			}
		>
			{(!!productIds?.length || !![...Array(drafts)]?.length) && (
				<ScStackedList>
					<ScCard noPadding>
						<div>
							{productIds.map((id) => {
								if (!id) return null;
								return (
									<ScStackedListRow>
										<Product id={id} onSetId={() => {}} />
										<ScDropdown
											slot="suffix"
											placement="bottom-end"
										>
											<ScButton
												type="text"
												slot="trigger"
												circle
											>
												<ScIcon name="more-horizontal" />
											</ScButton>
											<ScMenu>
												<ScMenuItem
													onClick={() => onRemove(id)}
												>
													<ScIcon
														slot="prefix"
														name="trash"
													/>
													{__('Remove', 'surecart')}
												</ScMenuItem>
											</ScMenu>
										</ScDropdown>
									</ScStackedListRow>
								);
							})}

							{[...Array(drafts)].map((_, index) => (
								<ScStackedListRow>
									<ModelSelector
										css={css`
											min-width: 380px;
										`}
										key={index}
										name="product"
										placeholder={__(
											'Find a product...',
											'surecart'
										)}
										requestQuery={{
											archived: false,
											expand: ['prices'],
										}}
										exclude={productIds}
										onSelect={(id) => {
											if (!id) return;
											setDrafts(drafts - 1);
											updateCoupon({
												product_ids: [
													...new Set([
														...(coupon?.product_ids ||
															[]),
														...[id],
													]),
												],
											});
										}}
									/>
									<ScDropdown
										slot="suffix"
										placement="bottom-end"
									>
										<ScButton
											type="text"
											slot="trigger"
											circle
										>
											<ScIcon name="more-horizontal" />
										</ScButton>
										<ScMenu>
											<ScMenuItem
												onClick={() =>
													setDrafts(drafts - 1)
												}
											>
												<ScIcon
													slot="prefix"
													name="trash"
												/>
												{__('Remove', 'surecart')}
											</ScMenuItem>
										</ScMenu>
									</ScDropdown>
								</ScStackedListRow>
							))}
						</div>
					</ScCard>
				</ScStackedList>
			)}
		</Box>
	);
};
