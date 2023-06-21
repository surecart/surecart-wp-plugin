/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';

/**
 * Internal dependencies.
 */
import { ScAlert, ScButton, ScForm, ScInput, ScRichText } from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	// create the product collection.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const productCollection = await saveEntityRecord(
				'surecart',
				'product-collection',
				{
					name,
					description,
				},
				{ throwOnError: true }
			);
			setId(productCollection.id);
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

			<Box title={__('Create Collection', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScInput
							label={__('Collection Name', 'surecart')}
							className="sc-product-name hydrated"
							help={__(
								'A name for your product collection.',
								'surecart'
							)}
							onScChange={(e) => {
								setName(e.target.value);
							}}
							value={name}
							name="name"
							required
							autofocus
						/>
						<ScRichText
							label={__('Description', 'surecart')}
							placeholder={__('Enter a description...', 'surecart')}
							help={__(
								'A short description for your product collection.',
								'surecart'
							)}
							style={{ '--sc-rich-text-max-height': '200px' }}
							maxlength={2500}
							onScInput={(e) => {
								setDescription(e.target.value);
							}}
							value={description}
							name="description"
						/>
						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href={'admin.php?page=sc-products'}
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
