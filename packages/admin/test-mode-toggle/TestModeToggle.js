/** @jsx jsx */
/**
 * External dependencies
 */
import { css, jsx } from '@emotion/core';

/**
 * Internal dependencies
 */
import { ScSwitch } from '@surecart/components-react';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { getQueryArgs, addQueryArgs } from '@wordpress/url';

export default () => {
	const { live_mode } = getQueryArgs(window.location.href);

	const onSwitchToggle = (e) => {
		const checked = e.target.checked;

		window.location.href = addQueryArgs(window.location.href, {
			live_mode: checked ? 'false' : 'true',
		});
	};

	return (
		<ScSwitch checked={live_mode === 'false'} onScChange={onSwitchToggle}>
			<span
				css={css`
					white-space: nowrap;
				`}
			>
				{__('Test Mode', 'surecart')}
			</span>
		</ScSwitch>
	);
};
