/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { Modal, Button } from '@wordpress/components';
import { ScButton, ScForm } from '@surecart/components-react';
import SelectIntegration from './SelectIntegration';

export default ({ onRequestClose, onCreate }) => {
	const [provider, setProvider] = useState(null);
	const [item, setItem] = useState(null);

	const onSubmit = async (e) => {
		onCreate({ provider, item });
		onRequestClose();
	};

	return (
		<Fragment>
			<Global
				styles={css`
					.sc-modal-overflow .components-modal__frame {
						overflow: visible !important;
					}
				`}
			/>
			<Modal
				title={__('Add Integration', 'surecart')}
				css={css`
					max-width: 500px !important;
					.components-modal__content {
						overflow: visible !important;
					}
				`}
				overlayClassName={'sc-modal-overflow'}
				onRequestClose={onRequestClose}
				shouldCloseOnClickOutside={false}
			>
				<ScForm
					onScFormSubmit={onSubmit}
					css={css`
						--sc-form-row-spacing: var(--sc-spacing-large);
					`}
				>
					<SelectIntegration
						model="product"
						providerName={provider}
						setProvider={setProvider}
						item={item}
						setItem={setItem}
					/>

					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<ScButton
							type="primary"
							style={{
								'--button-border-radius':
									'--sc-input-border-radius-small',
							}}
							submit
						>
							{__('Add Integration', 'surecart')}
						</ScButton>
						<Button onClick={onRequestClose}>
							{__('Cancel', 'surecart')}
						</Button>
					</div>
				</ScForm>
			</Modal>
		</Fragment>
	);
};
