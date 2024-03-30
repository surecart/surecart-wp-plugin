/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import {
	useBlockProps,
	__experimentalGetElementClassName,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
} from '@wordpress/block-editor';
import { isKeyboardEvent } from '@wordpress/keycodes';

export default (props) => {
	const { attributes } = props;
	const { width } = attributes;

	function onKeyDown(event) {
		if (isKeyboardEvent.primary(event, 'k')) {
			startEditing(event);
		} else if (isKeyboardEvent.primaryShift(event, 'k')) {
			unlink();
			richTextRef.current?.focus();
		}
	}

	const ref = useRef();
	const richTextRef = useRef();
	const blockProps = useBlockProps({
		ref,
		onKeyDown,
	});

	return (
		<>
			<div
				{...blockProps}
				className={classnames(blockProps.className, {
					'wp-block-button': true,
					'sc-block-button': true,
					[`has-custom-width sc-block-button__width-${width}`]: width,
					[`has-custom-font-size`]: blockProps.style.fontSize,
				})}
			>
				<button>Open Cart Drawer</button>
			</div>
		</>
	);
};
