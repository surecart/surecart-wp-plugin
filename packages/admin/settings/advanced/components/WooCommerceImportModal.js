import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
	ScSpinner,
} from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

export default ({ open, onRequestClose }) => {
	const [count, setCount] = useState(null);
	const [loadingCount, setLoadingCount] = useState(false);
	const [saving, setSaving] = useState(false);
	const [countError, setCountError] = useState(false);

	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	// Fetch count when modal opens.
	useEffect(() => {
		if (!open) {
			setCount(null);
			setCountError(false);
			return;
		}

		const controller = new AbortController();

		const fetchCount = async () => {
			try {
				setLoadingCount(true);
				const response = await apiFetch({
					path: '/surecart/v1/products/woocommerce_count',
					signal: controller.signal,
				});
				setCount(response?.count ?? 0);
			} catch (e) {
				if (e.name !== 'AbortError') {
					console.error(e);
					setCountError(true);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoadingCount(false);
				}
			}
		};

		fetchCount();
		return () => controller.abort();
	}, [open]);

	const submitForm = async () => {
		if (saving) return;
		try {
			setSaving(true);
			await apiFetch({
				method: 'POST',
				path: '/surecart/v1/products/import_woocommerce',
			});
			createSuccessNotice(
				__(
					'WooCommerce import started in the background',
					'surecart'
				),
				{
					type: 'snackbar',
				}
			);
			onRequestClose();
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setSaving(false);
		}
	};

	const hasProducts = count !== null && count > 0;

	return (
		<ScDialog
			label={__('Import Products from WooCommerce', 'surecart')}
			open={open}
			onRequestClose={onRequestClose}
		>
			{loadingCount ? (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						padding: '2em',
					}}
				>
					<ScSpinner />
				</div>
			) : countError ? (
				<>
					<ScAlert type="danger" open icon="alert-circle">
						{__(
							'Could not retrieve WooCommerce product count. Please try again.',
							'surecart'
						)}
					</ScAlert>
					<div>
						<ScButton
							type="text"
							onClick={onRequestClose}
						>
							{__('Close', 'surecart')}
						</ScButton>
					</div>
				</>
			) : (
				<ScForm
					onScSubmit={(e) => {
						e.preventDefault();
						e.stopImmediatePropagation();
						submitForm();
					}}
					onScFormSubmit={(e) => {
						e.preventDefault();
						e.stopImmediatePropagation();
					}}
				>
					{hasProducts ? (
						<>
							<ScAlert type="warning" open icon="info-circle">
								{sprintf(
									__(
										'Up to %d WooCommerce product(s) will be imported into SureCart. The import runs in the background. Products already imported or not supported (e.g. grouped products) will be skipped.',
										'surecart'
									),
									count
								)}
							</ScAlert>
							<div>
								<ScButton
									type="primary"
									submit
									busy={saving}
									disabled={saving}
								>
									{__('Import Products', 'surecart')}
								</ScButton>
								<ScButton
									type="text"
									onClick={onRequestClose}
								>
									{__('Cancel', 'surecart')}
								</ScButton>
							</div>
						</>
					) : (
						<>
							<ScAlert type="info" open icon="info-circle">
								{__(
									'No new WooCommerce products to import. All products have already been imported.',
									'surecart'
								)}
							</ScAlert>
							<div>
								<ScButton
									type="text"
									onClick={onRequestClose}
								>
									{__('Close', 'surecart')}
								</ScButton>
							</div>
						</>
					)}
				</ScForm>
			)}
			{saving && <ScBlockUi spinner style={{ zIndex: 9 }} />}
		</ScDialog>
	);
};
