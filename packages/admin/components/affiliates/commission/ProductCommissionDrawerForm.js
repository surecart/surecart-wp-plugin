/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';

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
import ProductSelector from '../../ProductSelector';

export default ({
	affiliationProduct,
	setAffiliationProduct,
	title,
	open,
	onRequestClose,
	saveAffiliationProduct,
}) => {
	const [isSaving, setIsSaving] = useState(false);

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
					<ScFormControl
						label={__('Select a Product', 'surecart')}
						style={{ display: 'block' }}
					>
						<ProductSelector
							product={affiliationProduct?.product}
							onSelect={(product) => {
								onChange({ product });
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

				{isSaving && <ScBlockUi spinner></ScBlockUi>}
			</ScDrawer>
		</ScForm>
	);
};
