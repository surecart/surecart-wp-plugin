import {
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

const TEMPLATE = [
	[ 
		'surecart/product-list',
		{},
		[
			[ 'surecart/product-name' ],
			[ 'surecart/product-price-v2' ]
		]
	],
];


export default ({ attributes, setAttributes, clientId }) => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		templateLock: 'all',
	});
	return (
		<div {...innerBlocksProps} />
	);
};
