import { __, sprintf } from '@wordpress/i18n';
import { ScSwitch } from '@surecart/components-react';

export default ({ show, setShow, prices }) => {
	if (!prices?.length) {
		return null;
	}

	return (
		<ScSwitch
			checked={!!show}
			onClick={(e) => {
				e.preventDefault();
				setShow(!show);
			}}
		>
			{sprintf(
				!show
					? __('Show %d Archived Prices', 'surecart')
					: __('Hide %d Archived Prices', 'surecart'),
				prices?.length
			)}
		</ScSwitch>
	);
};
