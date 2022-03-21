/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Button } from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';
import {
	createBlock,
	parse,
	serialize,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';

import { receipt as icon } from '@wordpress/icons';

/**
 * Components
 */
import SelectForm from './SelectForm';
import { CeButton, CeInput } from '@checkout-engine/components-react';
import PlaceholderTemplate from '../../../components/PlaceholderTemplate';

export default ({ attributes, setAttributes }) => {
	const { title, step } = attributes;
	const [form, setForm] = useState({});

	const blockProps = useBlockProps({
		css: css`
			--ce-color-primary-500: var(--wp-admin-theme-color);
			--ce-focus-ring-color-primary: var(--wp-admin-theme-color);
			--ce-input-border-color-focus: var(--wp-admin-theme-color);
			.components-placeholder.components-placeholder {
				padding: 2em;
			}
		`,
	});

	// save the form block.
	const saveFormBlock = async () => {
		setAttributes({ loading: true });

		try {
			const updatedRecord = await dispatch('core').saveEntityRecord(
				'postType',
				'sc_form',
				{
					title: title || __('Untitled Form', 'surecart'),
					content: serialize(
						createBlock(
							'checkout-engine/form', // name
							{},
							[]
						)
					),
					status: 'publish',
				}
			);
			setAttributes({ id: updatedRecord.id });
		} catch (e) {
			// TODO: Add notice here.
			console.error(e);
		} finally {
			setAttributes({ loading: false });
		}
	};

	if (step === 'new') {
		return (
			<div {...blockProps}>
				<PlaceholderTemplate
					header={__('Create a Checkout Form', 'checkout-engine')}
				>
					<div
						css={css`
							display: grid;
							gap: 0.5em;
							width: 100%;
						`}
					>
						<div>{__('Form Title', 'surecart')}</div>
						<CeInput
							css={css`
								max-width: 400px;
							`}
							value={title}
							placeholder={__(
								'Enter a title for your form',
								'surecart'
							)}
							onCeChange={(e) =>
								setAttributes({ title: e.target.value })
							}
						/>
						<div>
							<CeButton
								type="primary"
								onClick={() => {
									saveFormBlock();
								}}
							>
								{__('Next', 'surecart')}
								<ce-icon
									name="arrow-right"
									slot="suffix"
								></ce-icon>
							</CeButton>
							<CeButton
								type="text"
								onClick={() => setAttributes({ step: null })}
							>
								{__('Cancel', 'surecart')}
							</CeButton>
						</div>
					</div>
				</PlaceholderTemplate>
			</div>
		);
	}

	if (step === 'select') {
		return (
			<div {...blockProps}>
				<PlaceholderTemplate
					header={__('Select a checkout form', 'checkout-engine')}
				>
					<div
						css={css`
							display: grid;
							gap: 0.5em;
							width: 100%;
						`}
					>
						<SelectForm form={form} setForm={setForm} />
						<div>
							<CeButton
								type="primary"
								onClick={() => {
									setAttributes({ id: form?.id });
								}}
							>
								{__('Choose', 'surecart')}
								<ce-icon
									name="arrow-right"
									slot="suffix"
								></ce-icon>
							</CeButton>
							<CeButton
								type="text"
								onClick={() => setAttributes({ step: null })}
							>
								{__('Cancel', 'surecart')}
							</CeButton>
						</div>
					</div>
				</PlaceholderTemplate>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<Placeholder
				icon={icon}
				instructions={__(
					'Get started by selecting a form or start build a new form.',
					'surecart'
				)}
				label={__('Add a checkout form', 'surecart')}
			>
				<div
					css={css`
						display: flex;
						gap: 0.5em;
					`}
				>
					<CeButton
						type="primary"
						onClick={() => setAttributes({ step: 'new' })}
					>
						{__('New Form', 'surecart')}
					</CeButton>
					<CeButton
						type="default"
						onClick={() => setAttributes({ step: 'select' })}
					>
						{__('Select Form', 'surecart')}
					</CeButton>
				</div>
			</Placeholder>
		</div>
	);
};
