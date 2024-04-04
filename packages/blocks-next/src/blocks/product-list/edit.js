import { __ } from '@wordpress/i18n';
import {
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
} from '@wordpress/components';

import Settings from './settings';
import Render from './render';
export default function ProductListEdit(props) {
	return (
		<>
			<Settings {...props} />
			<Render {...props} />
		</>
	);
}
