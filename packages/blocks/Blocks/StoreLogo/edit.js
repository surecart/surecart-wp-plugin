/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { siteLogo as icon } from '@wordpress/icons';
import {
	store as blockEditorStore,
	InspectorControls,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import {
	Button,
	PanelBody,
	Placeholder,
	RangeControl,
	ResizableBox,
	Spinner,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import Logo from '../../../admin/settings/brand/Logo';

export default ({
	attributes: { width, height, maxWidth, maxHeight, isLinkToHome },
	setAttributes,
	isSelected,
}) => {
	const [{ naturalWidth, naturalHeight }, setNaturalSize] = useState({});
	const { editEntityRecord } = useDispatch(coreStore);
	const editBrand = (data) =>
		editEntityRecord('surecart', 'store', 'brand', data);

	const { imageEditing, allowedMaxWidth } = useSelect((select) => {
		const settings = select(blockEditorStore).getSettings();
		return {
			imageEditing: settings.imageEditing,
			allowedMaxWidth: settings.maxWidth,
		};
	}, []);

	// With the current implementation of ResizableBox, an image needs an
	// explicit pixel value for the max-width. In absence of being able to
	// set the content-width, this max-width is currently dictated by the
	// vanilla editor style. The following variable adds a buffer to this
	// vanilla style, so 3rd party themes have some wiggleroom. This does,
	// in most cases, allow you to scale the image beyond the width of the
	// main column, though not infinitely.
	// @todo It would be good to revisit this once a content-width variable
	// becomes available.
	const maxWidthBuffer = allowedMaxWidth * 2.5;

	// Set the default width to a responsible size.
	const defaultWidth = 120;

	const { data, loading } = useSelect((select) => {
		return {
			data: select(coreStore).getEditedEntityRecord(
				'surecart',
				'store',
				'brand'
			),
			loading: select(coreStore).isResolving('getEditedEntityRecord', [
				'surecart',
				'store',
				'brand',
			]),
		};
	});

	if (loading) {
		return <Placeholder preview={<Spinner />} withIllustration={true} />;
	}

	if (!data?.logo_url && imageEditing) {
		return (
			<Placeholder
				label={__('Store Logo', 'surecart')}
				icon={icon}
				instructions={__(
					'This is also displayed on your invoices, receipts and emails.',
					'surecart'
				)}
				isColumnLayout
			>
				<Logo brand={data} editBrand={editBrand} />
			</Placeholder>
		);
	}

	const img = (
		<img
			src={data?.logo_url}
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'contain',
				objectPosition: 'left',
			}}
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

	// if (isPortrait) {
	// 	currentHeight = height || maxHeight;
	// 	currentWidth = currentHeight * ratio;
	// }

	// if (isLandscape) {
	currentWidth = width || defaultWidth;
	currentHeight = currentWidth / ratio;
	// }

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<RangeControl
						__nextHasNoMarginBottom
						label={__('Width', 'surecart')}
						value={width}
						min={10}
						max={maxWidthBuffer}
						initialPosition={Math.min(defaultWidth, maxWidthBuffer)}
						onChange={(newWidth) =>
							setAttributes({
								width: parseInt(newWidth, 10),
							})
						}
					/>

					<ToggleControl
						label={__('Set a maximum height', 'surecart')}
						onChange={() =>
							setAttributes({ maxHeight: maxHeight ? null : 100 })
						}
						checked={maxHeight !== null}
					/>

					{maxHeight !== null && (
						<RangeControl
							__nextHasNoMarginBottom
							label={__('Maximum height', 'surecart')}
							value={maxHeight}
							min={10}
							max={maxWidthBuffer}
							initialPosition={Math.min(
								defaultWidth,
								maxWidthBuffer
							)}
							onChange={(newHeight) =>
								setAttributes({
									maxHeight: parseInt(newHeight, 10),
								})
							}
						/>
					)}

					<ToggleControl
						label={__('Link image to home', 'surecart')}
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
				showHandle={isSelected}
				minWidth={minWidth}
				maxWidth={maxWidthBuffer}
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
						maxHeight: parseInt(currentHeight + delta.height, 10),
					});
				}}
			>
				{imgWrapper}
			</ResizableBox>
		</Fragment>
	);
};
