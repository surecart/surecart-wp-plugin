/**
 * WordPress dependencies
 */
import { check, aspectRatio as aspectRatioIcon } from '@wordpress/icons';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

const POPOVER_PROPS = { placement: 'bottom-start', variant: 'toolbar' };

function AspectGroup({ aspectRatios, isDisabled, label, onClick, value }) {
	return (
		<MenuGroup label={label}>
			{aspectRatios.map(({ title, aspect }) => (
				<MenuItem
					key={aspect}
					disabled={isDisabled}
					onClick={() => {
						onClick(aspect);
					}}
					role="menuitemradio"
					isSelected={aspect === value}
					icon={aspect === value ? check : undefined}
				>
					{title}
				</MenuItem>
			))}
		</MenuGroup>
	);
}

export default function AspectRatioDropdown({
	toggleProps,
	aspect,
	setAspect,
}) {
	return (
		<DropdownMenu
			icon={aspectRatioIcon}
			label={__('Aspect Ratio', 'surecart')}
			popoverProps={POPOVER_PROPS}
			toggleProps={toggleProps}
			className="wp-block-image__aspect-ratio"
		>
			{({ onClose }) => (
				<>
					<AspectGroup
						onClick={(newAspect) => {
							setAspect(newAspect);
							onClose();
						}}
						value={aspect}
						aspectRatios={[
							{
								title: __('Square', 'surecart'),
								aspect: 1,
							},
						]}
					/>
					<AspectGroup
						label={__('Landscape', 'surecart')}
						onClick={(newAspect) => {
							setAspect(newAspect);
							onClose();
						}}
						value={aspect}
						aspectRatios={[
							{
								title: __('16:10', 'surecart'),
								aspect: 16 / 10,
							},
							{
								title: __('16:9', 'surecart'),
								aspect: 16 / 9,
							},
							{
								title: __('4:3', 'surecart'),
								aspect: 4 / 3,
							},
							{
								title: __('3:2', 'surecart'),
								aspect: 3 / 2,
							},
						]}
					/>
					<AspectGroup
						label={__('Portrait', 'surecart')}
						onClick={(newAspect) => {
							setAspect(newAspect);
							onClose();
						}}
						value={aspect}
						aspectRatios={[
							{
								title: __('10:16', 'surecart'),
								aspect: 10 / 16,
							},
							{
								title: __('9:16', 'surecart'),
								aspect: 9 / 16,
							},
							{
								title: __('3:4', 'surecart'),
								aspect: 3 / 4,
							},
							{
								title: __('2:3', 'surecart'),
								aspect: 2 / 3,
							},
						]}
					/>
				</>
			)}
		</DropdownMenu>
	);
}
