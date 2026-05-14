/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useEffect, useState, useCallback } from 'react';
import { __, _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { ScFlex, ScSkeleton } from '@surecart/components-react';

const SKELETON_ROW_WIDTHS = ['160px', '120px', '180px'];

export default function BulkDeleteConfirm({ navigation }) {
	const { bulkDeleteIds, goToList } = navigation;

	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const [loadError, setLoadError] = useState(null);

	const addIdsToPath = (base, ids, extras = {}) => {
		const params = new URLSearchParams();
		ids.forEach((id) => params.append('ids[]', id));
		Object.entries(extras).forEach(([k, v]) => {
			if (v !== undefined && v !== null) params.append(k, String(v));
		});
		return `${base}?${params.toString()}`;
	};

	const editProductUrl = (productId) => {
		const url = new URL(window.location.href);
		url.search = new URLSearchParams({
			page: 'sc-products',
			action: 'edit',
			id: productId,
		}).toString();
		return url.toString();
	};

	useEffect(() => {
		if (!bulkDeleteIds || bulkDeleteIds.length === 0) {
			goToList();
		}
	}, [bulkDeleteIds, goToList]);

	useEffect(() => {
		if (!bulkDeleteIds || bulkDeleteIds.length === 0) return;
		let cancelled = false;

		setIsLoading(true);
		setLoadError(null);

		apiFetch({
			path: addIdsToPath('/surecart/v1/products', bulkDeleteIds, {
				per_page: bulkDeleteIds.length,
			}),
		})
			.then((response) => {
				if (cancelled) return;
				setProducts(Array.isArray(response) ? response : []);
			})
			.catch((error) => {
				if (cancelled) return;
				setLoadError(
					error?.message || __('Failed to load products.', 'surecart')
				);
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [bulkDeleteIds]);

	const handleDelete = useCallback(() => {
		if (isDeleting) return;
		setIsDeleting(true);

		const form = document.createElement('form');
		form.method = 'POST';
		form.action = `${window.location.pathname}?page=sc-products`;

		const append = (name, value) => {
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = name;
			input.value = value;
			form.appendChild(input);
		};

		append('nonce', window.scData?.bulk_delete_nonce || '');
		append('confirm-bulk-delete', 'true');
		bulkDeleteIds.forEach((id) => append('bulk_action_product_ids[]', id));

		document.body.appendChild(form);
		form.submit();
	}, [isDeleting, bulkDeleteIds]);

	const count = isLoading ? bulkDeleteIds.length : products.length;

	return (
		<div className="wrap">
			<div
				css={css`
					padding-top: 3em;
					display: flex;
					justify-content: center;
				`}
			>
				<div
					css={css`
						width: 100%;
						max-width: 600px;
					`}
				>
					<sc-card
						style={{
							display: 'block',
							width: '100%',
							'--sc-card-padding': 'var(--sc-spacing-xxx-large)',
						}}
					>
						<sc-flex
							flex-direction="column"
							style={{ '--sc-flex-column-gap': '1em' }}
						>
							<sc-icon
								name="alert-triangle"
								css={css`
									font-size: 24px;
									color: var(--sc-color-danger-500);
								`}
							></sc-icon>

							{isLoading ? (
								<ScFlex
									flexDirection="column"
									style={{ '--sc-flex-column-gap': '1em' }}
								>
									<ScSkeleton
										style={{
											width: '60%',
											height: '1.5em',
										}}
									/>
									<ScFlex
										flexDirection="column"
										style={{
											'--sc-flex-column-gap': '0.4em',
										}}
									>
										<ScSkeleton
											style={{
												width: '100%',
												height: '1em',
											}}
										/>
										<ScSkeleton
											style={{
												width: '75%',
												height: '1em',
											}}
										/>
									</ScFlex>
									<ScFlex
										flexDirection="column"
										style={{
											'--sc-flex-column-gap': '0.6em',
										}}
									>
										{bulkDeleteIds.map((id, index) => (
											<ScSkeleton
												key={id}
												style={{
													width: SKELETON_ROW_WIDTHS[
														index %
															SKELETON_ROW_WIDTHS.length
													],
													height: '1em',
												}}
											/>
										))}
									</ScFlex>
								</ScFlex>
							) : (
								<>
									<sc-heading size="large">
										{_n(
											'Delete Product',
											'Delete Products',
											count || 1,
											'surecart'
										)}
									</sc-heading>

									<sc-text>
										{_n(
											'Are you sure you want to permanently delete this product? This cannot be undone.',
											'Are you sure you want to permanently delete these products? This cannot be undone.',
											count || 1,
											'surecart'
										)}
									</sc-text>

									{loadError && (
										<sc-alert type="danger" open>
											{loadError}
										</sc-alert>
									)}

									<ul
										css={css`
											font-size: 13px;
											margin: 0;
											padding-left: 1.2em;

											li {
												margin-bottom: 0.25em;
											}

											li a {
												display: inline-flex;
												align-items: center;
												gap: 0.5em;
												color: var(
													--sc-color-danger-500
												);
												text-decoration: none;
											}

											li a:hover {
												text-decoration: underline;
											}
										`}
									>
										{products.map((product) => (
											<li key={product.id}>
												<a
													href={editProductUrl(
														product.id
													)}
													target="_blank"
													rel="noreferrer"
												>
													{product.name}
													<sc-icon name="external-link"></sc-icon>
												</a>
											</li>
										))}
									</ul>
								</>
							)}

							<sc-flex
								justify-content="flex-start"
								css={css`
									gap: 1em;
								`}
							>
								{isLoading ? (
									<>
										<ScSkeleton
											style={{
												width: '90px',
												height: '36px',
												'--border-radius':
													'var(--sc-input-border-radius-medium, 6px)',
											}}
										/>
										<ScSkeleton
											style={{
												width: '70px',
												height: '36px',
												'--border-radius':
													'var(--sc-input-border-radius-medium, 6px)',
											}}
										/>
									</>
								) : (
									<>
										<sc-button
											size="medium"
											type="danger"
											loading={isDeleting || undefined}
											disabled={
												isDeleting ||
												!!loadError ||
												undefined
											}
											onClick={handleDelete}
										>
											{__('Delete', 'surecart')}
										</sc-button>
										<sc-button
											size="medium"
											type="link"
											disabled={isDeleting || undefined}
											onClick={() => goToList()}
										>
											{__('Cancel', 'surecart')}
										</sc-button>
									</>
								)}
							</sc-flex>
						</sc-flex>
					</sc-card>
				</div>
			</div>
		</div>
	);
}
