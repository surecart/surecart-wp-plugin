/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	InspectorControls,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import {
	PanelBody,
	Placeholder,
	ResizableBox,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

export default ({
	attributes: { width, height, maxWidth, maxHeight, isLinkToHome },
	setAttributes,
}) => {
	const [{ naturalWidth, naturalHeight }, setNaturalSize] = useState({});

	const data = useSelect((select) => {
		return select(coreStore).getEntityRecord('surecart', 'store', 'brand');
	});

	if (!data?.logo_url) {
		return (
			<Placeholder
				title="Surecart Store Logo"
				style={{ width: maxWidth, height: maxHeight }}
			>
				<p>Please wait while we fetch your store logo.</p>
			</Placeholder>
		);
	}

	const img = (
		<img
			src={data?.logo_url}
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
	const isPortrait = naturalWidth < naturalHeight;
	const isLandscape = naturalHeight < naturalWidth;

	const minWidth = isPortrait ? MIN_SIZE : Math.ceil(MIN_SIZE * ratio);
	const minHeight = isLandscape ? MIN_SIZE : Math.ceil(MIN_SIZE / ratio);

	let currentWidth;
	let currentHeight;

	if (isPortrait) {
		currentHeight = height || maxHeight;
		currentWidth = currentHeight * ratio;
	}

	if (isLandscape) {
		currentWidth = width || maxWidth;
		currentHeight = currentWidth / ratio;
	}

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
