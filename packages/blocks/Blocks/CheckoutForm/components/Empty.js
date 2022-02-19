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
import Setup from './Setup';
import SelectForm from './SelectForm';

export default ({ attributes, setAttributes }) => {
	const { title, step } = attributes;
	const [form, setForm] = useState({});

	const blockProps = useBlockProps();

	/**
	 * Maybe create the template for the form.
	 */
	const maybeCreateTemplate = async (attributes) => {
		const { template = 'standard', choices, choice_type } = attributes;

		const result = await apiFetch({
			url: ceData.plugin_url + '/templates/forms/' + template + '.html',
			parse: false,
			cache: 'no-cache',
		});

		// parse blocks.
		const parsed = parse(parse(await result.text()));

		// get the price selector block
		const priceChoiceBlock = parsed.findIndex(
			(block) => block.name === 'checkout-engine/price-selector'
		);

		// maybe create price selector choices.
		if (!choices?.length || !['checkbox', 'radio'].includes(choice_type)) {
			// delete choices block.
			delete parsed[priceChoiceBlock];

			// maybe remove previous section title.
			const prev = parsed?.[priceChoiceBlock - 1];
			if (prev?.name === 'checkout-engine/section-title') {
				delete parsed[priceChoiceBlock - 1];
			}

			// maybe remove spacer.
			const next = parsed?.[priceChoiceBlock + 1];
			console.log(next);
			if (next?.name === 'core/spacer') {
				delete parsed[priceChoiceBlock + 1];
			}
			return parsed;
		}

		// add choices as inner blocks
		parsed[priceChoiceBlock].innerBlocks = choices.map((choice, index) => {
			return [
				'checkout-engine/price-choice',
				{
					price_id: choice?.id,
					quantity: choice?.quantity || 1,
					type: choice_type,
					checked: index === 0 && choice_type === 'radio',
				},
			];
		});

		return parsed;
	};

	/**
	 * Create form attributes.
	 */
	const createFormAttributes = (attributes) => {
		const { choices, choice_type } = attributes;

		if (choice_type !== 'all') {
			return {};
		}

		return {
			prices: choices,
		};
	};

	// save the form block.
	const saveFormBlock = async () => {
		setAttributes({ loading: true });

		let innerBlocksTemplate = await maybeCreateTemplate(attributes);
		let formAttributes = createFormAttributes(attributes);

		try {
			const updatedRecord = await dispatch('core').saveEntityRecord(
				'postType',
				'ce_form',
				{
					title: title || __('Untitled Form', 'checkout_engine'),
					content: serialize(
						createBlock(
							'checkout-engine/form', // name
							{
								...formAttributes,
							},
							innerBlocksTemplate
								? createBlocksFromInnerBlocksTemplate(
										innerBlocksTemplate
								  )
								: []
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
				<Setup
					attributes={attributes}
					setAttributes={setAttributes}
					onCreate={saveFormBlock}
					isNew={true}
					onCancel={() => setAttributes({ step: null })}
				/>
			</div>
		);
	}

	if (step === 'select') {
		return (
			<div {...blockProps}>
				<Placeholder
					icon={icon}
					label={__('Select a checkout form', 'checkout_engine')}
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
							<Button
								isPrimary
								onClick={() => {
									setAttributes({ id: form?.id });
								}}
							>
								{__('Choose', 'checkout_engine')}
							</Button>
							<Button
								onClick={() => setAttributes({ step: null })}
							>
								{__('Cancel', 'checkout_engine')}
							</Button>
						</div>
					</div>
				</Placeholder>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<Placeholder
				icon={icon}
				instructions={__(
					'Get started by selecting a form or start build a new form.',
					'checkout_engine'
				)}
				label={__('Add a checkout form', 'checkout_engine')}
			>
				<div>
					<Button
						isPrimary
						onClick={() => setAttributes({ step: 'new' })}
					>
						{__('New Form', 'checkout_engine')}
					</Button>
					<Button
						isSecondary
						onClick={() => setAttributes({ step: 'select' })}
					>
						{__('Select Form', 'checkout_engine')}
					</Button>
				</div>
			</Placeholder>
		</div>
	);
};
