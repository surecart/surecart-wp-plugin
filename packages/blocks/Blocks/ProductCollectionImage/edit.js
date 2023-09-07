/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import DimensionControls from './dimension-controls';

export default ({ clientId, attributes, setAttributes }) => {
	const { width, height, aspectRatio } = attributes;
	const blockProps = useBlockProps({
		style: { width, height, aspectRatio },
	});
	const borderProps = useBorderProps(attributes);

	const placeholder = (content) => {
		return (
			<Placeholder
				className={classnames(
					'block-editor-media-placeholder',
					borderProps.className
				)}
				withIllustration={true}
				style={{
					height: !!aspectRatio && '100%',
					width: !!aspectRatio && '100%',
					...borderProps.style,
				}}
			>
				{content}
			</Placeholder>
		);
	};

	return (
		<>
			<DimensionControls
				clientId={clientId}
				attributes={attributes}
				setAttributes={setAttributes}
				imageSizeOptions={[]}
			/>

			<div {...blockProps}>{placeholder()}</div>
		</>
	);
};
