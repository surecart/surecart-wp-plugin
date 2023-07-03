/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScButton, ScForm, ScInput, ScRichText } from '@surecart/components-react';
import Error from '../components/Error';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';
import Permalink from '../components/Permalink';
import { slugify } from '../util/slug';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [slug, setSlug] = useState('');
	const [slugCustomized, setSlugCustomized] = useState(false);
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
					slug,
					description,
				},
				{ throwOnError: true }
			);

			if (!productCollection?.id) {
				throw {
					message: __(
						'Could not create product collection. Please try again.',
						'sureacrt'
					),
				};
			}

			setId(productCollection.id);
		} catch (e) {
			console.error(e);
			setError(e);
			setIsSaving(false);
		}
	};

	useEffect(() => {
		if (name && !slugCustomized) {
			setSlug(slugify(name));
		}
	}, [name]);

	return (
		<CreateTemplate id={id}>
			<Error
				error={error}
				setError={setError}
			/>

			<Box
				title={__('Create Collection', 'surecart')}
				css={css`
					margin-top: var(--sc-spacing-large);
				`}
			>
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
						<Permalink
							baseUrl={`${scData?.home_url}/${scData?.collection_page_slug}`}
							name={'slug'}
							value={slug}
							onChange={setSlug}
							onCustomized={setSlugCustomized}
							required
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
