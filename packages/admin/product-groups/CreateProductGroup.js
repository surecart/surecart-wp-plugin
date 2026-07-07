/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';

import { ScAlert, ScButton, ScForm, ScInput } from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';

export default ({ id, setId, navigation } = {}) => {
	const [isSaving, setIsSaving] = useState(false);
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const group = await saveEntityRecord(
				'surecart',
				'product-group',
				{
					name,
				},
				{ throwOnError: true }
			);
			setId(group.id);
		} catch (err) {
			console.error(err);
			setError(err?.message || __('Something went wrong.', 'surecart'));
			setIsSaving(false);
		}
	};

	const cancelProps = navigation
		? {
				onClick: (e) => {
					e.preventDefault();
					navigation.goToList();
				},
		  }
		: { href: 'admin.php?page=sc-product-groups' };

	return (
		<CreateTemplate id={id}>
			<ScAlert open={error?.length} type="danger" closable scrollOnOpen>
				<span slot="title">{error}</span>
			</ScAlert>

			<Box title={__('Create Upgrade Group', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScInput
							label={__('Group Name', 'surecart')}
							className="sc-product-name hydrated"
							help={__(
								'A name for your upgrade group. It is not shown to customers.',
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

						<div
							css={css`
								display: flex;
								gap: var(--sc-spacing-small);
							`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton type="text" {...cancelProps}>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					</div>
				</ScForm>
			</Box>
		</CreateTemplate>
	);
};
