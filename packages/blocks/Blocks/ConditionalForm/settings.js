/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, Button, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import Rules from './rules';
import translations from './translations';
import { ScTag } from '@surecart/components-react';

const Settings = ({ attributes, setAttributes }) => {
	const { rule_groups } = attributes;

	const [isOpen, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	let rule_data = rule_groups || [];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Conditions', 'surecart')}>
					<PanelRow
						css={css`
							flex-wrap: wrap;
							justify-content: flex-start;
						`}
					>
						{!rule_data?.length &&
							__(
								'Configure different visibility conditions to control when the contents appear to customers.',
								'surecart'
							)}
						{(rule_data || []).map(({ rules }) => {
							return (rules || []).map((rule) => (
								<ScTag>{translations?.[rule?.condition]}</ScTag>
							));
						})}
					</PanelRow>
					<PanelRow>
						<Button variant="secondary" onClick={openModal}>
							{__('Configure Conditions', 'surecart')}
						</Button>
						{isOpen && (
							<Modal
								title={__('Configure Conditions', 'surecart')}
								onRequestClose={closeModal}
								css={css`
									width: 75%;
									max-width: 650px;
									max-height: 80%;
								`}
							>
								<Rules
									attributes={attributes}
									setAttributes={setAttributes}
									closeModal={closeModal}
								/>
							</Modal>
						)}
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Settings;
