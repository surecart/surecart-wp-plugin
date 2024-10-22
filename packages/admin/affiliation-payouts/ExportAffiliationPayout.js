/**
 * Wordpress dependencies.
 */
import { css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { ScButton, ScForm, ScInput } from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import { useEffect, useState } from '@wordpress/element';
import Box from '../ui/Box';
import Error from '../components/Error';

export default () => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const fetchAndPrefillEmail = async () => {
		setIsLoading(true);
		const currentUser = await apiFetch({
			path: addQueryArgs('/wp/v2/users/me', {
				context: 'edit',
			}),
		});
		setEmail(currentUser?.email);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchAndPrefillEmail();
	}, []);

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
			console.error(e);
			setIsSaving(false);
			setError(e);
		}
	};

	return (
		<CreateTemplate>
			<Box title={__('Export Payouts', 'surecart')} loading={isLoading}>
				<Error error={error} setError={setError} />
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
