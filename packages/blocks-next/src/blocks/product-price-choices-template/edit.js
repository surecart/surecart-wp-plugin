/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { list, grid } from '@wordpress/icons';
import TemplateListEdit from '../../components/TemplateListEdit';

const TEMPLATE = [['surecart/product-price-choice-template']];

export default ({
	attributes,
	setAttributes,
	clientId,
	__unstableLayoutClassNames,
}) => {
	const { layout } = attributes;
	const { type: layoutType, columnCount = 2 } = layout || {};

	const setDisplayLayout = (newDisplayLayout) =>
		setAttributes({
			layout: { ...layout, ...newDisplayLayout },
		});

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

		for (let i = 1; i <= Math.max(2, columnCount); i++) {
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
		<>
			<BlockControls>
				<ToolbarGroup
					controls={[
						{
							icon: list,
							title: __('List view'),
							onClick: () =>
								setDisplayLayout({
									type: 'flex',
									justifyContent: 'stretch',
									orientation: 'vertical',
								}),
							isActive: layoutType === 'flex',
						},
						{
							icon: grid,
							title: __('Grid view'),
							onClick: () =>
								setDisplayLayout({
									type: 'grid',
									columnCount,
								}),
							isActive: layoutType === 'grid',
						},
					]}
				/>
			</BlockControls>

			<TemplateListEdit
				className={classnames(__unstableLayoutClassNames, {
					[`columns-${columnCount}`]:
						layoutType === 'grid' && columnCount, // Ensure column count is flagged via classname for backwards compatibility.
					'sc-choices': true,
				})}
				template={TEMPLATE}
				blockContexts={getBlockContexts()}
				clientId={clientId}
				renderAppender={false}
			/>
		</>
	);
};
