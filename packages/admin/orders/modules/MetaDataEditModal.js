/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	ScModal,
	ScModalHeader,
	ScForm,
	ScFormControl,
	ScLabel,
	ScTextarea,
	ScButton,
	ScAlert,
} from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';

export default function MetaDataEditModal({
	open,
	onRequestClose,
	metadata,
	orderId,
	checkoutId,
	onSuccess,
}) {
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (open && metadata) {
			setFormData(metadata);
			setError(null);
		}
	}, [open, metadata]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await apiFetch({
				path: `surecart/v1/checkouts/${checkoutId}`,
				method: 'PATCH',
				data: {
					metadata: formData,
				},
			});

			if (response && response.id) {
				onSuccess(response);
				onRequestClose();
			}
		} catch (err) {
			setError(
				err.message ||
					__('Failed to update metadata. Please try again.', 'surecart')
			);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (key, value) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<ScModal open={open} onRequestClose={onRequestClose}>
			<ScModalHeader>
				<span slot="label">
					{__('Edit Additional Order Data', 'surecart')}
				</span>
			</ScModalHeader>
			<ScForm onSubmit={handleSubmit}>
				<div
					css={css`
						padding: 24px;
						display: grid;
						gap: 16px;
						max-height: 60vh;
						overflow-y: auto;
					`}
				>
					{error && (
						<ScAlert
							type="danger"
							open={true}
							closable
							onScRequestClose={() => setError(null)}
						>
							{error}
						</ScAlert>
					)}

					{Object.keys(formData).map((key) => (
						<ScFormControl key={key}>
							<ScLabel>{key.replaceAll('_', ' ')}</ScLabel>
							<ScTextarea
								value={formData[key] || ''}
								onScInput={(e) => handleChange(key, e.target.value)}
								rows={3}
								resize="vertical"
							/>
						</ScFormControl>
					))}

					<div
						css={css`
							display: flex;
							gap: 12px;
							justify-content: flex-end;
							margin-top: 16px;
						`}
					>
						<ScButton
							type="text"
							onClick={onRequestClose}
							disabled={loading}
						>
							{__('Cancel', 'surecart')}
						</ScButton>
						<ScButton
							type="primary"
							submit
							loading={loading}
							disabled={loading}
						>
							{__('Save', 'surecart')}
						</ScButton>
					</div>
				</div>
			</ScForm>
		</ScModal>
	);
}