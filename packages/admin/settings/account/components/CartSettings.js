/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScFormControl,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSelect,
	ScSkeleton,
	ScSwitch,
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

	const [cartMenuAlignment, setCartMenuAlignment] = useEntityProp(
		'root',
		'site',
		'surecart_cart_menu_alignment'
	);

	const [cartMenuAlwaysShown, setCartMenuAlwaysShown] = useEntityProp(
		'root',
		'site',
		'surecart_cart_menu_always_shown'
	);

	const [cartMenuSelectedIds, setCartMenuSelectedIds] = useEntityProp(
		'root',
		'site',
		'surecart_cart_menu_selected_ids'
	);

	const [cartIconType, setCartIconType] = useEntityProp(
		'root',
		'site',
		'surecart_cart_icon_type'
	);

	const addCartMenu = (menuId) =>
		setCartMenuSelectedIds([...new Set([...cartMenuSelectedIds, menuId])]);

	const removeCartMenu = (menuId) => {
		const newCartMenuSelectedIds = cartMenuSelectedIds.filter(
			(item) => item !== menuId
		);
		setCartMenuSelectedIds(newCartMenuSelectedIds);
	};

	return (
		<>
			<ScSelect
				label={__('Cart Icon Type', 'surecart')}
				value={cartIconType}
				help={__('What type of cart icon do you want to use?')}
				unselect={false}
				choices={[
					{
						label: __('Floating Icon', 'surecart'),
						value: 'floating_icon',
					},
					{
						label: __('Menu Icon', 'surecart'),
						value: 'menu_icon',
					},
					{
						label: __('Both', 'surecart'),
						value: 'both',
					},
				]}
				onScChange={(e) => {
					setCartIconType(e.target.value);
				}}
			/>
			{loading ? (
				<>
					<ScSkeleton style={{ width: '100%', marginBottom: 15 }} />
					<ScSkeleton style={{ width: '60%' }} />
				</>
			) : cartIconType !== 'floating_icon' ? (
				<>
					<div>
						<ScFormControl
							label={__('Select Menus', 'surecart')}
							help={__(
								'Select the menus in which the cart icon will appear',
								'surecart'
							)}
						>
							<div
								css={css`
									gap: 1em;
									display: flex;
									padding: 0.44em 0;
								`}
							>
								{cartMenuSelectedIds?.length
									? cartMenuSelectedIds?.map((menuId) => {
											return (
												<ScTag
													pill={true}
													clearable={true}
													onScClear={() =>
														removeCartMenu(menuId)
													}
												>
													{
														menus?.find(
															(item) =>
																item?.id ===
																menuId
														)?.name
													}
												</ScTag>
											);
									  })
									: null}
								<ScDropdown position="bottom-right">
									<ScButton
										type="default"
										size="small"
										slot="trigger"
									>
										<ScIcon name="plus" slot="prefix" />
										Add Menu
									</ScButton>
									<ScMenu>
										{menus?.map((item) => (
											<ScMenuItem
												onClick={() =>
													addCartMenu(Number(item.id))
												}
												disabled={(
													cartMenuSelectedIds || []
												).includes(item.id)}
											>
												{item.name}
											</ScMenuItem>
										))}
									</ScMenu>
								</ScDropdown>
							</div>
						</ScFormControl>
					</div>

					<div>
						<ScSelect
							label={__('Position of cart button', 'surecart')}
							placeholder={__('Select Position', 'surecart')}
							value={cartMenuAlignment}
							onScChange={(e) =>
								setCartMenuAlignment(e.target.value)
							}
							unselect={false}
							help={__(
								'Select the cart button position, i.e. left or right, where it will look best with your website design.',
								'surecart'
							)}
							choices={[
								{
									label: __('Right', 'surecart'),
									value: 'right',
								},
								{
									label: __('Left', 'surecart'),
									value: 'left',
								},
							]}
						/>
					</div>

					<ScSwitch
						checked={cartMenuAlwaysShown}
						onClick={(e) => {
							e.preventDefault();
							setCartMenuAlwaysShown(!cartMenuAlwaysShown);
						}}
					>
						{__('Always show cart', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'Enable to always show the cart button, even your cart is empty.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				</>
			) : null}
		</>
	);
};
