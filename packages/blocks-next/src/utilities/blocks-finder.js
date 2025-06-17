export const findAllBlocksByName = (blocks, blockName) => {
	const matchingBlocks = [];

	blocks.forEach((block) => {
		if (block.name === blockName) {
			matchingBlocks.push(block);
		}

		if (block.innerBlocks && block.innerBlocks.length > 0) {
			matchingBlocks.push(
				...findAllBlocksByName(block.innerBlocks, blockName)
			);
		}
	});

	return matchingBlocks;
};
