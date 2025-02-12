/**
 * External dependencies.
 */
import { getBlockType, unregisterBlockType } from '@wordpress/blocks';
import {
	registerCoreBlocks,
	__experimentalGetCoreBlocks,
} from '@wordpress/block-library';

export default function () {
	const coreBlocks = __experimentalGetCoreBlocks();
	const blocks = coreBlocks.filter((block) => {
		return !getBlockType(block.name);
	});

	registerCoreBlocks(blocks);

	const registeredBlocks = [...blocks];

	return function unregisterBlocks() {
		registeredBlocks.forEach(
			(block) => block && unregisterBlockType(block.name)
		);
	};
}
