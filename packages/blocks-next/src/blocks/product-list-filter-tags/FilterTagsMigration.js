import { __ } from '@wordpress/i18n';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default ({ clientId }) => {
	const { replaceInnerBlocks } = useDispatch(blockEditorStore);

	useEffect(() => {
		if (!replaceInnerBlocks || !clientId) return;
		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate([
				['surecart/product-list-filter-tags-template'],
			])
		);
	}, [replaceInnerBlocks, clientId]);
};
