/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	__experimentalLinkControl as LinkControl,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
	Popover,
	Button,
	SearchControl,
} from '@wordpress/components';
import { useState, useMemo } from '@wordpress/element';
import { link, linkOff } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';
import { getAvailableIcons } from './icon-list';

const ICON_LIST = getAvailableIcons();

export default function Edit({ attributes, setAttributes }) {
	const {
		icon_name,
		size,
		width,
		height,
		stroke_width,
		alignment,
		link_url,
		link_target,
		link_rel,
	} = attributes;

	const [isEditingURL, setIsEditingURL] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const blockProps = useBlockProps({
		className: 'wp-block-surecart-icon',
		style: {
			textAlign: alignment,
		},
	});

	const filteredIcons = useMemo(() => {
		if (!searchTerm) return ICON_LIST;
		return ICON_LIST.filter((icon) =>
			icon.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [searchTerm]);

	const iconStyle = {
		width: width || `${size}px`,
		height: height || `${size}px`,
		display: 'inline-block',
		strokeWidth: stroke_width,
	};

	const IconContent = () => (
		<div style={iconStyle}>
			<ScIcon
				name={icon_name}
				width={size}
				height={size}
				strokeWidth={stroke_width}
			/>
		</div>
	);

	const IconDisplay = () => {
		if (link_url) {
			return (
				<a
					href={link_url}
					target={link_target}
					rel={link_rel}
					onClick={(e) => e.preventDefault()}
				>
					<IconContent />
				</a>
			);
		}
		return <IconContent />;
	};

	return (
		<>
			<BlockControls group="block">
				<AlignmentToolbar
					value={alignment}
					onChange={(newAlignment) =>
						setAttributes({ alignment: newAlignment })
					}
				/>
				<Button
					icon={link_url ? link : linkOff}
					label={
						link_url
							? __('Edit link', 'surecart')
							: __('Add link', 'surecart')
					}
					onClick={() => setIsEditingURL(true)}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody
					title={__('Icon Settings', 'surecart')}
					initialOpen={true}
				>
					<SearchControl
						label={__('Search Icons', 'surecart')}
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder={__('Search for an icon...', 'surecart')}
					/>

					<div className="surecart-icon-picker">
						{filteredIcons.slice(0, 100).map((icon) => (
							<button
								key={icon}
								className={`surecart-icon-picker__item ${
									icon_name === icon ? 'is-selected' : ''
								}`}
								onClick={() =>
									setAttributes({ icon_name: icon })
								}
								title={icon}
							>
								<ScIcon name={icon} />
							</button>
						))}
					</div>

					{filteredIcons.length > 100 && (
						<p
							style={{
								textAlign: 'center',
								color: '#666',
								fontSize: '12px',
								marginTop: '10px',
							}}
						>
							{__('Showing 100 of ', 'surecart')}
							{filteredIcons.length}
							{__(
								' icons. Refine your search to see more.',
								'surecart'
							)}
						</p>
					)}

					<RangeControl
						label={__('Size (px)', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={16}
						max={200}
						step={1}
					/>

					<RangeControl
						label={__('Stroke Width', 'surecart')}
						value={stroke_width}
						onChange={(value) =>
							setAttributes({ stroke_width: value })
						}
						min={1}
						max={5}
						step={0.5}
					/>

					<TextControl
						label={__('Custom Width', 'surecart')}
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						placeholder={__('e.g., 100px, 50%, auto', 'surecart')}
						help={__(
							'Leave empty to use size setting.',
							'surecart'
						)}
					/>

					<TextControl
						label={__('Custom Height', 'surecart')}
						value={height}
						onChange={(value) => setAttributes({ height: value })}
						placeholder={__('e.g., 100px, 50%, auto', 'surecart')}
						help={__(
							'Leave empty to use size setting.',
							'surecart'
						)}
					/>
				</PanelBody>

				{link_url && (
					<PanelBody title={__('Link Settings', 'surecart')}>
						<ToggleControl
							label={__('Open in new tab', 'surecart')}
							checked={link_target === '_blank'}
							onChange={(value) =>
								setAttributes({
									link_target: value ? '_blank' : '_self',
								})
							}
						/>
						<TextControl
							label={__('Link Rel', 'surecart')}
							value={link_rel}
							onChange={(value) =>
								setAttributes({ link_rel: value })
							}
							placeholder="nofollow"
						/>
					</PanelBody>
				)}
			</InspectorControls>

			<div {...blockProps}>
				<IconDisplay />
			</div>

			{isEditingURL && (
				<Popover
					placement="bottom"
					onClose={() => setIsEditingURL(false)}
				>
					<LinkControl
						value={{
							url: link_url,
							opensInNewTab: link_target === '_blank',
						}}
						onChange={({ url, opensInNewTab }) => {
							setAttributes({
								link_url: url,
								link_target: opensInNewTab ? '_blank' : '_self',
							});
						}}
						onRemove={() => {
							setAttributes({
								link_url: undefined,
								link_target: '_self',
								link_rel: undefined,
							});
							setIsEditingURL(false);
						}}
					/>
				</Popover>
			)}
		</>
	);
}
