/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';

import { ScAlert, ScButton, ScForm, ScInput } from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [funnel, setFunnel] = useState(null);
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	const updateFunnel = (data) => {
		setFunnel({
			...(funnel || {}),
			...data,
		});
	};

	// create the product.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const product = await saveEntityRecord(
				'surecart',
				'upsell-funnel',
				funnel,
				{ throwOnError: true }
			);
			setId(product.id);
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

			<Box title={__('Create New Upsell Funnel', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScInput
							required
							label={__('Name', 'surecart')}
							help={__(
								'Internal upsell funnel name. This is NOT visible to customers.',
								'surecart'
							)}
							onScInput={(e) =>
								updateFunnel({ name: e.target.value })
							}
							value={funnel?.name}
							name="name"
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
								href={'admin.php?page=sc-upsell-funnels'}
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
