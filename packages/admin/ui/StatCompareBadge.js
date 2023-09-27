/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScIcon, ScTag } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ loading, previous, current, reverse = false }) => {
	if (loading) return null;

	let percentage = Math.abs(((current - previous) / (previous || 1)) * 100.0);
	if (Math.abs(previous) === 0 && Math.abs(current) !== 0) {
		percentage = 100;
	}

	percentage =
		percentage.toLocaleString('fullwide', { maximumFractionDigits: 0 }) +
		'%';

	let type, icon;
	if (previous === current) {
		type = 'default';
		icon = 'bar-chart';
	} else {
		if (reverse) {
			type = previous < current ? 'danger' : 'success';
		} else {
			type = previous < current ? 'success' : 'danger';
		}
		icon = previous < current ? 'arrow-up-right' : 'arrow-down-right';
	}

	return (
		<ScTag type={type}>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 0.3em;
				`}
			>
				<ScIcon name={icon} />
				{percentage}
			</div>
		</ScTag>
	);
};
