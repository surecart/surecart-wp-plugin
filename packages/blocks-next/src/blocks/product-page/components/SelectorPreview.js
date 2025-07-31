/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalTruncate as Truncate,
	ExternalLink,
} from '@wordpress/components';
import clsx from 'clsx';

export default function SelectorPreview({
	title,
	subtitle,
	url,
	imageUrl,
	controls,
}) {
	return (
		<div
			role="group"
			aria-label={__('Manage link', 'surecart')}
			className="block-editor-link-control__search-item is-current is-preview"
			style={{ padding: 0 }}
		>
			<div className="block-editor-link-control__search-item-top">
				<span
					className="block-editor-link-control__search-item-header"
					role="figure"
					aria-label={__('Link information', 'surecart')}
				>
					<span
						className={clsx(
							'block-editor-link-control__search-item-icon',
							{ 'is-image': !!imageUrl }
						)}
					>
						{!!imageUrl && (
							<img
								className="block-editor-link-control__search-item-image"
								src={imageUrl}
								alt={__('Product image', 'surecart')}
							/>
						)}
					</span>
					<span className="block-editor-link-control__search-item-details">
						<ExternalLink
							className="block-editor-link-control__search-item-title"
							href={url}
						>
							<Truncate numberOfLines={1}>
								<span className="block-editor-link-control__search-item-title">
									{title}
								</span>
							</Truncate>
						</ExternalLink>

						{!!subtitle && (
							<span className="block-editor-link-control__search-item-info">
								{subtitle}
							</span>
						)}
					</span>
				</span>
				{controls}
			</div>
		</div>
	);
}
