/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Button, ProgressBar } from '@wordpress/components';
import { useEntityRecord } from '@wordpress/core-data';
import { external } from '@wordpress/icons';
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import {
	ScDrawer,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScTag,
} from '@surecart/components-react';

export default ({ disputeId, onRequestClose }) => {
	// get the dispute.
	const { record: dispute, hasResolved } = useEntityRecord(
		'surecart',
		'dispute',
		disputeId
	);

	const renderDisputeStatusBadge = (dispute) => {
		return (
			<ScTag type={dispute?.status_type ?? 'warning'}>
				{dispute?.status_display}
			</ScTag>
		);
	};

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
						{__('Amount', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Date', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head" style={{ textAlign: 'center' }}>
						{__('View', 'surecart')}
					</ScTableCell>
					<ScTableRow>
						<ScTableCell>
							{renderDisputeStatusBadge(dispute)}
						</ScTableCell>
						<ScTableCell>{dispute?.display_amount}</ScTableCell>
						<ScTableCell>
							{dispute.created_at_date_time}
						</ScTableCell>
						<ScTableCell style={{ textAlign: 'center' }}>
							{!!dispute.external_dispute_link && (
								<Button
									variant="tertiary"
									href={dispute.external_dispute_link}
									size="small"
									label={__('View Dispute', 'surecart')}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon icon={external} size={16} />
								</Button>
							)}
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
