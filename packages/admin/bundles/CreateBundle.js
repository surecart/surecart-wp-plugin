/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

import { ScButton, ScForm, ScInput } from '@surecart/components-react';
import Error from '../components/Error';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';

export default ({ onCreateProduct }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const product = await saveEntityRecord(
				'surecart',
				'product',
				{
					name,
					auto_fulfill_enabled: true,
					bundle: true,
				},
				{ throwOnError: true }
			);

			if (!product?.id) {
				throw {
					message: __(
						'Could not create bundle. Please try again.',
						'surecart'
					),
				};
			}

			onCreateProduct(product.id);
		} catch (e) {
			console.error(e);
			setError(e);
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate>
			<Error error={error} setError={setError} />

			<Box title={__('Create New Bundle', 'surecart')}>
				<ScForm
					onScSubmit={onSubmit}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							onSubmit(e);
						}
					}}
				>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScInput
							label={__('Bundle Name', 'surecart')}
							className="sc-bundle-name hydrated"
							help={__('A name for your bundle.', 'surecart')}
							onScInput={(e) => setName(e.target.value)}
							value={name}
							name="name"
							required
							autofocus
						/>

						<div
							css={css`
								display: flex;
								gap: var(--sc-spacing-small);
							`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href={addQueryArgs('admin.php', {
									page: 'sc-bundles',
								})}
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
