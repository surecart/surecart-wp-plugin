/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScButton, ScDialog, ScForm, ScText } from '@surecart/components-react';
import Error from '../../components/Error';

export default ({ type, open, taxOverride, onRequestClose }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { deleteEntityRecord } = useDispatch(coreStore);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			await deleteEntityRecord(
				'surecart',
				'tax_override',
				taxOverride?.id,
				undefined,
				{
					throwOnError: true,
				}
			);
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
		} finally {
			setLoading(false);
		}
	};

	const getDialogLabel = () => {
		if (type === 'shipping') {
			return sprintf(
				/* translators: %s: tax zone country name */
				__('Remove shipping override for %s', 'surecart'),
				taxOverride?.tax_zone?.country_name || ''
			);
		} else {
			return sprintf(
				/* translators: %1$s: product collection name, %2$s: tax zone country name */
				__('Remove override for %1$s collection in %2$s', 'surecart'),
				taxOverride?.product_collection?.name || '',
				taxOverride?.tax_zone?.country_name || ''
			);
		}
	};

	const getDialogDescription = () => {
		if (type === 'shipping') {
			return sprintf(
				/* translators: %s: tax zone country name */
				__(
					"If you remove this override, then you'll charge the standard tax rate for shipping in %s.",
					'surecart'
				),
				taxOverride?.tax_zone?.country_name || ''
			);
		} else {
			return sprintf(
				/* translators: %s: tax zone country name */
				__(
					"If you remove this override, then you'll charge the standard tax rate for this collection in %s.",
					'surecart'
				),
				taxOverride?.tax_zone?.country_name || ''
			);
		}
	};

	return (
		<div
			css={css`
				sc-dialog::part(body) {
					overflow: visible;
				}
			`}
		>
			<ScDialog
				label={getDialogLabel()}
				onScRequestClose={onRequestClose}
				open={open}
			>
				{open && (
					<ScForm
						onScSubmit={onSubmit}
						style={{
							'--sc-form-row-spacing': 'var(--sc-spacing-large)',
						}}
					>
						<Error error={error} setError={setError} />

						<ScText>{getDialogDescription()}</ScText>

						<sc-flex justify-content="flex-end">
							<div>
								<ScButton onClick={() => onRequestClose()}>
									{__('Cancel', 'surecart')}
								</ScButton>
							</div>
							<ScButton type="primary" submit disabled={loading}>
								{__('Delete', 'surecart')}
							</ScButton>
						</sc-flex>

						{loading && (
							<sc-block-ui
								spinner
								style={{
									zIndex: 9,
									'--sc-block-ui-opacity': '0.5',
									inset: 0,
								}}
							></sc-block-ui>
						)}
					</ScForm>
				)}
			</ScDialog>
		</div>
	);
};
