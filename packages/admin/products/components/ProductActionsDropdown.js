import { __ } from '@wordpress/i18n';

import {
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/components-react';

export default ({ product, onDelete, onToggleArchive }) => {
	const confirmArchive = () => {
		const r = confirm(
			product?.archived_at
				? sprintf(
						__(
							'Un-Archive %s? This will make the product purchaseable again.',
							'surecart'
						),
						product?.name || 'Product'
				  )
				: sprintf(
						__(
							'This product will not be purchaseable and all unsaved changes will be lost.',
							'surecart'
						),
						product?.name || 'Product'
				  )
		);
		if (!r) return;
		onToggleArchive && onToggleArchive();
	};

	const confirmDelete = () => {
		const r = confirm(
			sprintf(
				__(
					'Permanently delete %s? You cannot undo this action.',
					'surecart'
				),
				product?.name || 'Product'
			)
		);
		if (!r) return;
		onDelete && onDelete();
	};

	if (!product?.id) {
		return '';
	}

	return (
		<CeDropdown slot="suffix" position="bottom-right">
			<CeButton type="text" slot="trigger">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="1"></circle>
					<circle cx="19" cy="12" r="1"></circle>
					<circle cx="5" cy="12" r="1"></circle>
				</svg>
			</CeButton>
			<CeMenu>
				{product?.id && (
					<CeMenuItem onClick={confirmArchive}>
						<span
							slot="prefix"
							style={{
								opacity: 0.5,
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="21 8 21 21 3 21 3 8"></polyline>
								<rect x="1" y="3" width="22" height="5"></rect>
								<line x1="10" y1="12" x2="14" y2="12"></line>
							</svg>
						</span>
						{product?.archived_at
							? __('Un-Archive', 'surecart')
							: __('Archive', 'surecart')}
					</CeMenuItem>
				)}
				{product?.id && (
					<CeMenuItem onClick={confirmDelete}>
						<span
							slot="prefix"
							style={{
								opacity: 0.5,
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="3 6 5 6 21 6"></polyline>
								<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
								<line x1="10" y1="11" x2="10" y2="17"></line>
								<line x1="14" y1="11" x2="14" y2="17"></line>
							</svg>
						</span>
						{__('Delete', 'surecart')}
					</CeMenuItem>
				)}
			</CeMenu>
		</CeDropdown>
	);
};
