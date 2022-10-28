import {
	ScDropdown,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default () => {
	const [interval, setInterval] = useState();
	return (
		<ScInput type="number">
			<ScDropdown slot="suffix" placement="bottom-end">
				<div>Hours</div>
				<ScMenu>
					<ScMenuItem>{__('Minutes', 'surecart')}</ScMenuItem>
					<ScMenuItem>{__('Hours', 'surecart')}</ScMenuItem>
					<ScMenuItem>{__('Days', 'surecart')}</ScMenuItem>
					<ScMenuItem>{__('Weeks', 'surecart')}</ScMenuItem>
				</ScMenu>
			</ScDropdown>
		</ScInput>
	);
};
