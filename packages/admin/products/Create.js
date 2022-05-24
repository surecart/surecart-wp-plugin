/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScChoice,
	ScChoices,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as uiStore } from '../store/ui';
import useCurrentPage from '../mixins/useCurrentPage';
// template
import CreateTemplate from '../templates/Model';
import Box from '../ui/Box';
import FlashError from '../components/FlashError';

export default () => {
	const { product, saveProduct, updateProduct, isSaving, setSaving } =
		useCurrentPage('product');
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);

	// create the product group.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			await saveProduct();
			addSnackbarNotice({
				content: __('Created.'),
			});
		} catch (e) {
			console.error(e);
			addModelErrors('product_group', e);
		} finally {
			setSaving(false);
		}
	};

	return (
		<CreateTemplate>
			<FlashError path="product" scrollIntoView />

			<Box title={__('Create New Product', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScInput
							label={__('Product Name', 'surecart')}
							className="sc-product-name hydrated"
							help={__('A name for your product.', 'surecart')}
							onScChange={(e) => {
								updateProduct({ name: e.target.value });
							}}
							name="name"
							required
							autofocus
						/>

						<ScChoices
							css={css`
								margin-bottom: 1em;
							`}
							required
							label={__('Product Type', 'surecart')}
							style={{ '--columns': 2 }}
						>
							<div>
								<ScChoice
									checked={!product?.recurring}
									value="single"
									onScChange={(e) => {
										if (!e.target.checked) return;
										updateProduct({ recurring: false });
									}}
								>
									{__('Single Payment', 'surecart')}
									<span slot="description">
										{__(
											'Charge a one-time fee.',
											'surecart'
										)}
									</span>
								</ScChoice>
								<ScChoice
									checked={product?.recurring}
									value="subscription"
									onScChange={(e) => {
										if (!e.target.checked) return;
										updateProduct({
											recurring: true,
										});
									}}
								>
									{__('Subscription', 'surecart')}
									<span slot="description">
										{__(
											'Charge an ongoing fee.',
											'surecart'
										)}
									</span>
								</ScChoice>
							</div>
						</ScChoices>

						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>

							<ScButton
								href={'admin.php?page=sc-products'}
								type="text"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					</div>
				</ScForm>
			</Box>
		</CreateTemplate>
	);
};
