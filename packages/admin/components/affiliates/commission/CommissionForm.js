/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScBlockUi,
	ScButton,
	ScDrawer,
	ScForm,
} from '@surecart/components-react';
import CommissionStructure from './CommissionStructure';
import Error from '../../Error';
import Product from '../../../affiliations/modules/affiliation-products/Product';

export default ({
	type,
	title,
	open,
	error,
	loading,
	onChange,
	onRequestClose,
	affiliationItem,
	onSubmit,
}) => {
	if (!open) {
		return null;
	}

	return (
		<ScForm onScFormSubmit={onSubmit}>
			<ScDrawer
				label={title}
				style={{ '--sc-drawer-size': '32rem' }}
				onScRequestClose={onRequestClose}
				open={open}
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

					{type === 'product-commission' && (
						<Product
							label={__('Product', 'surecart')}
							productId={
								affiliationItem?.product?.id ||
								affiliationItem?.product
							}
							onSelect={(productId) =>
								onChange({
									product: productId,
								})
							}
						/>
					)}

					<CommissionStructure
						commissionStructure={
							affiliationItem?.commission_structure
						}
						onChangeStructure={(value) =>
							onChange({
								commission_structure: value,
							})
						}
					/>
				</div>

				<ScButton
					type="primary"
					slot="footer"
					submit
					busy={loading}
					disabled={loading}
				>
					{affiliationItem?.id
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

				{loading && <ScBlockUi spinner></ScBlockUi>}
			</ScDrawer>
		</ScForm>
	);
};
