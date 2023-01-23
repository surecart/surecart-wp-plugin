/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScForm, ScInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import { useEffect, useRef } from 'react';

export default ({ onRequestClose, onSubmit, loading }) => {
	const [linkData, setLinkData] = useState();
	const field = useRef();

	const onLinkDataChange = (e) => {
		setLinkData((state) => ({ ...state, [e.target.name]: e.target.value }));
	};

	const onFormSubmit = () => {
		onSubmit(linkData);
	};

	useEffect(() => {
		setTimeout(() => {
			field.current.triggerFocus();
		});
	}, []);

	return (
		<Fragment>
			<Modal
				title={__('Add External Link', 'surecart')}
				css={css`
					max-width: 500px !important;
					width: 100% !important;
					.components-modal__content {
						overflow: visible !important;
					}
				`}
				overlayClassName={'sc-modal-overflow'}
				onRequestClose={onRequestClose}
				shouldCloseOnClickOutside={false}
			>
				<ScForm
					onScFormSubmit={onFormSubmit}
					css={css`
						--sc-form-row-spacing: var(--sc-spacing-large);
					`}
				>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScInput
							label={__('Link Name', 'surecart')}
							help={__('A display name for file.', 'surecart')}
							value={linkData?.name}
							onScInput={onLinkDataChange}
							name="name"
							required
							ref={field}
						/>
						<ScInput
							label={__('Link URL', 'surecart')}
							help={__('A valid file URL.', 'surecart')}
							value={linkData?.url}
							onScInput={onLinkDataChange}
							name="url"
							required
						/>
					</div>

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
							busy={loading}
							disabled={loading}
							submit
						>
							{__('Add Link', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={onRequestClose}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
					{loading && <sc-block-ui></sc-block-ui>}
				</ScForm>
			</Modal>
		</Fragment>
	);
};
