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
				width: 100%;
			`,
		}
	);

	const parentAttributes = useSelect((select) => {
		const parents = select(blockEditorStore).getBlockParents(clientId);
		const parentBlock = select(blockEditorStore).getBlocksByClientId(
			parents?.[parents?.length - 1]
		);
		console.log(parentBlock);
		return parentBlock?.[0].attributes;
	  });
useEffect(() => {
	console.log('parentAttributes');
	setAttributes({
		product_id: parentAttributes.product_id
	});
}, [parentAttributes]);
// Get the parent block attributes using the useSelect hook

  const product = useSelect(
	(select) =>
		select(coreStore).getEntityRecord('root', 'product', product_id, { expand: ['prices'], archived: false }),
	[product_id]
);
const prices = product?.prices?.data?.filter(price => price?.recurring_interval).sort((a, b) => a?.position - b?.position);
console.log(parentAttributes);
  console.log(product);
  console.log(prices);
//   return 'test';
if (! prices) {
	return (
		<Spinner />
	);
}
console.log(ScRecurringPriceChoiceContainer);
	return (
		<Fragment>
			<div {...blockProps}>
				<ScRecurringPriceChoiceContainer
					label={__('Yes, count me in!', 'surecart')}
					prices={prices}
				/>
			</div>
		</Fragment>
	);
};
