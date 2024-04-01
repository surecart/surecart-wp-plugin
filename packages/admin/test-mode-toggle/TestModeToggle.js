/** @jsx jsx */
/**
 * External dependencies
 */
import { css, jsx } from '@emotion/core';

/**
 * Internal dependencies
 */
import { ScBlockUi, ScSwitch } from '@surecart/components-react';

/**
 * Wordpress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getQueryArgs, addQueryArgs } from '@wordpress/url';

export default () => {
	const { live_mode } = getQueryArgs(window.location.href);
	const [busy, setBusy] = useState(false);

	const onSwitchToggle = (e) => {
		const checked = e.target.checked;
		setBusy(true);

		window.location.href = addQueryArgs(window.location.href, {
			live_mode: checked ? 'false' : 'true',
		});
	};

	return (
		<div
			css={css`
				position: relative;
			`}
		>
			<ScSwitch
				checked={live_mode === 'false'}
				onScChange={onSwitchToggle}
			>
				<span
					css={css`
						white-space: nowrap;
					`}
				>
					{__('Test Mode', 'surecart')}
				</span>
			</ScSwitch>
			{busy && <ScBlockUi />}
		</div>
	);
};
