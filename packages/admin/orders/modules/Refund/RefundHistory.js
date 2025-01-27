/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';
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
import { refundReasons } from '../../../util/refunds';
import ProductLineItem from '../../../ui/ProductLineItem';
import { formatDateTime } from '../../../util/time';

export default ({ refundId, onRequestClose }) => {
	const renderRefundStatusBadge = (status) => {
		switch (status) {
			case 'pending':
				return (
					<ScTag type="warning">{__('Pending', 'surecart')}</ScTag>
				);
			case 'succeeded':
				return (
					<ScTag type="success">{__('Succeeded', 'surecart')}</ScTag>
				);
			case 'failed':
				return <ScTag type="danger">{__('Failed', 'surecart')}</ScTag>;
			case 'canceled':
				return (
					<ScTag type="danger">{__('Canceled', 'surecart')}</ScTag>
				);
		}
		return <ScTag>{status || __('Unknown', 'surecart')}</ScTag>;
	};

	const renderRefundTableRow = (item, refund) => (
		<ScTableRow key={item?.id || refund?.id}>
			<ScTableCell>
				{item?.line_item?.price?.product?.id ? (
					<ProductLineItem lineItem={item.line_item} />
				) : (
					<ScText
						css={css`
							color: var(--sc-color-gray-500);
						`}
					>
						{__('No product', 'surecart')}
					</ScText>
				)}
			</ScTableCell>
			<ScTableCell>
				{formatDateTime(refund.updated_at * 1000)}
			</ScTableCell>
			<ScTableCell>
				<sc-text
					style={{
						'--font-weight': 'var(--sc-font-weight-bold)',
					}}
				>
					{item?.quantity || 'N/A'}
				</sc-text>
			</ScTableCell>
			<ScTableCell>
				<ScText
					css={css`
						color: var(--sc-color-gray-500);
					`}
				>
					{refundReasons?.[refund.reason] ||
						__('Unknown', 'surecart')}
				</ScText>
			</ScTableCell>
			<ScTableCell>{renderRefundStatusBadge(refund.status)}</ScTableCell>
		</ScTableRow>
	);

	// get the refunds.
	const { records: refunds, hasResolved } = useEntityRecords(
		'surecart',
		'refund',
		{
			context: 'edit',
			ids: [refundId],
			per_page: 100,
			expand: [
				'refund_items',
				'refund_item.line_item',
				'line_item.price',
				'line_item.variant',
				'variant.image',
				'price.product',
				'product.featured_product_media',
				'product.product_medias',
				'product_media.media',
			],
		}
	);

	const refund = refunds?.[0] || {};

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
					<ScTableCell slot="head" style={{ width: '200px' }}>
						{__('Product', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Date', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Qty Refunded', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Reason', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Status', 'surecart')}
					</ScTableCell>
					{(refund.refund_items?.data || []).length > 0 ? (
						(refund.refund_items?.data || []).map((item) =>
							renderRefundTableRow(item, refund)
						)
					) : (
						<>{renderRefundTableRow(null, refund)}</>
					)}
				</ScTable>
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
				label={__('Refund History', 'surecart')}
			>
				{renderContent()}
			</ScDrawer>
		</>
	);
};
