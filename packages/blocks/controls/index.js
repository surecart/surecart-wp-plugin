/* Add custom attribute to paragraph block, in Toolbar */
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { BlockControls } from '@wordpress/blockEditor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

import AddPriceUI from './AddPriceUI';

// Enable custom attributes on Paragraph block
const enableToolbarButtonOnBlocks = ['core/button'];

/**
 * Declare our custom attribute
 */
const setLineItemsAttribute = (settings, name) => {
	// Do nothing if it's another block than our defined ones.
	if (!enableToolbarButtonOnBlocks.includes(name)) {
		return settings;
	}

	return Object.assign({}, settings, {
		attributes: Object.assign({}, settings.attributes, {
			line_items: { type: 'array' },
		}),
	});
};

wp.hooks.addFilter(
	'blocks.registerBlockType',
	'surecart/buy-button-attributes',
	setLineItemsAttribute
);

/**
 * Add Custom Button to Toolbar
 */
const withToolbarButton = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const [addingLink, setAddingLink] = useState(false);
		// If current block is not allowed
		if (!enableToolbarButtonOnBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes } = props;
		const { line_items, url } = attributes;

		useEffect(() => {
			if (!url) {
				setAttributes({ line_items: [{ quantity: 1 }] });
			}
		}, [url]);

		const onChange = ({ url, line_items }) => {
			setAttributes({
				url,
				line_items,
			});
		};

		return (
			<Fragment>
				<BlockEdit {...props} />
				<BlockControls group="block">
					<ToolbarGroup>
						<ToolbarButton
							icon={
								<svg
									viewBox="0 0 400 400"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M126.226 110.011C138.654 97.5783 162.977 87.5 180.553 87.5H339.674L283.416 143.776H92.4714L126.226 110.011ZM116.905 256.224H307.85L274.095 289.99C261.667 302.422 237.344 312.5 219.768 312.5H60.6472L116.905 256.224ZM328.766 171.862H64.625L53.3735 183.117C28.5173 207.982 36.8637 228.138 72.0157 228.138H336.156L347.408 216.883C372.264 192.018 363.918 171.862 328.766 171.862Z"
										fill="currentColor"
									/>
								</svg>
							}
							label={__('Buy Link', 'surecart')}
							isActive={line_items?.length && !!url}
							onClick={() => setAddingLink(true)}
						/>
						{addingLink && (
							<AddPriceUI
								setAttributes={setAttributes}
								attributes={attributes}
								onChange={onChange}
								setAddingLink={setAddingLink}
								addingLink={addingLink}
							/>
						)}
					</ToolbarGroup>
				</BlockControls>
			</Fragment>
		);
	};
}, 'withToolbarButton');

wp.hooks.addFilter(
	'editor.BlockEdit',
	'surecart/buy-button',
	withToolbarButton
);
