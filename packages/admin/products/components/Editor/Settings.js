/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { Modal, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { useEntityProp } from '@wordpress/core-data';
import Error from '../../../components/Error';
import { useDispatch } from '@wordpress/data';

export default ({ open, onRequestClose }) => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const { saveEntityRecord } = useDispatch(coreStore);

	const { editedRecord, edit, hasEdits } = useEntityRecord('root', 'site');
	const setting = editedRecord['surecart_product_content_block_prefixes'];
	const editSetting = (data) =>
		edit({
			surecart_product_content_block_prefixes: data,
		});

	const onSave = async () => {
		setBusy(true);
		setError(null);
		try {
			await saveEntityRecord(
				'root',
				'site',
				'surecart_product_content_block_prefixes',
				setting,
				{
					throwOnError: true,
				}
			);
			// window.location.reload();
		} catch (error) {
			console.error(error);
			setBusy(false);
			setError(error);
		}
	};

	if (!open) {
		return null;
	}

	return (
		<Modal
			title={__('Advanced Editor Settings', 'surecart')}
			onRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			{/* Supported Blocks Section */}
			<fieldset className="preferences-modal__section">
				<legend className="preferences-modal__section-legend">
					<h2 className="preferences-modal__section-title">
						{__('Supported Block Prefixes', 'surecart')}
					</h2>
					<p className="preferences-modal__section-description">
						{__(
							'These blocks have been tested and are supported by the editor.',
							'surecart'
						)}
					</p>
				</legend>
				<div className="preferences-modal__section-content">
					{(
						surecartBlockEditorSettings[
							'surecart_all_block_prefixes'
						] || []
					)
						.filter((prefix) =>
							['surecart', 'core'].includes(prefix)
						)
						.map((prefix) => (
							<div key={prefix}>
								<ToggleControl
									label={
										prefix.charAt(0).toUpperCase() +
										prefix.slice(1)
									}
									checked={setting.includes(prefix)}
									onChange={() => {
										editSetting(
											setting.includes(prefix)
												? setting.filter(
														(p) => p !== prefix
												  )
												: [...setting, prefix]
										);
									}}
								/>
							</div>
						))}
				</div>
			</fieldset>

			{/* Experimental Blocks Section */}
			<fieldset className="preferences-modal__section">
				<legend className="preferences-modal__section-legend">
					<h2 className="preferences-modal__section-title">
						{__('Experimental Block Prefixes', 'surecart')}
					</h2>
					<p className="preferences-modal__section-description">
						{__(
							'These blocks may not yet have compatibility with the custom product content editor. They may not work as expected.',
							'surecart'
						)}
					</p>
				</legend>
				<div className="preferences-modal__section-content">
					{(
						surecartBlockEditorSettings[
							'surecart_all_block_prefixes'
						] || []
					)
						.filter(
							(prefix) => !['surecart', 'core'].includes(prefix)
						)
						.map((prefix) => (
							<div key={prefix}>
								<ToggleControl
									label={
										prefix.charAt(0).toUpperCase() +
										prefix.slice(1)
									}
									checked={setting.includes(prefix)}
									onChange={() => {
										editSetting(
											setting.includes(prefix)
												? setting.filter(
														(p) => p !== prefix
												  )
												: [...setting, prefix]
										);
									}}
								/>
							</div>
						))}
				</div>
			</fieldset>
			{hasEdits && (
				<p>
					{__(
						'A page reload is required for this change. Make sure your product is saved before reloading.',
						'surecart'
					)}
				</p>
			)}
			<Button
				variant="primary"
				onClick={onSave}
				disabled={!hasEdits}
				busy={busy}
			>
				{__('Save & Reload Page', 'surecart')}
			</Button>
		</Modal>
	);
};
