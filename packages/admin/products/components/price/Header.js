import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	ScTag,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { Icon, box, trash, moreHorizontalMobile } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';

import ToggleHeader from '../../../components/ToggleHeader';
import { translateInterval } from '../../../util/translations';
import Copy from './Copy';
import useCurrentPage from '../../../mixins/useCurrentPage';

export default ({
	isOpen,
	setIsOpen,
	className,
	price,
	onArchive,
	collapsible,
	onDelete,
}) => {
	const { product } = useCurrentPage('product');
	/** Header name */
	const headerName = () => {
		return (
			<Fragment>
				<sc-format-number
					type="currency"
					currency={price?.currency || scData.currency_code}
					value={price?.amount}
				/>
				{!!product?.recurring &&
					translateInterval(
						price?.recurring_interval_count,
						price?.recurring_interval,
						' /',
						''
					)}
			</Fragment>
		);
	};

	const renderDropdown = () => {
		if (!onArchive && !onDelete) {
			return null;
		}

		return (
			<ScDropdown slot="suffix" position="bottom-right">
				<ScButton type="text" slot="trigger" circle>
					<Icon icon={moreHorizontalMobile} />
				</ScButton>
				<ScMenu>
					{price?.id && !!onArchive && (
						<ScMenuItem onClick={onArchive}>
							<Icon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								icon={box}
								size={20}
							/>
							{price?.archived
								? __('Un-Archive', 'surecart')
								: __('Archive', 'surecart')}
						</ScMenuItem>
					)}
					{!!onDelete && (
						<ScMenuItem onClick={onDelete}>
							<Icon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								icon={trash}
								size={20}
							/>
							{__('Delete', 'surecart')}
						</ScMenuItem>
					)}
				</ScMenu>
			</ScDropdown>
		);
	};

	/** Action buttons */
	const buttons = (
		<div>
			{!!scData?.checkout_page_url && !!price?.id && !price?.ad_hoc && (
				<Copy
					className={'sc-price-copy'}
					url={addQueryArgs(scData?.checkout_page_url, {
						line_items: [{ price_id: price?.id, quantity: 1 }],
					})}
				></Copy>
			)}

			{price?.archived && (
				<ScTag type="warning">{__('Archived', 'surecart')}</ScTag>
			)}
			{renderDropdown()}
		</div>
	);

	return (
		<ToggleHeader
			collapsible={collapsible}
			className={className}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			buttons={buttons}
			type={price?.archived ? 'warning' : ''}
		>
			{headerName()}
		</ToggleHeader>
	);
};
