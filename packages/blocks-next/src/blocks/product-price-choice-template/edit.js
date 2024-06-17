/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'core/group',
		{
			layout: {
				type: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'space-between',
			},
		},
		[
			[
				'core/paragraph',
				{
					content: __('Price Name', 'surecart'),
				},
			],
			[
				'core/paragraph',
				{
					content: __('$10', 'surecart'),
				},
			],
		],
	],
];

export default ({ __unstableLayoutClassNames }) => {
	const blockProps = useBlockProps({
		className: `sc-choice ${__unstableLayoutClassNames}`,
	});

	return (
		<>
			<div {...blockProps}>
				<InnerBlocks template={TEMPLATE} />
			</div>
		</>
	);
};
