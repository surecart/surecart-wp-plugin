import { TEMPLATE } from './template';
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useInstanceId } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function Render({ setAttributes, attributes: { blockId } }) {
	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch(blockEditorStore);
	const instanceId = useInstanceId(Render);

	useEffect(() => {
		if (!Number.isFinite(blockId)) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes({ blockId: instanceId });
		}
	}, [blockId, instanceId]);

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		templateLock: 'all',
	});

	return <div {...innerBlocksProps} />;
}
