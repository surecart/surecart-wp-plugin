/**
 * WordPress dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { Modal, SearchControl } from '@wordpress/components';
import { useAsyncList } from '@wordpress/compose';
import {
	BlockContextProvider,
	store as blockEditorStore,
	__experimentalBlockPatternsList as BlockPatternsList,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	useBlockNameForPatterns,
	getTransformedBlocksFromPattern,
	usePatterns,
	searchPatterns,
} from '../blocks/utils';

export default function PatternSelectionModal({
	clientId,
	attributes,
	setIsPatternSelectionModalOpen,
	name,
}) {
	const [searchValue, setSearchValue] = useState('');
	const { replaceBlock, selectBlock } = useDispatch(blockEditorStore);
	const onBlockPatternSelect = (_, blocks) => {
		const { newBlocks, queryClientIds } = getTransformedBlocksFromPattern(
			blocks,
			attributes,
			name
		);

		// Merge the attributes of the first block with the attributes.
		if (newBlocks[0]) {
			newBlocks[0].attributes = {
				...newBlocks[0].attributes,
				...attributes,
			};
		}

		replaceBlock(clientId, newBlocks);
		if (queryClientIds[0]) {
			selectBlock(queryClientIds[0]);
		}
	};
	// When we preview Query Loop blocks we should prefer the current
	// block's postType, which is passed through block context.
	const blockPreviewContext = useMemo(
		() => ({
			previewPostType: 'sc_product',
		}),
		['sc_product']
	);
	const blockNameForPatterns = useBlockNameForPatterns(
		clientId,
		attributes,
		name
	);
	const blockPatterns = usePatterns(clientId, blockNameForPatterns);
	const filteredBlockPatterns = useMemo(() => {
		return searchPatterns(blockPatterns, searchValue);
	}, [blockPatterns, searchValue]);
	const shownBlockPatterns = useAsyncList(filteredBlockPatterns);

	return (
		<Modal
			overlayClassName="block-library-query-pattern__selection-modal"
			title={__('Choose a pattern', 'surecart')}
			onRequestClose={() => setIsPatternSelectionModalOpen(false)}
			isFullScreen
		>
			<div className="block-library-query-pattern__selection-content">
				<div className="block-library-query-pattern__selection-search">
					<SearchControl
						__nextHasNoMarginBottom
						onChange={setSearchValue}
						value={searchValue}
						label={__('Search for patterns', 'surecart')}
						placeholder={__('Search', 'surecart')}
					/>
				</div>
				<BlockContextProvider value={blockPreviewContext}>
					<BlockPatternsList
						blockPatterns={filteredBlockPatterns}
						shownPatterns={shownBlockPatterns}
						onClickPattern={onBlockPatternSelect}
					/>
				</BlockContextProvider>
			</div>
		</Modal>
	);
}
