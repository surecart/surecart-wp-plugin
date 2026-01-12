/**
 * External dependencies.
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();

	return (
		<ul {...blockProps}>
			<li className="sc-cart-order-bump-item">
				<InnerBlocks />
			</li>

			<li
				className="sc-cart-order-bump-item sc-cart-order-bump-item--preview"
				aria-hidden="true"
				style={{ opacity: 0.5, pointerEvents: 'none' }}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '0.75em',
						padding: '0.75em',
						border: '1px dashed #ccc',
						borderRadius: '12px',
						background: '#f9f9f9',
						height: '100%',
					}}
				>
					<div
						style={{
							width: '72px',
							height: '72px',
							background: '#e0e0e0',
							borderRadius: '8px',
							flexShrink: 0,
						}}
					/>
					<div style={{ flex: 1 }}>
						<div
							style={{
								width: '80%',
								height: '14px',
								background: '#d0d0d0',
								borderRadius: '4px',
								marginBottom: '8px',
							}}
						/>
						<div
							style={{
								width: '50%',
								height: '12px',
								background: '#e0e0e0',
								borderRadius: '4px',
							}}
						/>
					</div>
				</div>
			</li>
		</ul>
	);
};
