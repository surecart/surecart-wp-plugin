/**
 * External dependencies.
 */
import clsx from 'clsx';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	ExternalLink,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';
import { filterURLForDisplay, safeDecodeURI } from '@wordpress/url';
import { Icon, info, edit, trash, currencyDollar } from '@wordpress/icons';
import { __unstableStripHTML as stripHTML } from '@wordpress/dom';
import { useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Filters the title for display. Removes the protocol and www prefix.
 *
 * @param {string} title The title to be filtered.
 *
 * @return {string} The filtered title.
 */
function filterTitleForDisplay(title) {
	// Derived from `filterURLForDisplay` in `@wordpress/url`.
	return title
		.replace(/^[a-z\-.\+]+[0-9]*:(\/\/)?/i, '')
		.replace(/^www\./i, '');
}

export default function SelectorPreview({
	value,
	onEditClick,
	hasUnlinkControl = false,
	onRemove,
}) {
	const showIconLabels = useSelect(
		(select) => select(preferencesStore).get('core', 'showIconLabels'),
		[]
	);

	const displayURL =
		(value && filterURLForDisplay(safeDecodeURI(value.url), 24)) || '';

	// url can be undefined if the href attribute is unset
	const isEmptyURL = !value?.url?.length;

	const displayTitle = !isEmptyURL && stripHTML(value?.title || displayURL);

	const isUrlRedundant =
		!value?.url || filterTitleForDisplay(displayTitle) === displayURL;

	let icon;

	if (isEmptyURL) {
		icon = <Icon icon={info} size={32} />;
	} else if (!!value?.gallery?.[0]?.url) {
		icon = (
			<img
				className="block-editor-link-control__search-item-image"
				src={value?.gallery?.[0]?.url}
				alt={__('Product image', 'surecart')}
			/>
		);
	} else {
		icon = <Icon icon={currencyDollar} />;
	}

	return (
		<div
			role="group"
			aria-label={__('Manage link', 'surecart')}
			className={clsx('block-editor-link-control__search-item', {
				'is-current': true,
				'is-rich': false,
				'is-fetching': false,
				'is-preview': true,
				'is-error': isEmptyURL,
				'is-url-title': displayTitle === displayURL,
			})}
			style={{ padding: 0 }}
		>
			<div className="block-editor-link-control__search-item-top">
				<span
					className="block-editor-link-control__search-item-header"
					role="figure"
					aria-label={
						/* translators: Accessibility text for the link preview when editing a link. */
						__('Link information', 'surecart')
					}
				>
					<span
						className={clsx(
							'block-editor-link-control__search-item-icon',
							{
								'is-image': false,
							}
						)}
					>
						{icon}
					</span>
					<span className="block-editor-link-control__search-item-details">
						{!isEmptyURL ? (
							<>
								<ExternalLink
									className="block-editor-link-control__search-item-title"
									href={value.url}
								>
									<Truncate numberOfLines={1}>
										{displayTitle}
									</Truncate>
								</ExternalLink>
								{!isUrlRedundant && (
									<span className="block-editor-link-control__search-item-info">
										<Truncate numberOfLines={1}>
											{displayURL}
										</Truncate>
									</span>
								)}
							</>
						) : (
							<span className="block-editor-link-control__search-item-error-notice">
								{__('Link is empty', 'surecart')}
							</span>
						)}
					</span>
				</span>
				<Button
					icon={edit}
					label={__('Change Product', 'surecart')}
					onClick={onEditClick}
					size="compact"
					showTooltip={!showIconLabels}
				/>
				{hasUnlinkControl && (
					<Button
						icon={trash}
						label={__('Remove', 'surecart')}
						onClick={onRemove}
						size="compact"
						showTooltip={!showIconLabels}
					/>
				)}
			</div>
		</div>
	);
}
