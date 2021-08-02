/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { TextControl } = wp.components;

export default ( props ) => {
	return (
		<TextControl
			css={ css`
				.components-base-control__field
					.components-text-control__input {
					padding: 10px;
				}
			` }
			{ ...props }
		/>
	);
};
