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
import TemplateListEdit from '../../components/TemplateListEdit';
import { PanelBody } from '@wordpress/components';
import { Fragment, useEffect, useRef, useState } from '@wordpress/element';
import { Notice } from '@wordpress/components';
import { RangeControl } from '@wordpress/components';
import { getFormattedPrice } from '../../../../admin/util';

const TEMPLATE = [
	[
		'surecart/product-price-choices-template',
		{},
		[
			[
				'surecart/product-price-choice-template',
				{
					layout: {
						type: 'flex',
						justifyContent: 'space-between',
					},
				},
			],
		],
	],
];

export default ({
	attributes,
	setAttributes,
	__unstableLayoutClassNames,
	clientId,
}) => {
	const { label, columns } = attributes;
	const priceContainerRef = useRef(null);
	const [isContainerSmall, setIsContainerSmall] = useState(true);
	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
	});
	const colorProps = useColorProps(attributes);

	useEffect(() => {
		if (priceContainerRef) {
			// watch for resize events on the price container
			const observer = new ResizeObserver(() => {
				const containerWidth = priceContainerRef?.current?.offsetWidth;
				setIsContainerSmall(containerWidth <= 600);
			});

			observer.observe(priceContainerRef?.current);
		}
	}, [priceContainerRef]);

	const getBlockContexts = () => {
		const blockContexts = [];
		const prices = {
			0: {
				name: __('Subscribe & Save', 'surecart'),
				display_amount: getFormattedPrice({
					amount: 800,
					currency: scData?.currency,
				}),
				short_interval_text: __('/ mo', 'surecart'),
			},
			1: {
				name: __('One Time', 'surecart'),
				display_amount: getFormattedPrice({
					amount: 1000,
					currency: scData?.currency,
				}),
				short_interval_text: '',
			},
		};

		for (let i = 1; i <= Math.max(2, columns); i++) {
			blockContexts.push({
				id: `price${i}`,
				'surecart/price': {
					...prices[i % 2],
					checked: i === 1,
				},
			});
		}

		return blockContexts;
	};

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

			<div {...blockProps} ref={priceContainerRef}>
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
					blockContexts={getBlockContexts()}
					clientId={clientId}
					renderAppender={false}
					attachBlockProps={false}
					style={{
						'--columns': columns,
					}}
				/>
			</div>
		</Fragment>
	);
};
