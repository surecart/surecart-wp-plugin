/**
 * Wordpress dependencies.
 */
import { css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import { ScAlert, ScButton, ScForm, ScInput } from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import { useState } from '@wordpress/element';
import Box from '../ui/Box';

export default () => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			setIsSaving(true);

			const savedExport = await saveEntityRecord(
				'surecart',
				'export',
				{
					email,
					type: 'payouts',
				},
				{ throwOnError: true }
			);

			if (!savedExport?.id) {
				throw {
					message: __(
						'Could not create export. Please try again.',
						'surecart'
					),
				};
			}

			window.location.href = addQueryArgs('admin.php', {
				page: 'sc-affiliate-payouts',
			});
		} catch (e) {
			console.log(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate>
			<ScAlert open={error?.length} type="danger" closable scrollOnOpen>
				<span slot="title">{error}</span>
			</ScAlert>
			<Box title={__('Export Payouts', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<ScInput
						type="email"
						label={__('Email', 'surecart')}
						onScInput={(e) => setEmail(e.target.value)}
						value={email}
						required
						help={__(
							'We will send you an email with a link to your export when it is ready.',
							'surecart'
						)}
					/>

					<div
						css={css`
							display: flex;
							gap: var(--sc-spacing-small);
							margin-top: var(--sc-spacing-large);
						`}
					>
						<ScButton type="primary" submit loading={isSaving}>
							{__('Export', 'surecart')}
						</ScButton>
						<ScButton
							href={'admin.php?page=sc-affiliate-payouts'}
							type="text"
						>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
				</ScForm>
			</Box>
		</CreateTemplate>
	);
};
