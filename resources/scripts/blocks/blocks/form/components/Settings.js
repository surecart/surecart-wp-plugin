/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

export default ( { attributes, setAttributes } ) => {
	return (
		<div
			css={ css`
				font-size: 13px;
			` }
		>
			<p>Adjust settings</p>
		</div>
	);
};
