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
	const productIds = coupon?.filter_product_ids || [];
	const onRemove = (id) =>
		updateCoupon({
			filter_product_ids: productIds.filter((item) => item !== id),
		});

	return (
		<Box title={__('Products Restriction', 'surecart')} loading={loading}>
			{!!productIds?.length && (
				<ScStackedList>
					<ScCard noPadding>
						<div>
							{productIds.map((id) => {
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
										required
										key={index}
										name="product"
										placeholder={__(
											'Find a product...',
											'surecart'
										)}
										requestQuery={{ archived: false }}
										onSelect={(id) => {
											updateCoupon({
												filter_product_ids: [
													...new Set([
														...(coupon?.filter_product_ids ||
															[]),
														...[id],
													]),
												],
											});
											setDrafts(drafts - 1);
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

			<div>
				<ScButton onClick={() => setDrafts(drafts + 1)}>
					<ScIcon name="plus" slot="prefix" />
					{__('Add product', 'surecart')}
				</ScButton>
			</div>
		</Box>
	);
};
