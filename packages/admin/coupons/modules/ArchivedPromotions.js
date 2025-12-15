/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import {
	ScBlockUi,
	ScDrawer,
	ScEmpty,
	ScIcon,
} from '@surecart/components-react';
import Code from './Code';
import PrevNextButtons from '../../ui/PrevNextButtons';

export default ({ open, couponId, onRequestClose, onUpdate }) => {
	if (!open) {
		return null;
	}

	const { createErrorNotice } = useDispatch(noticesStore);
	const [loading, setLoading] = useState(false);
	const [promotions, setPromotions] = useState([]);
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const perPage = 10;

	useEffect(() => {
		if (open) {
			fetchArchivedPromotions();
		}
	}, [open, page]);

	const fetchArchivedPromotions = async () => {
		try {
			setLoading(true);
			const response = await apiFetch({
				path: addQueryArgs('/surecart/v1/promotions', {
					coupon_ids: [couponId],
					archived: true,
					per_page: perPage,
					page,
				}),
				parse: false,
			});

			const data = await response.json();
			const total = parseInt(
				response.headers.get('X-WP-Total') || '0',
				10
			);

			setPromotions(data);
			setTotalCount(total);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setPage(1);
		onRequestClose();
	};

	const hasPagination = totalCount > perPage;

	const renderContent = () => {
		if (loading) {
			return <ScBlockUi spinner />;
		}

		if (!promotions?.length) {
			return (
				<div
					style={{
						padding: 'var(--sc-drawer-body-spacing)',
					}}
				>
					<ScEmpty icon="archive">
						{__('No archived promotion codes', 'surecart')}
					</ScEmpty>
				</div>
			);
		}

		const handleUpdate = () => {
			fetchArchivedPromotions();
			onUpdate?.();
		};

		return (
			<div style={{ padding: 'var(--sc-spacing-medium)' }}>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						gap: var(--sc-spacing-medium);
					`}
				>
					{promotions.map((promotion) => (
						<Code
							promotion={promotion}
							key={promotion?.id}
							onUpdate={handleUpdate}
						/>
					))}
				</div>

				{hasPagination && (
					<div style={{ marginTop: 'var(--sc-spacing-medium)' }}>
						<PrevNextButtons
							data={promotions}
							page={page}
							setPage={setPage}
							perPage={perPage}
							totalItems={totalCount}
							loading={loading}
						/>
					</div>
				)}
			</div>
		);
	};

	return (
		<ScDrawer
			style={{ '--sc-drawer-size': '500px' }}
			open={open}
			onScAfterHide={handleClose}
		>
			<span
				slot="header"
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: 'var(--sc-drawer-header-spacing)',
					borderBottom: 'var(--sc-drawer-border)',
				}}
			>
				<span>
					{__('Archived Promotion Codes', 'surecart')}
					{totalCount > 0 && (
						<span style={{ opacity: 0.6, marginLeft: '0.5em' }}>
							({totalCount})
						</span>
					)}
				</span>
				<ScIcon
					style={{ cursor: 'pointer' }}
					name="x"
					onClick={handleClose}
				/>
			</span>

			{renderContent()}
		</ScDrawer>
	);
};
