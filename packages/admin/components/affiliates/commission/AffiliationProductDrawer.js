/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScBlockUi,
	ScButton,
	ScDrawer,
	ScForm,
	ScFormControl,
} from '@surecart/components-react';
import CommissionStructure from './CommissionStructure';
import Error from '../../Error';
import ModelSelector from '../../ModelSelector';

export default ({
	affiliationProduct,
	setAffiliationProduct,
	title,
	open,
	error,
	onRequestClose,
	saveAffiliationProduct,
	loading,
}) => {
	const [isSaving, setIsSaving] = useState(false);
	const [product, setProduct] = useState(affiliationProduct?.product || null);

	const onChange = (data) => {
		setAffiliationProduct({
			...affiliationProduct,
			...data,

			commission_structure: {
				...affiliationProduct.commission_structure,
				...data?.commission_structure,
			},
		});
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		setIsSaving(true);
		await saveAffiliationProduct(affiliationProduct);
		setIsSaving(false);
	};

	return (
		<ScForm onScFormSubmit={onSubmit}>
			<ScDrawer
				label={title}
				style={{ '--sc-drawer-size': '32rem' }}
				onScRequestClose={onRequestClose}
				open={open}
				// onScAfterShow={() => ref.current.triggerFocus()}
				stickyHeader
			>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						height: 100%;
						gap: var(--sc-spacing-medium);
						padding: var(--sc-spacing-x-large);
					`}
				>
					<Error error={error} />

					<ScFormControl
						label={__('Select a Product', 'surecart')}
						style={{ display: 'block' }}
					>
						<ModelSelector
							name="product"
							value={product?.id || product}
							requestQuery={{
								archived: false,
							}}
							onSelect={(productItem) => {
								console.log('productItem', productItem);
								setProduct(productItem);
								onChange({ product: productItem });
							}}
						/>
					</ScFormControl>

					<CommissionStructure
						commissionStructure={
							affiliationProduct?.commission_structure
						}
						onChangeStructure={(value) => {
							onChange({
								commission_structure: value,
							});
						}}
					/>
				</div>

				<ScButton
					type="primary"
					slot="footer"
					submit
					busy={isSaving}
					disabled={isSaving}
				>
					{affiliationProduct?.id
						? __('Save', 'surecart')
						: __('Create', 'surecart')}
				</ScButton>
				<ScButton
					type="text"
					slot="footer"
					onClick={() => onRequestClose()}
				>
					{__('Cancel', 'surecart')}
				</ScButton>

				{(isSaving || loading) && <ScBlockUi spinner></ScBlockUi>}
			</ScDrawer>
		</ScForm>
	);
};
