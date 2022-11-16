/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';
import PriceSelector from '@admin/components/PriceSelector';

import {
	ScAlert,
	ScButton,
	ScForm,
	ScFormControl,
} from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [price, setPrice] = useState('');
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	// create the product.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const product = await saveEntityRecord(
				'surecart',
				'bump',
				{
					price,
				},
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

			<Box title={__('Create New Order Bump', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScFormControl
							label={__('Order Bump Price', 'surecart')}
							help={__(
								'This is the price for the bump.',
								'surecart'
							)}
						>
							<PriceSelector
								required
								value={price}
								ad_hoc={false}
								onSelect={(price) => setPrice(price)}
								requestQuery={{
									archived: false,
								}}
							/>
						</ScFormControl>

						<div
							css={css`display: flex; gap: var(--sc-spacing-small);`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href={'admin.php?page=sc-bumps'}
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
