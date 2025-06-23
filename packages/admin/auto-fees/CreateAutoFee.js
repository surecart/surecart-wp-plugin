/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState, useReducer } from '@wordpress/element';
import { getDate } from '@wordpress/date';

/**
 * Internal dependencies.
 */
import { ScButton, ScForm } from '@surecart/components-react';
import Error from '../components/Error';
import CreateTemplate from '../templates/CreateModel';
import Details from './modules/Details';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [autoFee, updateAutoFee] = useReducer(
		(currentState, newState) => {
			return { ...currentState, ...newState };
		},
		{
			name: '',
			active: true,
			amount_adjustment: null,
			percent_adjustment: null,
			discount: false,
			start_at: Date.parse(getDate(new Date())) / 1000,
			end_at: null,
			rule_string: '',
		}
	);
	const [error, setError] = useState(null);
	const { saveEntityRecord } = useDispatch(coreStore);

	// Create the auto fee.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const newAutoFee = await saveEntityRecord(
				'surecart',
				'auto-fee',
				autoFee,
				{ throwOnError: true }
			);
			setId(newAutoFee.id);
		} catch (e) {
			console.error(e);
			setError(e);
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate id={id}>
			<Error error={error} />

			<ScForm onScSubmit={onSubmit}>
				<Details
					autoFee={autoFee}
					onUpdate={updateAutoFee}
					title={__('Create New Auto Fee', 'surecart')}
					footer={
						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href="admin.php?page=sc-auto-fees"
								type="text"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					}
				/>
			</ScForm>
		</CreateTemplate>
	);
};
