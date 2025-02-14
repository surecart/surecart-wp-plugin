/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScFormControl,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScSelect,
	ScSkeleton,
	ScTag,
	ScDivider,
} from '@surecart/components-react';
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useCopyToClipboard } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { store as noticeStore } from '@wordpress/notices';

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

	const ref = useCopyToClipboard('[surecart_currency_switcher]', () =>
		createSuccessNotice(__('Copied to clipboard.', 'surecart'), {
			type: 'snackbar',
		})
	);

	const { createSuccessNotice } = useDispatch(noticeStore);

	const [currencySwitcherAlignment, setCurrencySwitcherAlignment] =
		useEntityProp('root', 'site', 'surecart_currency_switcher_alignment');

	const [currencySwitcherSelectedIds, setCurrencySwitcherSelectedIds] =
		useEntityProp(
			'root',
			'site',
			'surecart_currency_switcher_selected_ids'
		);

	const addCurrencySwitcher = (menuId) =>
		setCurrencySwitcherSelectedIds([
			...new Set([...(currencySwitcherSelectedIds || []), menuId]),
		]);

	const removeCurrencySwitcher = (menuId) => {
		const newCurrencySwitcherSelectedIds =
			currencySwitcherSelectedIds.filter((item) => item !== menuId);
		setCurrencySwitcherSelectedIds(newCurrencySwitcherSelectedIds);
	};

	// we are loading.
	if (loading) {
		return (
			<>
				<ScSkeleton style={{ width: '100%', marginBottom: 15 }} />
				<ScSkeleton style={{ width: '60%' }} />
			</>
		);
	}

	return (
		<>
			{!!scData?.is_block_theme ? (
				<>Notice on how to add currency switcher to your site.</>
			) : (
				<>
					<div>
						<ScFormControl
							label={__('Add to Menus', 'surecart')}
							help={__(
								'Select the menu(s) where the currency switcher will appear.',
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
								{(currencySwitcherSelectedIds || []).map(
									(menuId) => {
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
													removeCurrencySwitcher(
														menuId
													)
												}
											>
												{menu.name}
											</ScTag>
										);
									}
								)}
								<ScDropdown position="bottom-right">
									<ScButton
										type="default"
										size="small"
										slot="trigger"
									>
										<ScIcon name="plus" slot="prefix" />
										{__('Add Menu', 'surecart')}
									</ScButton>
									<ScMenu>
										{menus?.map((item) => {
											const checked = (
												currencySwitcherSelectedIds ||
												[]
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
															? addCurrencySwitcher(
																	item.id
															  )
															: removeCurrencySwitcher(
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
					{!!currencySwitcherSelectedIds?.length && (
						<div>
							<ScSelect
								label={__('Position', 'surecart')}
								placeholder={__('Select Position', 'surecart')}
								value={currencySwitcherAlignment}
								onScChange={(e) =>
									setCurrencySwitcherAlignment(e.target.value)
								}
								unselect={false}
								help={__(
									'Select the currency switcher position, i.e. left or right, where it will look best with your website design.',
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
					)}

					<ScDivider>{__('Or', 'surecart')}</ScDivider>

					<ScInput
						label={__('Shortcode', 'surecart')}
						value={`[surecart_currency_switcher]`}
						readonly
					>
						{window.location.protocol === 'https:' && (
							<ScButton
								ref={ref}
								size="small"
								slot="suffix"
								aria-label={__('Copy Shortcode', 'surecart')}
							>
								<ScIcon name="clipboard" slot="prefix" />
								{__('Copy', 'surecart')}
							</ScButton>
						)}
					</ScInput>
				</>
			)}
		</>
	);
};
