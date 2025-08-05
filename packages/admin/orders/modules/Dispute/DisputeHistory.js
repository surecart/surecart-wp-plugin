/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { ProgressBar } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import {
	ScDrawer,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScTag,
	ScText,
} from '@surecart/components-react';

export default ({ disputeId, onRequestClose }) => {
	const renderDisputeStatusBadge = (status) => {
		switch (status) {
			case 'warning_needs_response':
				return (
					<ScTag type="warning">
						{__('Needs Response', 'surecart')}
					</ScTag>
				);
			case 'warning_under_review':
				return (
					<ScTag type="warning">
						{__('Under Review', 'surecart')}
					</ScTag>
				);
			case 'warning_closed':
				return <ScTag type="default">{__('Closed', 'surecart')}</ScTag>;
			case 'needs_response':
				return (
					<ScTag type="danger">
						{__('Needs Response', 'surecart')}
					</ScTag>
				);
			case 'under_review':
				return (
					<ScTag type="info">{__('Under Review', 'surecart')}</ScTag>
				);
			case 'charge_refunded':
				return (
					<ScTag type="success">
						{__('Charge Refunded', 'surecart')}
					</ScTag>
				);
			case 'pending':
				return (
					<ScTag type="default">{__('Pending', 'surecart')}</ScTag>
				);
			case 'won':
				return <ScTag type="success">{__('Won', 'surecart')}</ScTag>;
			case 'lost':
				return <ScTag type="danger">{__('Lost', 'surecart')}</ScTag>;
		}
		return <ScTag>{status || __('Unknown', 'surecart')}</ScTag>;
	};

	// get the dispute.
	const { records: disputes, hasResolved } = useEntityRecords(
		'surecart',
		'dispute',
		{
			context: 'edit',
			ids: [disputeId],
			per_page: 100,
		}
	);

	const dispute = disputes?.[0] || {};

	const renderContent = () => {
		if (!hasResolved) {
			return (
				<div
					css={css`
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100%;
					`}
				>
					<ProgressBar />
				</div>
			);
		}

		return (
			<div>
				<ScTable>
					<ScTableCell slot="head">
						{__('Status', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Reason', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Amount', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head" style={{ textAlign: 'right' }}>
						{__('Date', 'surecart')}
					</ScTableCell>
					<ScTableRow>
						<ScTableCell>
							{renderDisputeStatusBadge(dispute.status)}
						</ScTableCell>
						<ScTableCell>
							<ScText
								css={css`
									color: var(--sc-color-gray-500);
								`}
							>
								{dispute?.reason ||
									__('Fraudulent', 'surecart')}
							</ScText>
						</ScTableCell>
						<ScTableCell>
							<sc-format-number
								type="currency"
								currency={dispute?.currency}
								value={dispute?.amount}
							/>
						</ScTableCell>
						<ScTableCell>
							{dispute.created_at_date_time}
						</ScTableCell>
					</ScTableRow>
				</ScTable>

				{dispute?.evidence_details && (
					<div
						css={css`
							margin-top: var(--sc-spacing-large);
						`}
					>
						<h4>{__('Evidence Details', 'surecart')}</h4>
						<p>
							{__('Due by:', 'surecart')}{' '}
							{dispute.evidence_details.due_by_date}
						</p>
					</div>
				)}
			</div>
		);
	};

	return (
		<>
			<ScDrawer
				style={{ '--sc-drawer-size': '48rem' }}
				open={true}
				stickyHeader
				onScAfterHide={() => onRequestClose()}
				label={__('Dispute Details', 'surecart')}
			>
				{renderContent()}
			</ScDrawer>
		</>
	);
};
