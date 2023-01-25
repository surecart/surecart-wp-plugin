/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScTag } from '@surecart/components-react';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { Button, Modal, PanelBody, PanelRow, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { edit } from '@wordpress/icons';

import Rules from './rules';
import translations from './translations';

const Settings = ({ attributes, setAttributes }) => {
	const { rule_groups } = attributes;

	const [isOpen, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	let rule_data = rule_groups || [];

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={edit}
						label={__('Edit Conditions', 'surecart')}
						onClick={openModal}
					/>
				</ToolbarGroup>
			</BlockControls>
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
						{(rule_data || []).map(({ rules, rulesIndex }) => {
							return (rules || []).map((rule, index) => (
								<ScTag key={`${rulesIndex}${index}`}>
									{translations?.[rule?.condition]}
								</ScTag>
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
								shouldCloseOnClickOutside={false}
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
