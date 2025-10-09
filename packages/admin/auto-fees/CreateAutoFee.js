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
	ScChoice,
	ScChoices,
	ScInput,
} from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';
import templates from './templates';

export default ({ id, onCreateAutoFee }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [autoFeeName, setAutoFeeName] = useState('');
	const [currentTemplate, setCurrentTemplate] = useState(null);
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	const getTemplateChoices = () => {
		return Object.entries(templates).map(([key, template]) => ({
			label: template?.name || key,
			value: key,
			description: template?.description,
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
					name: autoFeeName,
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
			<ScForm onScSubmit={onSubmit}>
				<Box
					title={__('Create New Dynamic Price', 'surecart')}
					footer={
						<div
							css={css`
								display: flex;
								width: 100%;
								justify-content: space-between;
							`}
						>
							<ScButton
								href={'admin.php?page=sc-auto-fees'}
								type="default"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
						</div>
					}
				>
					<ScInput
						label={__('Name', 'surecart')}
						help={__("Your Dynamic Price's name.", 'surecart')}
						value={autoFeeName}
						required
						onScInput={(e) => setAutoFeeName(e.target.value)}
					/>
					<ScChoices
						label={__('Select Recipes', 'surecart')}
						onScChange={(e) => setCurrentTemplate(e.target.value)}
						style={{ '--sc-choice-padding': '1.3em' }}
						autoWidth
						required
					>
						{(getTemplateChoices() || []).map((template) => {
							return (
								<ScChoice
									key={template.value}
									showControl={false}
									checked={currentTemplate === template.value}
									value={template.value}
									style={{ width: '48%' }}
								>
									{template.label}
									{!!template.description && (
										<div
											style={{
												'margin-top': '0.5em',
											}}
											slot="description"
										>
											{template.description}
										</div>
									)}
								</ScChoice>
							);
						})}
					</ScChoices>
				</Box>
			</ScForm>
		</CreateTemplate>
	);
};
