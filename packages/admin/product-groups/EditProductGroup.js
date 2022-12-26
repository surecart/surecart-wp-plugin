/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton } from '@surecart/components-react';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Error from '../components/Error';
import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import SaveButton from '../templates/SaveButton';
import useSave from '../settings/UseSave';
import Products from './modules/Products';

export default ({ id }) => {
	const [error, setError] = useState(null);
	const { save } = useSave();
	const {
		item,
		editItem,
		itemError,
		saveError,
		savingItem,
		deletingItem,
		hasLoadedItem,
	} = useEntity('product-group', id);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			setError(null);
			save({ successMessage: __('Product group updated.', 'surecart') });
		} catch (e) {
			setError(e);
		}
	};

	const button = !hasLoadedItem ? (
		<sc-skeleton
			style={{
				width: '120px',
				height: '35px',
				display: 'inline-block',
			}}
		></sc-skeleton>
	) : (
		<div
			css={css`
				display: flex;
				align-items: center;
				gap: 0.5em;
			`}
		>
			<SaveButton busy={deletingItem || savingItem}>
				{__('Save Group', 'surecart')}
			</SaveButton>
		</div>
	);

	return (
		<UpdateModel
			onSubmit={onSubmit}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-product-groups"
					>
						<sc-icon name="arrow-left"></sc-icon>
					</ScButton>
					<sc-breadcrumbs>
						<sc-breadcrumb>
							<Logo display="block" />
						</sc-breadcrumb>
						<sc-breadcrumb href="admin.php?page=sc-product-groups">
							{__('Product Groups', 'surecart')}
						</sc-breadcrumb>
						<sc-breadcrumb>
							<sc-flex style={{ gap: '1em' }}>
								{__('Edit Product Group', 'surecart')}
								{item?.archived && (
									<>
										{' '}
										<sc-tag type="warning">
											{__('Archived', 'surecart')}
										</sc-tag>
									</>
								)}
							</sc-flex>
						</sc-breadcrumb>
					</sc-breadcrumbs>
				</div>
			}
			button={button}
		>
			<Fragment>
				<Error
					error={saveError || itemError || error}
					setError={setError}
					margin="80px"
				/>

				<Details
					productGroup={item}
					updateProductGroup={editItem}
					loading={!hasLoadedItem}
				/>

				<Products id={id} />

				{/* <Prices
					productId={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Integrations id={id} />

				<Downloads
					id={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Licensing
					id={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/> */}
			</Fragment>
		</UpdateModel>
	);
};
