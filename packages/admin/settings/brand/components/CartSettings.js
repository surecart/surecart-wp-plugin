/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScChoice,
	ScChoices,
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
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
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

	const [cartIcon, setCartIcon] = useEntityProp(
		'root',
		'site',
		'surecart_cart_icon'
	);

	const addCartMenu = (menuId) =>
		setCartMenuSelectedIds([
			...new Set([...(cartMenuSelectedIds || []), menuId]),
		]);

	const removeCartMenu = (menuId) => {
		const newCartMenuSelectedIds = cartMenuSelectedIds.filter(
			(item) => item !== menuId
		);
		setCartMenuSelectedIds(newCartMenuSelectedIds);
	};

	const renderContent = () => {
		// we are loading.
		if (loading) {
			return (
				<>
					<ScSkeleton style={{ width: '100%', marginBottom: 15 }} />
					<ScSkeleton style={{ width: '60%' }} />
				</>
			);
		}

		// need additional options for non-floating icon.
		if (cartIconType !== 'floating_icon') {
			return (
				<>
					<div>
						<ScFormControl
							label={__('Select Menus', 'surecart')}
							help={__(
								'Select the menu(s) where the cart icon will appear.',
								'surecart'
							)}
						>
							<div
								css={css`
									gap: 1em;
									display: flex;
									flex-wrap: wrap;
									padding: 0.44em 0;
								`}
							>
								{(cartMenuSelectedIds || []).map((menuId) => {
									// find the menu by id.
									const menu = menus?.find(
										(item) => item?.id === menuId
									);
									// bail if it's been deleted or no name.
									if (!menu?.name) return null;
									return (
										<ScTag
											pill={true}
											clearable={true}
											key={menuId}
											onScClear={() =>
												removeCartMenu(menuId)
											}
										>
											{menu.name}
										</ScTag>
									);
								})}
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
										{menus?.map((item) => {
											const checked = (
												cartMenuSelectedIds || []
											).includes(item.id);
											return (
												<ScMenuItem
													style={{
														'--sc-menu-item-white-space':
															'wrap',
														'--sc-menu-item-line-height':
															'var(--sc-line-height-dense)',
													}}
													key={item.id}
													onClick={() =>
														!checked
															? addCartMenu(
																	item.id
															  )
															: removeCartMenu(
																	item.id
															  )
													}
													checked={checked}
												>
													{item.name}
												</ScMenuItem>
											);
										})}
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
						{__('Always Show Cart (Menu Only)', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'Enable to always show the cart button, even when your cart is empty.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				</>
			);
		}
	};

	const renderCartIcons = () => {
		return (
			<ScChoices
				label={__('Icon', 'surecart')}
				onScChange={(e) => setCartIcon(e.target.value)}
				style={{ '--sc-choice-padding': '1.3em' }}
				autoWidth
			>
				<ScChoice
					showControl={false}
					checked={cartIcon === 'shopping-bag'}
					value={'shopping-bag'}
				>
					<ScIcon name="shopping-bag" />
				</ScChoice>
				<ScChoice
					showControl={false}
					checked={cartIcon === 'shopping-cart'}
					value={'shopping-cart'}
				>
					<ScIcon name="shopping-cart" />
				</ScChoice>
			</ScChoices>
		);
	};

	return (
		<>
			{!!scData?.is_block_theme ? (
				<>
					<ScSwitch
						checked={['floating_icon', 'both'].includes(
							cartIconType
						)}
						onScChange={(e) => {
							setCartIconType(
								e.target.checked ? 'floating_icon' : 'menu_icon'
							);
						}}
					>
						{__('Show Floating Cart Icon', 'surecart')}
						<span slot="description" style={{ lineHeight: '1.4' }}>
							{__(
								'Show a floating cart icon in the bottom corner of your site, if there are items in the cart.',
								'surecart'
							)}
						</span>
					</ScSwitch>
					{['floating_icon', 'both'].includes(cartIconType) &&
						renderCartIcons()}
				</>
			) : (
				<>
					{renderCartIcons()}
					<ScSelect
						label={__('Cart Icon Type', 'surecart')}
						value={cartIconType}
						help={__(
							'What type of cart icon would you like to use?',
							'surecart'
						)}
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
					{renderContent()}
				</>
			)}
		</>
	);
};
