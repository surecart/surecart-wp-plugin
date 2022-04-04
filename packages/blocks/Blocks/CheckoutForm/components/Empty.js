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
import admin from '../../../../admin/styles/admin';

/**
 * Components
 */
import SelectForm from './SelectForm';
import { ScButton, ScInput } from '@surecart/components-react';
import PlaceholderTemplate from '../../../components/PlaceholderTemplate';
import { styles } from '../../../../admin/styles/admin';

export default ({ attributes, setAttributes }) => {
	const { title, step } = attributes;
	const [form, setForm] = useState({});

	const blockProps = useBlockProps({
		css: css`
			.components-placeholder.components-placeholder {
				padding: 2em;
			}
		`,
		style: styles,
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
							'surecart/form', // name
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
					header={__('Create a Checkout Form', 'surecart')}
				>
					<div
						css={css`
							display: grid;
							gap: 0.5em;
							width: 100%;
						`}
					>
						<div>{__('Form Title', 'surecart')}</div>
						<ScInput
							css={css`
								max-width: 400px;
							`}
							value={title}
							placeholder={__(
								'Enter a title for your form',
								'surecart'
							)}
							onScChange={(e) =>
								setAttributes({ title: e.target.value })
							}
						/>
						<div>
							<ScButton
								type="primary"
								onClick={() => {
									saveFormBlock();
								}}
							>
								{__('Next', 'surecart')}
								<sc-icon
									name="arrow-right"
									slot="suffix"
								></sc-icon>
							</ScButton>
							<ScButton
								type="text"
								onClick={() => setAttributes({ step: null })}
							>
								{__('Cancel', 'surecart')}
							</ScButton>
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
					header={__('Select a checkout form', 'surecart')}
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
							<ScButton
								type="primary"
								onClick={() => {
									setAttributes({ id: form?.id });
								}}
							>
								{__('Choose', 'surecart')}
								<sc-icon
									name="arrow-right"
									slot="suffix"
								></sc-icon>
							</ScButton>
							<ScButton
								type="text"
								onClick={() => setAttributes({ step: null })}
							>
								{__('Cancel', 'surecart')}
							</ScButton>
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
					<ScButton
						type="primary"
						onClick={() => setAttributes({ step: 'new' })}
					>
						{__('New Form', 'surecart')}
					</ScButton>
					<ScButton
						type="default"
						onClick={() => setAttributes({ step: 'select' })}
					>
						{__('Select Form', 'surecart')}
					</ScButton>
				</div>
			</Placeholder>
		</div>
	);
};
