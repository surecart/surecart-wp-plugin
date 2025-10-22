/** @jsx jsx */
import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';
import {
	ScText,
	ScDropdown,
	ScButton,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import MetaDataEditModal from './MetaDataEditModal';

export default ({ order, loading, onUpdate }) => {
	const [modalOpen, setModalOpen] = useState(false);

	const {
		wp_created_by,
		page_id,
		page_url,
		buy_page_product_id,
		...metadata
	} = order?.checkout?.metadata || {};

	if (!Object.keys(metadata).length || loading) {
		return null;
	}

	const handleMetadataUpdate = (updatedCheckout) => {
		if (onUpdate) {
			onUpdate({
				...order,
				checkout: updatedCheckout,
			});
		}
	};

	return (
		<>
			<Box
				title={__('Additional Order Data', 'surecart')}
				header_action={
					<ScDropdown
						placement="bottom-end"
						css={css`
							margin: -12px 0px;
						`}
					>
						<ScButton slot="trigger" type="text" circle>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem onClick={() => setModalOpen(true)}>
								<ScIcon name="edit" slot="prefix" />
								{__('Edit', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				}
			>
				<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				{Object.keys(metadata).map((key) => (
					<div key={key}>
						<ScText
							tag="h3"
							style={{
								'--font-weight': 'var(--sc-font-weight-bold)',
								'--font-size': 'var(--sc-font-size-medium)',
							}}
						>
							{key.replaceAll('_', ' ')}
						</ScText>
						<div>{metadata[key]}</div>
					</div>
				))}
			</div>
		</Box>

		<MetaDataEditModal
			open={modalOpen}
			onRequestClose={() => setModalOpen(false)}
			metadata={metadata}
			orderId={order?.id}
			checkoutId={order?.checkout?.id}
			onSuccess={handleMetadataUpdate}
		/>
		</>
	);
};
