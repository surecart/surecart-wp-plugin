/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import TemplateListEdit from '../../components/TemplateListEdit';

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
	const { label } = attributes;
	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
	});
	const colorProps = useColorProps(attributes);

	const getBlockContexts = () => {
		const blockContexts = [];
		const prices = {
			0: {
				name: __('Subscribe & Save', 'surecart'),
				display_amount: '$8',
				short_interval_text: __('/ mo', 'surecart'),
			},
			1: {
				name: __('One Time', 'surecart'),
				display_amount: '$10',
				short_interval_text: '',
			},
		};

		for (let i = 1; i <= 2; i++) {
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
		<div {...blockProps}>
			<RichText
				tagName="label"
				className={classnames('sc-form-label', colorProps.className)}
				aria-label={__('Label text', 'surecart')}
				placeholder={__('Add label…', 'surecart')}
				value={label}
				onChange={(label) => setAttributes({ label })}
				withoutInteractiveFormatting
				allowedFormats={['core/bold', 'core/italic']}
			/>
			<TemplateListEdit
				className={classnames(__unstableLayoutClassNames, {
					'sc-choices': true,
				})}
				template={TEMPLATE}
				blockContexts={getBlockContexts()}
				clientId={clientId}
				renderAppender={false}
			/>
		</div>
	);
};
