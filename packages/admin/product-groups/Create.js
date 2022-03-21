/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { CeButton, CeForm, CeInput } from '@checkout-engine/components-react';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as uiStore } from '../store/ui';
import useCurrentPage from '../mixins/useCurrentPage';
// template
import CreateTemplate from '../templates/Model';
import Box from '../ui/Box';
import FlashError from '../components/FlashError';

export default () => {
	const { saveProductgroup, updateProductgroup, isSaving, setSaving } =
		useCurrentPage('product_group');
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);

	// create the product group.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			await saveProductgroup();
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
			<FlashError path="product_group" scrollIntoView />

			<Box title={__('Create New Upgrade Group', 'checkout_engine')}>
				<CeForm onCeSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--ce-spacing-large);
						`}
					>
						<CeInput
							label={__('Group Name', 'checkout_engine')}
							className="ce-product-name hydrated"
							help={__(
								'A name for your product group. This is not shown to customers.',
								'checkout_engine'
							)}
							onCeChange={(e) => {
								updateProductgroup({ name: e.target.value });
							}}
							name="name"
							required
							autofocus
						/>

						<div
							css={css`display: flex gap: var(--ce-spacing-small);`}
						>
							<CeButton type="primary" submit loading={isSaving}>
								{__('Create', 'checkout_engine')}
							</CeButton>

							<CeButton
								href={'admin.php?page=ce-product-groups'}
								type="text"
							>
								{__('Cancel', 'checkout_engine')}
							</CeButton>
						</div>
					</div>
				</CeForm>
			</Box>
		</CreateTemplate>
	);
};
