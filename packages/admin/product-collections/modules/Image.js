/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import { ScBlockUi, ScButton, ScIcon } from '@surecart/components-react';
import MediaLibrary from '../../components/MediaLibrary';
import Box from '../../ui/Box';
import { useState } from 'react';

export default ({ collection, updateCollection }) => {
	const [loading, setLoading] = useState(false);
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const onSelectMedia = async (media) => {
		try {
			setLoading(true);
			const response = await saveEntityRecord(
				'surecart',
				'product-collection',
				{
					id: collection.id,
					image_id: media?.id,
				},
				{ throwOnError: true }
			);
			updateCollection(response);
			createSuccessNotice(__('Image updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
			{
				(e?.additional_errors || []).map((e) => {
					createErrorNotice(
						e?.message || __('Something went wrong', 'surecart'),
						{
							type: 'snackbar',
						}
					);
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const onRemoveMedia = async () => {
		const confirmedRemoveImage = confirm(
			__('Are you sure you want to remove this image?', 'surecart')
		);
		if (!confirmedRemoveImage) return;

		try {
			setLoading(true);
			const response = await saveEntityRecord(
				'surecart',
				'product-collection',
				{
					id: collection.id,
					image_id: null,
				},
				{ throwOnError: true }
			);
			updateCollection(response);
			createSuccessNotice(__('Image removed.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
			{
				(e?.additional_errors || []).map((e) => {
					createErrorNotice(
						e?.message || __('Something went wrong', 'surecart'),
						{
							type: 'snackbar',
						}
					);
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			css={css`
				position: relative;
			`}
		>
			<Box
				title={__('Image', 'surecart')}
				footer={
					!collection?.image?.url && (
						<MediaLibrary
							onSelect={onSelectMedia}
							isPrivate={false}
							render={({ setOpen }) => (
								<ScButton onClick={() => setOpen(true)}>
									<ScIcon name="plus" slot="prefix" />
									{__('Add Image', 'surecart')}
								</ScButton>
							)}
						/>
					)
				}
			>
				{!!collection?.image?.url && (
					<div
						css={css`
							display: grid;
							gap: 1em;
						`}
					>
						<img
							src={collection?.image?.url}
							alt="image"
							css={css`
								width: 100%;
								height: 100%;
								max-height: 8rem;
								object-fit: contain;
								height: auto;
								display: block;
								border-radius: var(--sc-border-radius-medium);
								background: #f3f3f3;
							`}
						/>
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<div
								css={css`
									display: flex;
									align-items: center;
									gap: 0.5em;
								`}
							>
								<MediaLibrary
									onSelect={onSelectMedia}
									isPrivate={false}
									render={({ setOpen }) => (
										<ScButton
											type="primary"
											onClick={() => setOpen(true)}
										>
											{__('Replace', 'surecart')}
										</ScButton>
									)}
								/>
								<ScButton onClick={onRemoveMedia}>
									{__('Remove', 'surecart')}
								</ScButton>
							</div>
						</div>
					</div>
				)}
			</Box>
			{loading && (
				<ScBlockUi
					spinner
					style={{ zIndex: 9, '--sc-block-ui-opacity': '0.75' }}
				/>
			)}
		</div>
	);
};
