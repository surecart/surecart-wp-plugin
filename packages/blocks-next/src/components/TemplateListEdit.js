/**
 * WordPress dependencies
 */
import { memo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

function PostTemplateInnerBlocks({ template, renderAppender, ...itemProps }) {
	const innerBlocksProps = useInnerBlocksProps(itemProps, {
		template,
		__unstableDisableLayoutClassNames: true,
		renderAppender,
	});
	return <div {...innerBlocksProps} />;
}

function PostTemplateBlockPreview({
	blocks,
	blockContextId,
	isHidden,
	setActiveBlockContextId,
	...props
}) {
	const { style, className, ...remainingProps } = props || {};
	const blockPreviewProps = useBlockPreview({
		blocks,
	});

	const handleOnClick = () => {
		setActiveBlockContextId(blockContextId);
	};

	return (
		<div
			{...blockPreviewProps}
			tabIndex={0}
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={handleOnClick}
			style={{ ...style, display: isHidden ? 'none' : undefined }}
			className={className}
			{...remainingProps}
		/>
	);
}

const MemoizedPostTemplateBlockPreview = memo(PostTemplateBlockPreview);

export default function MultiEdit({
	clientId,
	blockContexts,
	className,
	style,
	itemProps,
	template,
	renderAppender,
	attachBlockProps = true,
}) {
	const [activeBlockContextId, setActiveBlockContextId] = useState();

	const blocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId),
		[clientId]
	);

	const blockProps = attachBlockProps
		? useBlockProps({
				className,
				style,
		  })
		: { style, className };

	// To avoid flicker when switching active block contexts, a preview is rendered
	// for each block context, but the preview for the active block context is hidden.
	// This ensures that when it is displayed again, the cached rendering of the
	// block preview is used, instead of having to re-render the preview from scratch.
	return (
		<div {...blockProps}>
			{blockContexts &&
				blockContexts.map((blockContext) => (
					<BlockContextProvider
						key={blockContext.id}
						value={blockContext}
					>
						{blockContext.id ===
							(activeBlockContextId || blockContexts[0]?.id) && (
							<PostTemplateInnerBlocks
								template={template}
								renderAppender={renderAppender}
								{...itemProps}
							/>
						)}
						<MemoizedPostTemplateBlockPreview
							blocks={blocks}
							blockContextId={blockContext.id}
							setActiveBlockContextId={setActiveBlockContextId}
							isHidden={
								blockContext.id ===
								(activeBlockContextId || blockContexts[0]?.id)
							}
							{...itemProps}
						/>
					</BlockContextProvider>
				))}
		</div>
	);
}
