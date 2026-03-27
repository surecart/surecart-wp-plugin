/**
 * External dependencies.
 */
import clsx from 'clsx';

/**
 * WordPress dependencies.
 */
import {
	dateI18n,
	humanTimeDiff,
	getSettings as getDateSettings,
} from '@wordpress/date';
import {
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
	__experimentalDateFormatPicker as DateFormatPicker,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { useToolsPanelDropdownMenuProps } from '../utils';

export default ({
	attributes: { datetime, textAlign, format, metadata },
	setAttributes,
}) => {
	const blockProps = useBlockProps({
		className: clsx({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor }),
		[popoverAnchor]
	);

	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch(blockEditorStore);

	// We need to set the datetime to a default value upon first loading
	// to discern the block from its legacy version (which would default
	// to the containing post's publish date).
	useEffect(() => {
		if (datetime === undefined) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes({ datetime: new Date() });
		}
	}, [datetime]);

	const dateSettings = getDateSettings();
	const postTypeSlug = 'sc_product';

	const { siteFormat = dateSettings.formats.date } = useSelect(
		(select) => {
			const { getPostType, getEntityRecord } = select(coreStore);
			const siteSettings = getEntityRecord('root', 'site');

			return {
				siteFormat: siteSettings?.date_format,
				siteTimeFormat: siteSettings?.time_format,
				postType: postTypeSlug ? getPostType(postTypeSlug) : null,
			};
		},
		[postTypeSlug]
	);

	let reviewDate = (
		<time dateTime={dateI18n('c', datetime)} ref={setPopoverAnchor}>
			{format === 'human-diff'
				? humanTimeDiff(datetime)
				: dateI18n(format || siteFormat, datetime)}
		</time>
	);

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={__('Settings', 'surecart')}
					resetAll={() => {
						setAttributes({
							datetime: undefined,
							format: undefined,
						});
					}}
					dropdownMenuProps={dropdownMenuProps}
				>
					<ToolsPanelItem
						hasValue={() => !!format}
						label={__('Date Format', 'surecart')}
						onDeselect={() => setAttributes({ format: undefined })}
						isShownByDefault
					>
						<DateFormatPicker
							format={format}
							defaultFormat={siteFormat}
							onChange={(nextFormat) =>
								setAttributes({ format: nextFormat })
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div {...blockProps}>{reviewDate}</div>
		</>
	);
};
