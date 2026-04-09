export const WrapperClassName = 'sc-price-selector-wrapper';

export const WrapperStyles = `
	.${WrapperClassName} .block-editor-button-block-appender {
		box-sizing: border-box;
	}
	.${WrapperClassName} .editor-styles-wrapper sc-price-choices {
		transition: border 0.2s ease, padding 0.2s ease;
	}
	.${WrapperClassName} .editor-styles-wrapper sc-price-choices sc-price-choice.wp-block {
		margin: 0 !important;
	}
	.${WrapperClassName} .editor-styles-wrapper sc-price-choices.has-child-selected,
	.${WrapperClassName} .editor-styles-wrapper sc-price-choices.is-selected {
		border-radius: 4px;
		border: 1px dashed rgba(0, 0, 0, 0.35);
		padding: 2em;
	}
	.${WrapperClassName} .editor-styles-wrapper sc-price-choices.has-child-selected sc-price-choice[data-block],
	.${WrapperClassName} .editor-styles-wrapper sc-price-choices.is-selected sc-price-choice[data-block] {
		margin-top: 15px !important;
		margin-bottom: 15px !important;
	}
`;

export default WrapperStyles;
