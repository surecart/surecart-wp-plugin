import { ScButton, ScDrawer } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

export default () => {
	const [drawer, setDrawer] = useState(false);
	return (
		<div>
			<ScButton onClick={() => setDrawer(true)}>
				{__('Instant Buy Page', 'surecart')}
			</ScButton>
			<ScDrawer open={drawer} onScRequestClose={() => setDrawer(false)}>
				asdf
			</ScDrawer>
		</div>
	);
};
