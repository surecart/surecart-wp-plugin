import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	ScTag,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import {
	Icon,
	box,
	trash,
	addSubmenu,
	moreHorizontalMobile,
} from '@wordpress/icons';

import ToggleHeader from '../../../components/ToggleHeader';
import { translate } from '../../../util';
import { translateInterval } from '../../../util/translations';

export default ({
	isOpen,
	setIsOpen,
	className,
	price,
	onArchive,
	onDelete,
}) => {
	/** Header name */
	const headerName = () => {
		return (
			<Fragment>
				<sc-format-number
					type="currency"
					currency={price?.currency || ceData.currency_code}
					value={price?.amount}
				/>
				{translateInterval(
					price?.recurring_interval_count,
					price?.recurring_interval,
					' /',
					''
				)}
			</Fragment>
		);
	};

	/** Action buttons */
	const buttons = (
		<div>
			{price?.archived && (
				<ScTag type="warning">{__('Archived', 'surecart')}</ScTag>
			)}
			<ScDropdown slot="suffix" position="bottom-right">
				<ScButton type="text" slot="trigger" circle>
					<Icon icon={moreHorizontalMobile} />
				</ScButton>
				<ScMenu>
					{price?.id && (
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
				</ScMenu>
			</ScDropdown>
		</div>
	);

	return (
		<ToggleHeader
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
