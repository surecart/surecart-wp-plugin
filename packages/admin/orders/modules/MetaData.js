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
import MetaDataModal from './MetaDataModal';

export default ({ order, loading }) => {
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

	const metadatas = Object.keys(metadata || {}).map((key) => ({
		key,
		label: key.charAt(0).toUpperCase() + key.slice(1).replaceAll('_', ' '),
		value: metadata[key],
	}));

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
					{metadatas.map(({ key, label, value }) => (
						<div key={key}>
							<ScText
								tag="h3"
								style={{
									'--font-weight':
										'var(--sc-font-weight-bold)',
									'--font-size': 'var(--sc-font-size-medium)',
								}}
							>
								{label}
							</ScText>
							<div>{value}</div>
						</div>
					))}
				</div>
			</Box>

			{modalOpen && (
				<MetaDataModal
					open={modalOpen}
					onRequestClose={() => setModalOpen(false)}
					order={order}
					metadatas={metadatas}
				/>
			)}
		</>
	);
};
