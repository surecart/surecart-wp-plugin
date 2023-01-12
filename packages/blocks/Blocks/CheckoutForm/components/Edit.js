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

	const blockProps = useBlockProps();

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		'sc_form',
		{ id }
	);

	const [title, setTitle] = useEntityProp('postType', 'sc_form', 'title', id);

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			value: blocks,
			onInput,
			onChange,
			template: [['surecart/form', {}]],
			templateLock: 'all',
		}
	);

	const { isMissing, hasResolved } = useSelect((select) => {
		const hasResolved = select(coreStore).hasFinishedResolution(
			'getEntityRecord',
			['postType', 'sc_form', id]
		);
		const form = select(coreStore).getEntityRecord(
			'postType',
			'sc_form',
			id
		);
		const canEdit = select(coreStore).canUserEditEntityRecord('sc_form');
		return {
			canEdit,
			isMissing: hasResolved && !form,
			hasResolved,
			form,
		};
	});

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
						'surecart'
					)}
				</Warning>
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Form Title', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Form Title', 'surecart')}
							value={title}
							onChange={(title) => setTitle(title)}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>{<div {...innerBlocksProps} />}</div>
		</>
	);
};
