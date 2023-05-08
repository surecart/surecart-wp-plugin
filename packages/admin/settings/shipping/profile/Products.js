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
								<Product id={product.id} />
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
