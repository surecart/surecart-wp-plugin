/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import { useEntityRecord } from '@wordpress/core-data';
import TemplateListEdit from '../../components/TemplateListEdit';
import { PanelBody } from '@wordpress/components';
import { Fragment, useEffect, useRef, useState } from '@wordpress/element';
import { Notice } from '@wordpress/components';
import { RangeControl } from '@wordpress/components';

const TEMPLATE = [
	[
		'surecart/product-price-choice-template',
		{
			layout: {
				type: 'flex',
				justifyContent: 'space-between',
			},
		},
	],
];

const DEMO_CONTEXT = [
	{
		name: __('Subscribe & Save', 'surecart'),
		display_amount: `${window?.scData?.currency_symbol || '$'}8`,
		short_interval_text: __('/ mo', 'surecart'),
	},
	{
		name: __('One Time', 'surecart'),
		display_amount: `${window?.scData?.currency_symbol || '$'}10`,
		short_interval_text: '',
	},
];

export default ({
	attributes,
	setAttributes,
	__unstableLayoutClassNames,
	clientId,
	context: { postId },
}) => {
	const { label, columns } = attributes;
	const priceContainerRef = useRef(null);
	const [isContainerSmall, setIsContainerSmall] = useState(true);

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
		ref: priceContainerRef,
	});
	const colorProps = useColorProps(attributes);

	useEffect(() => {
		if (priceContainerRef?.current) {
			// watch for resize events on the price container
			const observer = new ResizeObserver(() => {
				const containerWidth = priceContainerRef?.current?.offsetWidth;
				setIsContainerSmall(containerWidth <= 600);
			});

			observer.observe(priceContainerRef?.current);
		}
	}, [priceContainerRef]);

	const blockContexts = (product?.active_prices || DEMO_CONTEXT).map(
		(price, index) => ({
			id: `price${index}`,
			'surecart/price': {
				...price,
				checked: index === 0,
			},
		})
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<RangeControl
						__nextHasNoMarginBottom
						label={__('Columns', 'surecart')}
						value={columns}
						onChange={(columns) =>
							setAttributes({ columns: parseInt(columns) })
						}
						min={1}
						max={2}
					/>

					{columns > 1 && isContainerSmall && (
						<Notice status="warning" isDismissible={false}>
							{__(
								'This block will only show multiple columns if the width of the container is over 600px.'
							)}
						</Notice>
					)}
				</PanelBody>
			</InspectorControls>

			{blockContexts?.length > 1 ? (
				<div {...blockProps}>
					<RichText
						tagName="label"
						className={classnames(
							'sc-form-label',
							colorProps.className
						)}
						aria-label={__('Label text', 'surecart')}
						placeholder={__('Add label…', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
					<TemplateListEdit
						className="sc-choices"
						template={TEMPLATE}
						blockContexts={blockContexts}
						clientId={clientId}
						renderAppender={false}
						attachBlockProps={false}
						style={{
							'--columns': columns,
						}}
					/>
				</div>
			) : null}
		</Fragment>
	);
};
