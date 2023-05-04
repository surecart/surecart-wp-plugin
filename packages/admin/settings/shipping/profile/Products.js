/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import SettingsBox from '../../SettingsBox';
import {
	ScBlockUi,
	ScButton,
	ScDropdown,
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
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import Error from '../../../components/Error';

export default ({ shippingProfileId, products, loading }) => {
	const [draftProducts, setDraftProducts] = useState(0);
	const [busy, setBusy] = useState(false);
	const { invalidateResolutionForStore, receiveEntityRecords } =
		useDispatch(coreStore);
	const [error, setError] = useState(null);

	const onRemoveProduct = async (id) => {
		if (!id) return;
		setBusy(true);

		try {
			await apiFetch({
				path: `surecart/v1/products/${id}`,
				data: {
					shipping_profile: null,
				},
				method: 'PATCH',
			});

			await invalidateResolutionForStore();
		} catch (error) {
			console.error(error);
			if (error?.additional_errors?.[0]?.message) {
				setError(error?.additional_errors?.[0]?.message);
			} else {
				setError(
					error?.message ||
						__('Failed to remove product.', 'surecart')
				);
			}
		} finally {
			setBusy(false);
		}
	};

	const onSelectProduct = async (id) => {
		if (!id) return;
		setDraftProducts(draftProducts - 1);
		setBusy(true);

		try {
			await apiFetch({
				path: `surecart/v1/products/${id}`,
				data: {
					shipping_profile: shippingProfileId,
				},
				method: 'PATCH',
			});
			await invalidateResolutionForStore();
			await receiveEntityRecords(
				'surecart',
				'shipping-profile',
				shippingProfileId,
				{
					expand: ['products'],
				}
			);
		} catch (error) {
			console.error(error);
			if (error?.additional_errors?.[0]?.message) {
				setError(error?.additional_errors?.[0]?.message);
			} else {
				setError(
					error?.message || __('Failed to add product.', 'surecart')
				);
			}
		} finally {
			setBusy(false);
		}
	};

	return (
		<SettingsBox
			title={__('Products', 'surecart')}
			end={
				<ScButton
					type="primary"
					onClick={() => setDraftProducts(draftProducts + 1)}
					disabled={draftProducts > 0}
				>
					<ScIcon name="plus" />
					Add New
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
				<ScStackedList>
					{products.map((product) => (
						<ScStackedListRow key={product.id}>
							<Product id={product.id} />
							<ScDropdown slot="suffix" placement="bottom-end">
								<ScButton type="text" slot="trigger" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() =>
											onRemoveProduct(product.id)
										}
									>
										<ScIcon slot="prefix" name="trash" />
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
								exclude={products?.map((product) => product.id)}
								onSelect={(id) => {
									onSelectProduct(id);
								}}
							/>
							<ScDropdown slot="suffix" placement="bottom-end">
								<ScButton type="text" slot="trigger" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() =>
											setDraftProducts(draftProducts - 1)
										}
									>
										<ScIcon slot="prefix" name="trash" />
										{__('Remove', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						</ScStackedListRow>
					))}
				</ScStackedList>
			) : (
				<ScText>{__('No products added yet.', 'surecart')}</ScText>
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
