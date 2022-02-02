import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	CeTag,
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/components-react';
import {
	Icon,
	box,
	trash,
	addSubmenu,
	moreHorizontalMobile,
} from '@wordpress/icons';

import ToggleHeader from '../../../components/ToggleHeader';
import { translate } from '../../../util';

export default ({
	isOpen,
	setIsOpen,
	className,
	price,
	onArchive,
	onDuplicate,
	onDelete,
}) => {
	/** Header name */
	const headerName = () => {
		if (!price?.name) {
			return __('Pricing Details', 'checkout_engine');
		}

		if (isOpen) {
			return price?.name;
		}

		return (
			<Fragment>
				{price?.name} -{' '}
				<ce-format-number
					type="currency"
					currency={price?.currency || ceData.currency_code}
					value={price?.amount}
				/>
				{translate(price?.recurring_interval) || ''}
			</Fragment>
		);
	};

	/** Action buttons */
	const buttons = (
		<div>
			{price?.archived && (
				<CeTag type="warning">
					{__('Archived', 'checkout_engine')}
				</CeTag>
			)}
			<CeDropdown slot="suffix" position="bottom-right">
				<CeButton type="text" slot="trigger" circle>
					<Icon icon={moreHorizontalMobile} />
				</CeButton>
				<CeMenu>
					<CeMenuItem onClick={onDuplicate}>
						<Icon
							slot="prefix"
							style={{
								opacity: 0.5,
							}}
							icon={addSubmenu}
							size={20}
						/>
						{__('Duplicate', 'checkout_engine')}
					</CeMenuItem>
					{price?.id && (
						<CeMenuItem onClick={onArchive}>
							<Icon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								icon={box}
								size={20}
							/>
							{price?.archived
								? __('Un-Archive', 'checkout_engine')
								: __('Archive', 'checkout_engine')}
						</CeMenuItem>
					)}
					<CeMenuItem onClick={onDelete}>
						<Icon
							slot="prefix"
							style={{
								opacity: 0.5,
							}}
							icon={trash}
							size={20}
						/>
						{__('Delete', 'checkout_engine')}
					</CeMenuItem>
				</CeMenu>
			</CeDropdown>
		</div>
	);

	return (
		<ToggleHeader
			className={className}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			buttons={buttons}
			type={price.archived ? 'warning' : ''}
		>
			{headerName()}
		</ToggleHeader>
	);
};
