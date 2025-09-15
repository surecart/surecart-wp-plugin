/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScIcon,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import useSave from '../settings/UseSave';
import Error from '../components/Error';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import Customer from './modules/Reviewer';
import Product from './modules/Product';
import Purchase from './modules/Purchase';
import Status from './modules/Status';
import ActionsDropdown from './modules/ActionsDropdown';

export default () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { save } = useSave();
	const { deleteEntityRecord, editEntityRecord, receiveEntityRecords } =
		useDispatch(coreStore);
	const id = useSelect((select) => select(dataStore).selectPageId());

	const baseUrl = select(coreStore).getEntityConfig(
		'surecart',
		'review'
	)?.baseURL;

	const { review, isSaving, loadError, isDeleting, hasLoadedReview } =
		useSelect(
			(select) => {
				const entityData = ['surecart', 'review', id];

				return {
					review: select(coreStore).getEditedEntityRecord(
						...entityData
					),
					isSaving: select(coreStore)?.isSavingEntityRecord?.(
						...entityData
					),
					loadError: select(coreStore)?.getResolutionError?.(
						'getEditedEntityRecord',
						...entityData
					),
					isDeleting: select(coreStore)?.isDeletingEntityRecord?.(
						...entityData
					),
					hasLoadedReview: select(coreStore)?.hasFinishedResolution?.(
						'getEntityRecord',
						[...entityData]
					),
				};
			},
			[id]
		);

	const updateReview = (data) =>
		editEntityRecord('surecart', 'review', id, {
			...review,
			...data,
		});

	/**
	 * Update the review.
	 */
	const onSubmit = async () => {
		try {
			await save({
				successMessage: __('Review updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	/**
	 * Delete the review.
	 */
	const onDelete = async () => {
		try {
			setError(null);
			await deleteEntityRecord('surecart', 'review', id, undefined, {
				throwOnError: true,
			});
			window.location.assign('admin.php?page=sc-reviews');
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	/**
	 * Publish the review.
	 */
	const onPublish = async () => {
		try {
			setLoading(true);
			setError(null);

			const publishedReview = await apiFetch({
				path: `${baseUrl}/${id}/publish`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Review published.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'review',
				{
					...publishedReview,
					status: 'published',
				},
				undefined,
				false,
				{
					status: 'published',
				}
			);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Unpublish the review.
	 */
	const onUnpublish = async () => {
		try {
			setLoading(true);
			setError(null);

			const unpublishedReview = await apiFetch({
				path: `${baseUrl}/${id}/unpublish`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Review unpublished.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'review',
				{
					...unpublishedReview,
					status: 'unpublished',
				},
				undefined,
				false,
				{
					status: 'unpublished',
				}
			);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	const renderReviewPublishButton = () => {
		if (review?.status === 'published') {
			return (
				<ScButton
					type="primary"
					loading={loading}
					onClick={() => setModal('unpublish')}
				>
					{__('Unpublish Review', 'surecart')}
				</ScButton>
			);
		}

		return (
			<ScButton
				type="primary"
				loading={loading}
				onClick={() => setModal('publish')}
			>
				{__('Publish Review', 'surecart')}
			</ScButton>
		);
	};

	return (
		<UpdateModel
			onSubmit={onSubmit}
			title={
				<ScFlex style={{ gap: '1em' }} align-items="center">
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-reviews"
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-reviews">
							{__('Reviews', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('Review', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</ScFlex>
			}
			button={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ActionsDropdown review={review} onDelete={onDelete} />

					{renderReviewPublishButton()}
				</div>
			}
			sidebar={
				<>
					<Status review={review || {}} loading={!hasLoadedReview} />
					<Customer
						customer={review?.customer}
						loading={!hasLoadedReview}
					/>
					<Product
						product={review?.product}
						loading={!hasLoadedReview}
					/>
					<Purchase
						purchase={review?.purchase}
						loading={!hasLoadedReview}
					/>
				</>
			}
		>
			<Error
				error={error || loadError}
				setError={setError}
				margin="80px"
			/>
			<Details
				review={review || {}}
				updateReview={updateReview}
				loading={!hasLoadedReview}
				saving={isSaving}
				deleting={isDeleting}
			/>
			<ConfirmDialog
				isOpen={'publish' === modal}
				onConfirm={() => {
					onPublish();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__(
					'Are you sure you want to publish this review?',
					'surecart'
				)}
			</ConfirmDialog>

			<ConfirmDialog
				isOpen={'unpublish' === modal}
				onConfirm={() => {
					onUnpublish();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__(
					'Are you sure you want to unpublish this review?',
					'surecart'
				)}
			</ConfirmDialog>
		</UpdateModel>
	);
};
