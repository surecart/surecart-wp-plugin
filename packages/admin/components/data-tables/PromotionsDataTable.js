/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import DataTable from '../DataTable';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';

export default ({
	data,
	isLoading,
	title,
	error,
	isFetching,
	page,
	setPage,
	pagination,
	columns,
	footer,
	empty,
	setModal,
	setPromotion,
	updatePromotion,
	onArchive,
	...props
}) => {
	return (
		<DataTable
			title={title || __('Promotion Codes', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map((promotion) => {
					const {
						code,
						affiliation,
						customer,
						times_redeemed,
						max_redemptions,
						archived,
					} = promotion;
					return {
						code: (
							<ScInput
								className="sc-promotion-code"
								attribute="name"
								value={code}
								onScInput={(e) => {
									console.log('promotion', promotion);
									setPromotion(promotion);
									setTimeout(() => {
										updatePromotion({
											code: e.target.value,
										});
									}, 2000);
								}}
							/>
						),
						times_redeemed: (
							<ScTag>
								{times_redeemed}
								{max_redemptions
									? ` / ${max_redemptions}`
									: ''}{' '}
								{__('Uses', 'surecart')}
							</ScTag>
						),
						customer: customer?.id ? (
							<a
								href={addQueryArgs('admin.php', {
									page: 'sc-customers',
									action: 'edit',
									id: customer?.id,
								})}
							>
								{customer?.name}
							</a>
						) : (
							'-'
						),
						affiliation: affiliation?.id ? (
							<a
								href={addQueryArgs('admin.php', {
									page: 'sc-affiliates',
									action: 'edit',
									id: affiliation?.id,
								})}
							>
								{affiliation?.first_name +
									' ' +
									affiliation?.last_name}
							</a>
						) : (
							'-'
						),
						action: (
							<>
								{!!archived && (
									<ScTag type="warning">
										{__('Archived', 'surecart')}
									</ScTag>
								)}

								<ScDropdown position="bottom-right">
									<ScButton type="text" slot="trigger" circle>
										<ScIcon name="more-horizontal" />
									</ScButton>
									<ScMenu>
										<ScMenuItem
											onClick={() => {
												setPromotion(promotion);
												setModal('edit');
											}}
										>
											<ScIcon
												slot="prefix"
												name="edit-2"
												style={{
													opacity: 0.5,
												}}
											/>
											{__('Edit', 'surecart')}
										</ScMenuItem>
										<ScMenuItem
											onClick={() => {
												setPromotion(promotion);
												onArchive();
											}}
										>
											<ScIcon
												slot="prefix"
												name="archive"
												style={{
													opacity: 0.5,
												}}
											/>
											{archived
												? __('Un-Archive', 'surecart')
												: __('Archive', 'surecart')}
										</ScMenuItem>
										<ScMenuItem
											onClick={() => {
												setPromotion(promotion);
												setModal('delete');
											}}
										>
											<ScIcon
												slot="prefix"
												name="trash"
												style={{
													opacity: 0.5,
												}}
											/>
											{__('Delete', 'surecart')}
										</ScMenuItem>
									</ScMenu>
								</ScDropdown>
							</>
						),
					};
				})}
			loading={isLoading}
			updating={isFetching}
			footer={!!footer && footer}
			{...props}
		/>
	);
};
