/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { Modal, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { ScAlert, ScForm } from '@surecart/components-react';
import SelectModel from '../../../components/SelectModel';
import SelectIntegration from './SelectIntegration';

export default ({ onRequestClose }) => {
	const [data, setData] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const onSubmit = () => {
		onRequestClose();
	};

	const onQuery = async () => {
		try {
			setLoading(true);
			const response = await apiFetch({
				path: addQueryArgs(
					'surecart/v1/integration_providers/product',
					{
						context: 'edit',
					}
				),
			});
			setData(response);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			title={__('Add Integration', 'surecart')}
			css={css`
				max-width: 500px !important;
			`}
			onRequestClose={onRequestClose}
			shouldCloseOnClickOutside={false}
		>
			<ScForm
				onScFormSubmit={onSubmit}
				css={css`
					--sc-form-row-spacing: var(--sc-spacing-large);
				`}
			>
				<ScAlert type="danger" open={error}>
					{error}
				</ScAlert>

				<SelectIntegration />

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<Button isPrimary isBusy={loading} type="submit">
						{__('Create', 'surecart')}
					</Button>
					<Button onClick={onRequestClose}>
						{__('Cancel', 'surecart')}
					</Button>
				</div>
			</ScForm>
		</Modal>
	);
};
