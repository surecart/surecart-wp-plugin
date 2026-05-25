/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import Error from '../components/Error';
import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import SaveButton from '../templates/SaveButton';
import useSave from '../settings/UseSave';
import Products from './modules/Products';

export default ({ id, navigation } = {}) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const [error, setError] = useState(null);
	const { save } = useSave();
	const {
		item,
		editItem,
		itemError,
		saveItem,
		saveError,
		savingItem,
		deleteItem,
		deletingItem,
		hasLoadedItem,
	} = useEntity('product-group', id);

	const goBackToList = () => {
		if (navigation) {
			navigation.goToList();
		} else {
			window.location.assign('admin.php?page=sc-product-groups');
		}
	};

	const onSubmit = async () => {
		try {
			setError(null);
			save({ successMessage: __('Upgrade group updated.', 'surecart') });
		} catch (e) {
			setError(e);
		}
	};

	const onDelete = async () => {
		const r = confirm(
			__(
				'Permanently delete this upgrade group? You cannot undo this action.',
				'surecart'
			)
		);
		if (!r) return;

		try {
			await deleteItem({ throwOnError: true });
			createSuccessNotice(__('Upgrade group deleted.', 'surecart'));
			goBackToList();
		} catch (e) {
			console.error(e?.message);
			setError(e);
		}
	};

	const toggleArchive = async () => {
		const r = confirm(
			item?.archived
				? __('Un-Archive this upgrade group?', 'surecart')
				: __('Archive this upgrade group?', 'surecart')
		);

		if (!r) return;

		try {
			await saveItem({ archived: !item?.archived });
			createSuccessNotice(
				!item?.archived
					? __('Upgrade group archived.', 'surecart')
					: __('Upgrade group un-archived.', 'surecart'),
				{ type: 'snackbar' }
			);
		} catch (e) {
			console.error(e);
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
			<ScDropdown placement="bottom-end">
				<ScButton type="text" slot="trigger">
					<ScIcon name="more-horizontal" />
				</ScButton>
				<ScMenu>
					<ScMenuItem onClick={toggleArchive}>
						{item?.archived
							? __('Un-Archive', 'surecart')
							: __('Archive', 'surecart')}
					</ScMenuItem>
					<ScMenuItem onClick={onDelete}>
						{__('Delete', 'surecart')}
					</ScMenuItem>
				</ScMenu>
			</ScDropdown>
			<SaveButton busy={deletingItem || savingItem}>
				{__('Save Group', 'surecart')}
			</SaveButton>
		</div>
	);

	const backProps = navigation
		? {
				onClick: (e) => {
					e.preventDefault();
					navigation.goToList();
				},
		  }
		: {};

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
						{...backProps}
					>
						<sc-icon name="arrow-left"></sc-icon>
					</ScButton>
					<sc-breadcrumbs>
						<sc-breadcrumb>
							<Logo display="block" />
						</sc-breadcrumb>
						<sc-breadcrumb
							href="admin.php?page=sc-product-groups"
							{...backProps}
						>
							{__('Upgrade Groups', 'surecart')}
						</sc-breadcrumb>
						<sc-breadcrumb>
							<sc-flex style={{ gap: '1em' }}>
								{__('Edit Upgrade Group', 'surecart')}
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
			</Fragment>
		</UpdateModel>
	);
};
