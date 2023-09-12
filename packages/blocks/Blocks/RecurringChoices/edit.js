/** @jsx jsx */
import {
	ScChoice,
	ScFormatNumber,
	ScPriceInput,
	ScRecurringPriceChoiceContainer
} from '@surecart/components-react';
import { InspectorControls, useBlockProps, store as blockEditorStore, } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl, ToggleControl, Placeholder, Spinner } from '@wordpress/components';
import { Fragment, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { use, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default ({ attributes, setAttributes, clientId }) => {
	const { label, amount, currency, product_id } = attributes;

	const blockProps = useBlockProps(
		{
			css: css`
				display: flex;
				flex-direction: column;
				width: 100%;
				gap: 1em;
			`,
		}
	);

	const parentAttributes = useSelect((select) => {
		const parents = select(blockEditorStore).getBlockParents(clientId);
		const parentBlock = select(blockEditorStore).getBlocksByClientId(
			parents?.[parents?.length - 1]
		);
		return parentBlock?.[0].attributes;
	});
	
	useEffect(() => {
		setAttributes({
			product_id: parentAttributes.product_id
		});
	}, [parentAttributes]);

  	const product = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'product', product_id, { expand: ['prices'], archived: false }),
		[product_id]
	);
	const prices = product?.prices?.data?.filter(price => price?.recurring_interval).sort((a, b) => a?.position - b?.position);

	if (! prices) {
		return (
			<Spinner />
		);
	}

	return (
		<Fragment>
			<div {...blockProps}>
				<div
					css={css`
						width: 100%;
						font-size: 1em;
						font-weight: 500;
					`}
				>
					{__('Make it recurring', 'surecart')}
				</div>
				<div
					css={css`
						width: 100%;
						display: flex;
						justify-content: space-between;
						gap: 2em;
					`}
				>
					<div
						css={css`
							width: 50%;`
						}
					>
						<ScRecurringPriceChoiceContainer
							label={__('Yes, count me in!', 'surecart')}
							prices={prices}
						/>
					</div>
					<div
						css={css`
							width: 50%;`
						}
					>

						<ScChoice
							showControl={false}
							checked={false}
							value="one-time"
							css={css`
								height: 100%;`
							}
						>
							{__('No, donate once', 'surecart')}
						</ScChoice>
					</div>
				</div>
			</div>
		</Fragment>
	);
};
