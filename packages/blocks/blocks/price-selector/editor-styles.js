/**
 * External dependencies
 */
import { css } from '@emotion/react';

export const Wrapper = css`
	.block-editor-button-block-appender {
		box-sizing: border-box;
	}
	.editor-styles-wrapper {
		ce-price-choices {
			transition: border 0.2s ease, padding 0.2s ease;

			ce-price-choice[data-block] {
				margin: 0;
			}

			&.has-child-selected,
			&.is-selected {
				border-radius: 4px;
				border: 1px dashed rgba( 0, 0, 0, 0.35 );
				padding: 2em;

				ce-price-choice[data-block] {
					margin-top: 15px !important;
					margin-bottom: 15px !important;
				}
			}
		}
	}
`;

export default Wrapper;
