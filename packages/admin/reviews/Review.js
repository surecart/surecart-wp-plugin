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
import { addQueryArgs } from '@wordpress/url';
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
	ScTag,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import useSave from '../settings/UseSave';
import Error from '../components/Error';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import Summary from './modules/Summary';
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

	const updateReview = (data) =>
		editEntityRecord('surecart', 'review', id, data);

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
				path: addQueryArgs(`${baseUrl}/${id}/publish`),
				method: 'PATCH',
			});

			createSuccessNotice(__('Review approved.', 'surecart'), {
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
				path: addQueryArgs(`${baseUrl}/${id}/unpublish`),
				method: 'PATCH',
			});

			createSuccessNotice(__('Review rejected.', 'surecart'), {
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
		const isPublished = review?.status === 'published';
		return (
			<>
				<ScTag type={review?.status_type}>
					{review?.status_display}
				</ScTag>

				<ScButton
					type="primary"
					loading={loading}
					onClick={() =>
						setModal(isPublished ? 'unpublish' : 'publish')
					}
				>
					{isPublished
						? __('Reject Review', 'surecart')
						: __('Approve Review', 'surecart')}
				</ScButton>
			</>
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
					<ActionsDropdown
						review={review}
						onDelete={onDelete}
						{...('in_review' === review?.status
							? { onUnpublish }
							: {})}
					/>

					{renderReviewPublishButton()}
				</div>
			}
			sidebar={<Summary review={review} loading={!hasLoadedReview} />}
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
					'Are you sure you want to approve this review?',
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
				{__('Are you sure you want to reject this review?', 'surecart')}
			</ConfirmDialog>
		</UpdateModel>
	);
};
