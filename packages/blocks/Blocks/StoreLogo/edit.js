/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import {
	PanelBody,
	ResizableBox,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

export default ({
	attributes: { width, height, maxWidth, maxHeight, isLinkToHome },
	setAttributes,
}) => {
	const [{ naturalWidth, naturalHeight }, setNaturalSize] = useState({});

	const img = (
		<img
			src={
				'https://fastly.picsum.photos/id/802/200/350.jpg?hmac=XD10XkzaiSy1IgMbEXdbHFpxeKBFzizbbkaF3d5ZsZU'
			}
			style={{ width: '100%' }}
			onLoad={(event) => {
				setNaturalSize({
					naturalWidth: event.target.naturalWidth,
					naturalHeight: event.target.naturalHeight,
				});
			}}
		/>
	);

	let imgWrapper = img;

	if (isLinkToHome) {
		imgWrapper = (
			<a
				href={'/'}
				rel="home"
				onClick={(event) => event.preventDefault()}
			>
				{img}
			</a>
		);
	}

	const MIN_SIZE = 20;
	const ratio = naturalWidth / naturalHeight;

	const minWidth =
		naturalWidth < naturalHeight ? MIN_SIZE : Math.ceil(MIN_SIZE * ratio);
	const minHeight =
		naturalHeight < naturalWidth ? MIN_SIZE : Math.ceil(MIN_SIZE / ratio);

	const currentWidth = width || maxWidth;
	const currentHeight = height || maxHeight;

	console.log('____', ratio);
	console.log('____', naturalWidth, maxWidth, currentWidth);
	console.log('____', naturalHeight, maxHeight, currentHeight);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Maximum width', 'surecart')}
						value={maxWidth}
						onChange={(newWidth) =>
							setAttributes({
								maxWidth: parseInt(newWidth, 10),
							})
						}
					/>
					<TextControl
						label={__('Maximum height', 'surecart')}
						value={maxHeight}
						onChange={(newHeight) =>
							setAttributes({
								maxHeight: parseInt(newHeight, 10),
							})
						}
					/>
					<ToggleControl
						label={__('Link image to home')}
						onChange={() =>
							setAttributes({ isLinkToHome: !isLinkToHome })
						}
						checked={isLinkToHome}
					/>
				</PanelBody>
			</InspectorControls>

			<ResizableBox
				size={{
					width: currentWidth,
					height: currentHeight,
				}}
				minWidth={minWidth}
				maxWidth={maxWidth}
				minHeight={minHeight}
				maxHeight={maxHeight}
				lockAspectRatio
				enable={{
					top: false,
					right: true,
					bottom: true,
					left: false,
				}}
				onResizeStop={(event, direction, elt, delta) => {
					setAttributes({
						width: parseInt(currentWidth + delta.width, 10),
						height: parseInt(currentHeight + delta.height, 10),
					});
				}}
			>
				{imgWrapper}
			</ResizableBox>
		</Fragment>
	);
};
