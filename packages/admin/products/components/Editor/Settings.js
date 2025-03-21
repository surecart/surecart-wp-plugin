/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';
import { Modal, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import Error from '../../../components/Error';
import { Notice } from '@wordpress/components';

const blockPrefixMap = {
	core: __('Core WordPress', 'surecart'),
	surecart: __('SureCart', 'surecart'),
	uagb: __('Spectra', 'surecart'),
};

export default ({ open, onRequestClose }) => {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);

	const { editedRecord, edit, hasEdits, save } = useEntityRecord(
		'root',
		'site'
	);
	const setting = editedRecord['surecart_product_content_block_prefixes'];
	const editSetting = (data) =>
		edit({
			surecart_product_content_block_prefixes: data,
		});

	const onSave = async () => {
		try {
			setBusy(true);
			setError(null);
			await save();
			window.location.reload();
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
			<fieldset
				css={css`
					margin: 0 0 1.5rem;
				`}
			>
				<legend
					css={css`
						margin-bottom: 8px;
					`}
				>
					<h2
						css={css`
							font-size: 0.9rem;
							font-weight: 600;
							margin-top: 0;
						`}
					>
						{__('Supported Blocks', 'surecart')}
					</h2>
					<p
						css={css`
							color: #757575;
							font-size: 12px;
							font-style: normal;
							margin: -8px 0 8px;
						`}
					>
						{__(
							'These blocks have been tested and are supported by the editor.',
							'surecart'
						)}
					</p>
				</legend>
				<div>
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
										blockPrefixMap[prefix] ||
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
			<fieldset
				css={css`
					margin: 0 0 1.5rem;
				`}
			>
				<legend
					css={css`
						margin-bottom: 8px;
					`}
				>
					<h2
						css={css`
							font-size: 0.9rem;
							font-weight: 600;
							margin-top: 0;
						`}
					>
						{__('Experimental Block Libraries', 'surecart')}
					</h2>
					<p
						css={css`
							color: #757575;
							font-size: 12px;
							font-style: normal;
							margin: -8px 0 8px;
						`}
					>
						{__(
							'These blocks may not yet have compatibility with the custom product content designer. They may not display in the editor correctly.',
							'surecart'
						)}
					</p>
				</legend>
				<div>
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
										blockPrefixMap[prefix] ||
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
				<div
					css={css`
						margin: 0 0 1.5rem;
					`}
				>
					<Notice status="warning" isDismissible={false}>
						{__(
							'A page reload is required for this change. Make sure your product is saved before reloading.',
							'surecart'
						)}
					</Notice>
				</div>
			)}
			<Button
				variant="primary"
				onClick={onSave}
				disabled={!hasEdits && !busy}
				isBusy={busy}
			>
				{__('Save & Reload Page', 'surecart')}
			</Button>
		</Modal>
	);
};
