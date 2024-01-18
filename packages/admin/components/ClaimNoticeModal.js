/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { ScButton, ScIcon } from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ title, bodyText, onRequestClose, claimUrl }) => {
	return (
		<Modal
			title={title}
			css={css`
				width: 100%;
				box-sizing: border-box;
			`}
			overlayClassName={'sc-modal-overflow'}
			onRequestClose={onRequestClose}
			shouldCloseOnClickOutside={true}
		>
			<Global
				styles={css`
					.sc-modal-overflow {
						box-sizing: border-box;
						.components-modal__content,
						.components-modal__frame {
							/* overflow: visible !important; */
							box-sizing: border-box;
							max-width: 480px !important;
							width: 100%;
						}
					}
				`}
			/>
			{bodyText}
			<div
				css={css`
					margin-top: var(--sc-spacing-xx-large);
				`}
			>
				<ScButton type="primary" href={claimUrl} disabled={!claimUrl}>
					{__('Complete Setup', 'surecart')}
					<ScIcon slot="suffix" name="arrow-right" />
				</ScButton>
			</div>
		</Modal>
	);
};
