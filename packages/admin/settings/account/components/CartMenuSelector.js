/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScFormControl,
	ScSelect,
	ScSkeleton,
	ScTag,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

export default () => {
	const { menus, loading } = useSelect((select) => {
		const queryArgs = ['taxonomy', 'nav_menu', { per_page: 100 }];
		return {
			menus: select(coreStore).getEntityRecords(...queryArgs),
			loading: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
		};
	});

	const [cartMenuSelectedIds, setCartMenuSelectedIds] = useEntityProp(
		'root',
		'site',
		'surecart_cart_menu_selected_ids'
	);

	const addCartMenu = (menuId) =>
		setCartMenuSelectedIds([...new Set([...cartMenuSelectedIds, menuId])]);

	const removeCartMenu = (menuId) => {
		const newCartMenuSelectedIds = cartMenuSelectedIds.filter(
			(item) => item !== menuId
		);
		setCartMenuSelectedIds(newCartMenuSelectedIds);
	};

	if (loading) return <ScSkeleton style={{ width: '100%' }} />;

	return (
		<ScFormControl label={__('Select Menus', 'surecart')}>
			<div
				css={css`
					gap: 1em;
					display: flex;
					flex-direction: column;
				`}
			>
				{cartMenuSelectedIds?.length ? (
					<div
						css={css`
							gap: 1em;
							display: flex;
						`}
					>
						{cartMenuSelectedIds?.map((menuId) => {
							return (
								<ScTag
									pill={true}
									clearable={true}
									onScClear={() => removeCartMenu(menuId)}
								>
									{
										menus?.find(
											(item) => item?.id === menuId
										)?.slug
									}
								</ScTag>
							);
						})}
					</div>
				) : null}
				<ScSelect
					search={true}
					placeholder={__('Select Menu', 'surecart')}
					help={__(
						'Select the menu you wish to display the Menu Cart'
					)}
					choices={menus?.map((item) => ({
						label: `${item.name} (${item.slug})`,
						value: item.id,
						disabled: (cartMenuSelectedIds || []).includes(item.id),
					}))}
					unselect={false}
					onScChange={(e) => addCartMenu(Number(e.target.value))}
				/>
			</div>
		</ScFormControl>
	);
};
