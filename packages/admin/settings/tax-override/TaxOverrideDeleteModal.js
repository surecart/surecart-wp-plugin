/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScButton, ScDialog, ScForm, ScText } from '@surecart/components-react';

export default ({
	type,
	open,
	taxOverride,
	onRequestClose,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	// const [type, setType] = useState('other');
	const [additionalErrors, setAdditionalErrors] = useState([]);
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
			if (e?.additional_errors) {
				setAdditionalErrors(e.additional_errors);
			}
		} finally {
			setLoading(false);
		}
	};

	const getDialogLabel = () => {
		return type === 'shipping'
			? __(
					'Remove shipping override for ' +
						taxOverride?.tax_zone?.country_name || '',
					'surecart'
			  )
			: __(
					'Remove override for ' +
						taxOverride?.product_collection?.name ||
						'' +
							' collection in ' +
							taxOverride?.tax_zone?.country_name,
					'surecart'
			  );
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
						{/* <Error error={error} setError={setError} /> */}

						{type === 'shipping' && (
							<ScText>
								{__(
									"If you remove this override, then you'll charge the standard tax rate for shipping in " +
										taxOverride?.tax_zone?.country_name +
										'.'
								)}
							</ScText>
						)}

						{type === 'product' && (
							<ScText>
								{__(
									"If you remove this override, then you'll charge the standard tax rate for this collection in " +
										taxOverride?.tax_zone?.country_name +
										'.',
									'surecart'
								)}
							</ScText>
						)}

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
