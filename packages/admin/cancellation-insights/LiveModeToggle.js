import { ScSwitch } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getQueryArg, addQueryArgs, removeQueryArgs } from '@wordpress/url';

export default () => {
	const liveMode = getQueryArg(window.location.href, 'live_mode') !== 'false';
	const [loading, setLoading] = useState(false);
	return (
		<ScSwitch
			checked={!liveMode}
			disabled={loading}
			onScChange={(e) => {
				if (e.target.checked) {
					window.location.assign(
						addQueryArgs(window.location.href, {
							live_mode: false,
						})
					);
				} else {
					window.location.assign(
						removeQueryArgs(window.location.href, 'live_mode')
					);
				}
				setLoading(true);
			}}
			reversed
		>
			{__('Test Mode', 'surecart')}
		</ScSwitch>
	);
};
