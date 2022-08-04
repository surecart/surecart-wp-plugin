import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';

export default ({ value = 'day', setValue }) => {
	const reportOrderByList = {
		day: __('Daily', 'surecart'),
		week: __('Weekly', 'surecart'),
		month: __('Monthly', 'surecart'),
		year: __('Yearly', 'surecart'),
	};

	return (
		<ScDropdown placement="bottom-end">
			<ScButton slot="trigger" caret>
				{reportOrderByList[value]}
			</ScButton>
			<ScMenu>
				<ScMenuItem onClick={() => setValue('day')}>
					{__('Daily', 'surecart')}
				</ScMenuItem>
				<ScMenuItem onClick={() => setValue('week')}>
					{__('Weekly', 'surecart')}
				</ScMenuItem>
				<ScMenuItem onClick={() => setValue('month')}>
					{__('Monthly', 'surecart')}
				</ScMenuItem>
				<ScMenuItem onClick={() => setValue('year')}>
					{__('Yearly', 'surecart')}
				</ScMenuItem>
			</ScMenu>
		</ScDropdown>
	);
};
