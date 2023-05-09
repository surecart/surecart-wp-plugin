/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import {
	ScBlockUi,
	ScButton,
	ScCard,
	ScDropdown,
	ScEmpty,
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScStackedList,
	ScStackedListRow,
	ScText,
} from '@surecart/components-react';
import Product from '../../../coupons/modules/Product';
import { useState } from '@wordpress/element';
import ModelSelector from '../../../components/ModelSelector';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../../components/Error';
import { useDispatch, useSelect } from '@wordpress/data';
import { intervalString } from '../../../util/translations';

export default ({ shippingProfileId }) => {
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const [draftProducts, setDraftProducts] = useState(0);
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { products, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					archived: false,
					shipping_profile_ids: [shippingProfileId],
					per_page: 100,
					expand: ['prices'],
				},
			];

			// are we loading products?
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			const products = (
				select(coreStore).getEntityRecords(...queryArgs) || []
			).filter(
				(product) => product.shipping_profile === shippingProfileId
			);

			return {
				products,
				loading: loading && !products?.length,
			};
		},
		[shippingProfileId]
	);

	const onRemoveProduct = async (id) => {
		if (!id) return;
		setBusy(true);

		try {
			await saveEntityRecord('surecart', 'product', {
				id,
				shipping_profile: null,
			});
			createSuccessNotice(__('Product removed', 'surecart'), {
				type: 'snackbar',
			});
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setBusy(false);
		}
	};

	const onSelectProduct = async (id) => {
		if (!id) return;
		setBusy(true);

		try {
			await saveEntityRecord('surecart', 'product', {
				id,
				shipping_profile: shippingProfileId,
			});
			setDraftProducts(0);
			createSuccessNotice(__('Product added', 'surecart'), {
				type: 'snackbar',
			});
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setBusy(false);
		}
	};

	const renderProduct = (product) => {
		const activePrices = product?.prices?.data?.filter(
			(price) => !price?.archived
		);
		const firstPrice = activePrices?.[0];
		const totalPrices = activePrices?.length;

		return (
			<ScFlex alignItems="center" justifyContent="flex-start">
				{product?.image_url ? (
					<img
						src={product.image_url}
						css={css`
							width: 40px;
							height: 40px;
							object-fit: cover;
							background: #f3f3f3;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: var(--sc-border-radius-small);
						`}
					/>
				) : (
					<div
						css={css`
							width: 40px;
							height: 40px;
							object-fit: cover;
							background: var(--sc-color-gray-100);
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: var(--sc-border-radius-small);
						`}
					>
						<ScIcon
							style={{
								width: '18px',
								height: '18px',
							}}
							name={'image'}
						/>
					</div>
				)}
				<div>
					<div>
						<strong>{product?.name}</strong>
					</div>
					{totalPrices > 1 ? (
						sprintf(__('%d prices', 'surecart'), totalPrices)
					) : (
						<>
							<ScFormatNumber
								value={firstPrice?.amount}
								type="currency"
								currency={firstPrice?.currency}
							/>
							{intervalString(firstPrice)}
						</>
					)}
				</div>
			</ScFlex>
		);
	};

	return (
		<SettingsBox
			title={__('Products', 'surecart')}
			wrapperTag="div"
			end={
				<ScButton
					type="primary"
					onClick={() => setDraftProducts(draftProducts + 1)}
					disabled={draftProducts > 0}
				>
					<ScIcon name="plus" />
					{__('Add New', 'surecart')}
				</ScButton>
			}
			loading={loading}
			css={css`
				position: relative;
			`}
			noButton
		>
			<Error error={error} setError={setError} />
			{products?.length || !!draftProducts ? (
				<ScCard noPadding>
					<ScStackedList>
						{products.map((product) => (
							<ScStackedListRow key={product.id}>
								{renderProduct(product)}
								<ScDropdown
									slot="suffix"
									placement="bottom-end"
								>
									<ScButton type="text" slot="trigger" circle>
										<ScIcon name="more-horizontal" />
									</ScButton>
									<ScMenu>
										<ScMenuItem
											onClick={() =>
												onRemoveProduct(product.id)
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
						{[...Array(draftProducts)].map((_, index) => (
							<ScStackedListRow key={`draft-product-${index}`}>
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
									exclude={products?.map(
										(product) => product.id
									)}
									onSelect={(id) => {
										onSelectProduct(id);
									}}
								/>
								<ScDropdown
									slot="suffix"
									placement="bottom-end"
								>
									<ScButton type="text" slot="trigger" circle>
										<ScIcon name="more-horizontal" />
									</ScButton>
									<ScMenu>
										<ScMenuItem
											onClick={() =>
												setDraftProducts(
													draftProducts - 1
												)
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
					</ScStackedList>
				</ScCard>
			) : (
				<ScCard noPadding>
					<ScEmpty icon="shopping-cart">
						{__('No products added yet.', 'surecart')}
					</ScEmpty>
				</ScCard>
			)}
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</SettingsBox>
	);
};
