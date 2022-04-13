/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSpokenMessages } from '@wordpress/components';
import { useState } from '@wordpress/element';
import {
	getTextContent,
	applyFormat,
	removeFormat,
	slice,
	registerFormatType,
} from '@wordpress/rich-text';
import {
	RichTextToolbarButton,
	RichTextShortcut,
} from '@wordpress/block-editor';
import { isURL } from '@wordpress/url';

import AddPriceUi from './AddPriceUI';
import ShowPrice from './ShowPrice';

const name = 'surecart/buy-link';
const title = __('Buy Link', 'surecart');

export const buyLink = {
	name,
	title,
	tagName: 'a',
	className: 'surecart-buy-link',
	attributes: {
		url: 'href',
		target: 'target',
		// line_items: 'data-line-items',
	},
	edit: withSpokenMessages(({ isActive, value, onChange, speak }) => {
		const [addingLink, setAddingLink] = useState(false);

		const addLink = () => {
			const text = getTextContent(slice(value));
			if (text && isURL(text)) {
				onChange(
					applyFormat(value, {
						type: name,
						attributes: { url: text },
					})
				);
			} else {
				setAddingLink(true);
			}
		};

		const onRemoveFormat = () => {
			onChange(removeFormat(value, name));
			speak(__('Link removed.'), 'assertive');
		};

		return (
			<>
				<RichTextShortcut
					type="primary"
					character="p"
					onUse={addLink}
				></RichTextShortcut>

				<RichTextShortcut
					type="primaryShift"
					character="p"
					onUse={onRemoveFormat}
				/>

				<RichTextToolbarButton
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
					title={title}
					onClick={addLink}
					isActive={isActive}
				/>
				{addingLink && (
					<AddPriceUi
						value={value}
						onChange={onChange}
						setAddingLink={setAddingLink}
						addingLink={addingLink}
						isActive={isActive}
					/>
				)}
				{!addingLink && isActive && (
					<ShowPrice
						value={value}
						addingLink={addingLink}
						onChange={onChange}
						setAddingLink={setAddingLink}
						isActive={isActive}
					/>
				)}
			</>
		);
	}),
};

const { formatName, ...settings } = buyLink;
registerFormatType(formatName, settings);
