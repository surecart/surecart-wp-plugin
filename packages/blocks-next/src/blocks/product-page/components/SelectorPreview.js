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
import { Icon, globe, info, edit, trash } from '@wordpress/icons';
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
	hasRichPreviews = false,
	hasUnlinkControl = false,
	onRemove,
}) {
	const showIconLabels = useSelect(
		(select) => select(preferencesStore).get('core', 'showIconLabels'),
		[]
	);

	// Avoid fetching if rich previews are not desired.
	const showRichPreviews = hasRichPreviews ? value?.url : null;

	// const { richData, isFetching } = useRichUrlData(showRichPreviews);
	const richData = {};
	const isFetching = false;

	// Rich data may be an empty object so test for that.
	const hasRichData = false;

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
	} else {
		icon = <Icon icon={globe} />;
	}

	return (
		<div
			role="group"
			aria-label={__('Manage link', 'surecart')}
			className={clsx('block-editor-link-control__search-item', {
				'is-current': true,
				'is-rich': hasRichData,
				'is-fetching': !!isFetching,
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
								'is-image': richData?.icon,
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
