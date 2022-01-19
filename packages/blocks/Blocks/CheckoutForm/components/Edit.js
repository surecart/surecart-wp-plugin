/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	Placeholder,
	TextControl,
	PanelBody,
	PanelRow,
	Spinner,
} from '@wordpress/components';
import {
	useEntityBlockEditor,
	useEntityProp,
	store as coreStore,
} from '@wordpress/core-data';
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	__experimentalUseNoRecursiveRenders as useNoRecursiveRenders,
	// __experimentalBlockContentOverlay as BlockContentOverlay, // TODO when gutenberg releases it: https://github.com/WordPress/gutenberg/blob/afee31ee020b8965e811f5d68a5ca8001780af9d/packages/block-editor/src/components/block-content-overlay/index.js#L17
	InspectorControls,
	useBlockProps,
	Warning,
} from '@wordpress/block-editor';

export default ({ attributes, setAttributes }) => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	// TODO: Let's store a unique hash in both meta and attribute to find.
	const { id } = attributes;

	const [hasAlreadyRendered, RecursionProvider] = useNoRecursiveRenders(id);

	const blockProps = useBlockProps();

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		'ce_form',
		{ id }
	);

	const [title, setTitle] = useEntityProp('postType', 'ce_form', 'title', id);

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			value: blocks,
			onInput,
			onChange,
			template: [['checkout-engine/form', {}]],
			templateLock: 'all',
		}
	);

	const { isMissing, hasResolved } = useSelect((select) => {
		const hasResolved = select(coreStore).hasFinishedResolution(
			'getEntityRecord',
			['postType', 'ce_form', id]
		);
		const form = select(coreStore).getEntityRecord(
			'postType',
			'ce_form',
			id
		);
		const canEdit = select(coreStore).canUserEditEntityRecord('ce_form');
		return {
			canEdit,
			isMissing: hasResolved && !form,
			hasResolved,
			form,
		};
	});

	if (hasAlreadyRendered) {
		return (
			<div {...blockProps}>
				<Warning>
					{__(
						'Form cannot be rendered inside itself.',
						'checkout_engine'
					)}
				</Warning>
			</div>
		);
	}

	// form has resolved
	if (!hasResolved) {
		return (
			<div {...blockProps}>
				<Placeholder>
					<Spinner />
				</Placeholder>
			</div>
		);
	}

	// form is missing
	if (isMissing) {
		return (
			<div {...blockProps}>
				<Warning>
					{__(
						'This form has been deleted or is unavailable.',
						'checkout_engine'
					)}
				</Warning>
			</div>
		);
	}

	return (
		<RecursionProvider>
			<InspectorControls>
				<PanelBody title={__('Form Title', 'checkout-engine')}>
					<PanelRow>
						<TextControl
							label={__('Form Title', 'checkout-engine')}
							value={title}
							onChange={(title) => setTitle(title)}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>{<div {...innerBlocksProps} />}</div>
		</RecursionProvider>
	);
};
