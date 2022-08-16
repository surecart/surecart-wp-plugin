/** @jsx jsx */
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScButton,
	ScForm,
	ScFormRow,
	ScSwitch,
	ScInput,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [testMode, setTestMode] = useState(false);
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	// create the product.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const customer = await saveEntityRecord(
				'surecart',
				'customer',
				{
					name,
					email,
					live_mode: !testMode,
				},
				{ throwOnError: true }
			);
			setId(customer.id);
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

			<Box title={__('Create New Customer', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScFormRow>
							<ScInput
								label={__('Customer Name', 'surecart')}
								className="sc-customer-name"
								help={__(
									'A name for your product.',
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

							<ScInput
								label={__('Customer Email', 'surecart')}
								className="sc-customer-name"
								help={__("Your customer's email.", 'surecart')}
								onScChange={(e) => {
									setEmail(e.target.value);
								}}
								value={email}
								name="email"
								type="email"
								required
								autofocus
							/>
						</ScFormRow>

						<ScSwitch
							checked={testMode}
							onScChange={(e) => setTestMode(e.target.checked)}
						>
							{__('Test Mode', 'surecart')}
							<span slot="description">
								{__(
									'Create this customer in test mode if you are going to use this account for test mode purchasing.',
									'surecart'
								)}
							</span>
						</ScSwitch>

						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href={'admin.php?page=sc-customers'}
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
