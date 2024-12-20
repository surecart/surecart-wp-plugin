/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, _n } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import {
	ScBlockUi,
	ScButton,
	ScCard,
	ScEmpty,
	ScFlex,
	ScFormatNumber,
	ScIcon,
	ScStackedList,
	ScStackedListRow,
} from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';
import { useState, useRef, useLayoutEffect } from '@wordpress/element';
import { DropdownMenu } from '@wordpress/components';
import { moreHorizontal, trash } from '@wordpress/icons';
import ModelSelector from '../../../components/ModelSelector';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import Error from '../../../components/Error';
import { useDispatch, useSelect } from '@wordpress/data';
import { intervalString } from '../../../util/translations';
import PrevNextButtons from '../../../ui/PrevNextButtons';
import usePagination from '../../../hooks/usePagination';

const PRODUCTS_PER_PAGE = 100;

export default ({ shippingProfileId, isDefaultProfile }) => {
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { products, loading, productsBusy } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					archived: false,
					shipping_profile_ids: [shippingProfileId],
					per_page: PRODUCTS_PER_PAGE,
					page: currentPage,
					expand: [
						'prices',
						'featured_product_media',
						'product.product_medias',
						'product_media.media',
					],
					sort: 'updated_at:asc',
				},
			];

			// are we loading products?
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			// need to eliminate duplicates
			const products = (
				select(coreStore).getEntityRecords(...queryArgs) || []
			)
				.filter(
					(product) => product?.shipping_profile === shippingProfileId
				)
				.filter(
					(value, index, self) =>
						self.findIndex((v) => v.id === value.id) === index
				);

			return {
				products,
				loading: loading && !products?.length,
				productsBusy: loading && products?.length,
			};
		},
		[shippingProfileId, currentPage]
	);

	const { hasPagination } = usePagination({
		data: products,
		page: currentPage,
		perPage: PRODUCTS_PER_PAGE,
	});

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
			await saveEntityRecord(
				'surecart',
				'product',
				{
					id,
					shipping_profile: shippingProfileId,
				},
				{
					throwOnError: true,
				}
			);
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

	const listRef = useRef(null);
	const totalProducts = products?.length ?? 0;
	useLayoutEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	}, [totalProducts]);

	const renderProduct = (product) => {
		const activePrices = product?.prices?.data?.filter(
			(price) => !price?.archived
		);
		const firstPrice = activePrices?.[0];
		const totalPrices = activePrices?.length;

		return (
			<ScFlex alignItems="center" justifyContent="flex-start">
				{product?.line_item_image?.src ? (
					<img
						{...product.line_item_image}
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
						sprintf(
							_n(
								'%d price',
								'%d prices',
								totalPrices,
								'surecart'
							),
							totalPrices
						)
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

	const renderModelSelector = () => {
		return (
			<ModelSelector
				css={css`
					min-width: 380px;
				`}
				fetchOnLoad={true}
				name="product"
				placeholder={__('Find a product...', 'surecart')}
				requestQuery={{
					archived: false,
					expand: ['prices'],
				}}
				exclude={products?.map((product) => product.id)}
				onSelect={(id) => {
					onSelectProduct(id);
				}}
			>
				<ScButton type="default" slot="trigger">
					<ScIcon name="plus" />
					{__('Add Product', 'surecart')}
				</ScButton>
			</ModelSelector>
		);
	};

	return (
		<SettingsBox
			title={__('Products', 'surecart')}
			description={
				isDefaultProfile
					? __('All products not in other profiles', 'surecart')
					: __('Add products to this shipping profile.', 'surecart')
			}
			wrapperTag="div"
			loading={loading}
			css={css`
				position: relative;
			`}
			noButton
		>
			<Error error={error} setError={setError} />
			<ScCard noPadding>
				{!!isDefaultProfile && (
					<div
						css={css`
							padding: var(--sc-spacing-x-large);
							margin: 0;
							background: var(--sc-color-brand-main-background);
							border-bottom: 1px solid
								var(--sc-color-brand-stroke);
							display: flex;
							align-items: center;
							gap: var(--sc-spacing-small);
						`}
					>
						<ScIcon name="info" />
						{__(
							'New products are added to this profile.',
							'surecart'
						)}
					</div>
				)}
				{products?.length ? (
					<ScStackedList
						css={css`
							margin: 0;
						`}
					>
						<div
							css={css`
								max-height: 520px;
								overflow-y: auto;
							`}
							ref={listRef}
						>
							{products.map((product) => (
								<ScStackedListRow key={product.id}>
									{renderProduct(product)}
									{!isDefaultProfile ? (
										<div slot="suffix">
											<DropdownMenu
												controls={[
													{
														icon: trash,
														onClick: () =>
															onRemoveProduct(
																product.id
															),
														title: __(
															'Remove',
															'surecart'
														),
													},
												]}
												icon={moreHorizontal}
												label={__(
													'More Actions',
													'surecart'
												)}
												popoverProps={{
													placement: 'bottom-end',
												}}
												menuProps={{
													style: {
														minWidth: '150px',
													},
												}}
											/>
										</div>
									) : null}
								</ScStackedListRow>
							))}
						</div>

						<ScStackedListRow
							css={css`
								--sc-list-row-background-color: var(
									--sc-color-gray-50
								);
							`}
						>
							{renderModelSelector()}
						</ScStackedListRow>
					</ScStackedList>
				) : (
					<ScEmpty
						icon="shopping-bag"
						css={css`
							margin: 0;
						`}
					>
						{__('No products in this profile.', 'surecart')}

						{renderModelSelector()}
					</ScEmpty>
				)}
				{hasPagination && (
					<div
						css={css`
							padding: var(--sc-spacing-x-large);
							border-top: 1px solid var(--sc-color-brand-stroke);
							margin: 0;
						`}
					>
						<PrevNextButtons
							data={products}
							page={currentPage}
							setPage={setCurrentPage}
							perPage={PRODUCTS_PER_PAGE}
							loading={loading}
						/>
					</div>
				)}
				{!!isDefaultProfile && (
					<div
						css={css`
							padding: var(--sc-spacing-x-large);
							background: var(--sc-color-brand-main-background);
							border-top: 1px solid var(--sc-color-brand-stroke);
						`}
					>
						{__(
							'To charge different rates for only certain products, create a new profile in',
							'surecart'
						)}{' '}
						<a
							href={addQueryArgs('admin.php', {
								page: 'sc-settings',
								tab: 'shipping_protocol',
							})}
						>
							{__('shipping settings', 'surecart')}
						</a>
					</div>
				)}
			</ScCard>

			{(busy || productsBusy) && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</SettingsBox>
	);
};
