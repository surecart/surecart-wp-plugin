/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	__experimentalLinkControl as LinkControl,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	TextControl,
	Popover,
	Button,
	SearchControl,
	ProgressBar,
	ExternalLink,
} from '@wordpress/components';
import {
	useState,
	useMemo,
	useEffect,
	createInterpolateElement,
} from '@wordpress/element';
import { link, linkOff } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';
import Icon from './Icon';
import { getAvailableIcons } from './icon-list';

export default function Edit({ attributes, setAttributes }) {
	const {
		icon_name,
		size,
		stroke_width,
		link_url,
		link_target,
		link_rel,
		nofollow,
	} = attributes;

	const [isEditingURL, setIsEditingURL] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [iconList, setIconList] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getAvailableIcons()
			.then((icons) => {
				setIconList(icons);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const filteredIcons = useMemo(() => {
		if (!searchTerm) return iconList;
		return iconList.filter((icon) =>
			icon.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [searchTerm, iconList]);

	const blockProps = useBlockProps({
		className: 'wp-block-surecart-icon',
	});

	return (
		<>
			<BlockControls group="block">
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
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Search Icons', 'surecart')}
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder={__('Search for an icon...', 'surecart')}
					/>

					<div className="surecart-icon-picker">
						{loading ? (
							<ProgressBar />
						) : (
							<div className="surecart-icon-picker_items">
								{(filteredIcons || []).map((icon) => (
									<Icon
										onClick={() =>
											setAttributes({
												icon_name: icon,
											})
										}
										selected={icon_name === icon}
										title={icon}
										key={icon}
										name={icon}
									/>
								))}
							</div>
						)}

						{!loading && !filteredIcons?.length && (
							<p
								style={{
									textAlign: 'center',
									color: '#666',
									fontSize: '12px',
									margin: 0,
								}}
							>
								{__(
									'No icons found. Try a different search.',
									'surecart'
								)}
							</p>
						)}
					</div>

					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Size (px)', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={16}
						max={200}
						step={1}
					/>

					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Stroke Width', 'surecart')}
						value={stroke_width}
						onChange={(value) =>
							setAttributes({ stroke_width: value })
						}
						min={0.25}
						max={10}
						step={0.25}
					/>

					{link_url && (
						<TextControl
							__next40pxDefaultSize
							label={__('Link relation')}
							help={createInterpolateElement(
								__(
									'The <a>Link Relation</a> attribute defines the relationship between a linked resource and the current document.',
									'surecart'
								),
								{
									a: (
										<ExternalLink href="https://developer.mozilla.org/docs/Web/HTML/Attributes/rel" />
									),
								}
							)}
							value={link_rel || ''}
							onChange={(link_rel) => setAttributes({ link_rel })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<span
					style={{
						width: `${size}px`,
						height: `${size}px`,
						display: 'inline-block',
					}}
				>
					<ScIcon
						name={icon_name}
						width={size}
						height={size}
						strokeWidth={stroke_width}
					/>
				</span>
			</div>

			{isEditingURL && (
				<Popover
					placement="bottom"
					onClose={() => setIsEditingURL(false)}
				>
					<LinkControl
						settings={[
							...LinkControl.DEFAULT_LINK_SETTINGS,
							{
								id: 'nofollow',
								title: __('Mark as nofollow'),
							},
						]}
						value={{
							url: link_url,
							opensInNewTab: link_target === '_blank',
							nofollow,
						}}
						onChange={({ url, opensInNewTab, nofollow }) => {
							setAttributes({
								link_url: url,
								link_target: opensInNewTab ? '_blank' : '_self',
								nofollow,
							});
						}}
						onRemove={() => {
							setAttributes({
								link_url: undefined,
								link_target: '_self',
								link_rel: undefined,
								nofollow: false,
							});
							setIsEditingURL(false);
						}}
					/>
				</Popover>
			)}
		</>
	);
}
