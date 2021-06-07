/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CeChoices, CeChoice } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes, isSelected } ) => {
	const { default: defaultChoice, choices, type } = attributes;

	return (
		<CeChoices className={ className }>
			<CeChoice name="plan" type={ type } required>
				Gold Plan
				<span slot="description">$9.99, then $49.99 per month</span>
			</CeChoice>
			<CeChoice name="plan" type={ type } required>
				Silver Plan
				<span slot="description">$39.99 per month</span>
			</CeChoice>
		</CeChoices>
	);
};
