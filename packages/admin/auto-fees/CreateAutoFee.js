/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { getDate } from '@wordpress/date';
import { useState } from 'react';

import {
	ScAlert,
	ScButton,
	ScForm,
	ScSelect,
} from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';
import templates from './templates';

export default ({ id, onCreateAutoFee }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [currentTemplate, setCurrentTemplate] = useState(null);
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	const getTemplateChoices = () => {
		return Object.entries(templates).map(([key, template]) => ({
			label: template?.name || key,
			value: key,
		}));
	};

	// create the auto-fee.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const createdAutoFee = await saveEntityRecord(
				'surecart',
				'auto-fee',
				{
					...templates?.[currentTemplate],
					start_at: Date.parse(getDate(new Date())) / 1000,
				},
				{ throwOnError: true }
			);
			if (!createdAutoFee?.id) {
				throw {
					message: __(
						'Could not create dynamic price. Please try again.',
						'surecart'
					),
				};
			}

			onCreateAutoFee(createdAutoFee.id);
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate id={id}>
			<ScAlert open={error?.length} type="danger" closable scrollOnOpen>
				<span slot="title">{error}</span>
			</ScAlert>

			<Box title={__('Create New Dynamic Price', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScSelect
							label={__('Recipes ', 'surecart')}
							help={__(
								'Start with one of our predefined recipes.',
								'surecart'
							)}
							placeholder={__('Select a Recipe', 'surecart')}
							unselect={false}
							value={currentTemplate}
							css={css`
								min-width: 125px;
							`}
							onScChange={(e) => {
								setCurrentTemplate(e.target.value);
							}}
							choices={getTemplateChoices()}
						/>
						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href={'admin.php?page=sc-auto-fees'}
								type="text"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					</div>
				</ScForm>
			</Box>
		</CreateTemplate>
	);
};
