/**
 * External dependencies
 */
import { Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { grid } from '@wordpress/icons';
import { Suspense } from '@wordpress/element';

export const renderNoProductsPlaceholder = () => (
	<Placeholder icon={grid} label={__('All Products', 'surecart')}>
		<p>{__("You don't have any products to list here yet.", 'surecart')}</p>
	</Placeholder>
);

export const renderProductLayout = (blockName, product, layoutConfig) => {
	if (!layoutConfig) {
		return;
	}

	const blockMap = getBlockMap(blockName);
	return layoutConfig.map(([name, props = {}], index) => {
		let children;

		if (!!props.children && props.children.length > 0) {
			// props.children here refers to the children stored in the block attributes. which
			// has the same shape as `layoutConfig`, not React children, which has a different shape */
			children = renderProductLayout(blockName, product, props.children);
		}

		console.log(blockMap, name);

		const LayoutComponent = blockMap[name];

		if (!LayoutComponent) {
			return null;
		}

		const productID = product.id || 0;
		const keyParts = ['layout', name, index, productID];

		return (
			<Suspense key={keyParts.join('_')} fallback={<div>Loading...</div>}>
				{/* <LayoutComponent
					{...props}
					children={children}
					product={product}
				/> */}
				<h2>Hello</h2>
			</Suspense>
		);
	});
};

export function getBlockMap(blockName) {
	getRegisteredBlockComponents(blockName);
}

export function getRegisteredBlockComponents(context) {
	const registeredBlockComponents = {};
	const parentInnerBlocks =
		typeof registeredBlockComponents[context] === 'object' &&
		Object.keys(registeredBlockComponents[context]).length > 0
			? registeredBlockComponents[context]
			: {};

	return {
		...parentInnerBlocks,
		...registeredBlockComponents.any,
	};
}

export const getProductLayoutConfig = (innerBlocks) => {
	if (!innerBlocks || innerBlocks.length === 0) {
		return [];
	}

	return innerBlocks.map((block) => {
		return [
			block.name,
			{
				...block.attributes,
				product: undefined,
				children:
					block.innerBlocks.length > 0
						? getProductLayoutConfig(block.innerBlocks)
						: [],
			},
		];
	});
};
