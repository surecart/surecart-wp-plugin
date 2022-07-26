/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { ScButton, ScLineItem, ScText } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { addQueryArgs } from '@wordpress/url';

export default ({ purchase, loading }) => {
	return (
		<Box
			title={__('Purchase', 'surecart')}
			loading={loading}
			footer={
				!loading && (
					<div>
						<ScButton
							href={addQueryArgs('admin.php', {
								page: 'sc-products',
								action: 'edit',
								id: purchase?.product?.id || purchase?.product,
							})}
						>
							{__('View Product', 'surecart')}
						</ScButton>
					</div>
				)
			}
		>
			<ScLineItem>
				{!!purchase?.product?.image_url && (
					<img src={purchase?.product?.image_url} slot="image" />
				)}
				<span slot="title">{purchase?.product?.name}</span>
				<span className="product__description" slot="description">
					<span>Qty: {purchase?.quantity}</span>{' '}
					{purchase?.revoked && (
						<sc-tag size="small" type="danger">
							{__('Revoked', 'surecart')}
						</sc-tag>
					)}
				</span>
			</ScLineItem>
		</Box>
	);
};
