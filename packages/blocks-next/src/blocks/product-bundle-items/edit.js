/**
 * WordPress dependencies
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

export default ({ attributes, setAttributes, context: { postId } }) => {
	const blockProps = useBlockProps();

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	// Get bundle items from the initial price.
	const initialPrice = (product?.prices?.data || []).find((p) => !p.archived);
	const bundleItems = initialPrice?.bundle
		? initialPrice?.bundle_items?.data || []
		: [];
	const isBundle = bundleItems.length > 0;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Title', 'surecart')}
						value={attributes.title}
						onChange={(title) => setAttributes({ title })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{!isBundle ? (
					<div
						style={{
							padding: '16px',
							background: '#f0f0f0',
							borderRadius: '4px',
							fontSize: '13px',
							color: '#757575',
						}}
					>
						{__(
							'Bundle items will appear here when the product has a bundle price.',
							'surecart'
						)}
					</div>
				) : (
					<>
						{!!attributes.title && (
							<div
								style={{
									fontWeight: 600,
									marginBottom: '8px',
								}}
							>
								{attributes.title}
							</div>
						)}
						<ul
							style={{
								listStyle: 'none',
								padding: 0,
								margin: 0,
								display: 'grid',
								gap: '8px',
							}}
						>
							{bundleItems.map((item) => (
								<li
									key={item.id}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '10px',
										fontSize: '14px',
									}}
								>
									<span>{item.product?.name || item.price?.name || __('Component', 'surecart')}</span>
									{item.quantity > 1 && (
										<span style={{ color: '#757575' }}>
											&times; {item.quantity}
										</span>
									)}
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</>
	);
};
