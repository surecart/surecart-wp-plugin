import { grid } from '@wordpress/icons';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

const PRODUCT_BLOCKS = [['surecart/product-item']];
const ALLOWED_BLOCKS = ['surecart/product-item'];

export default function EditLayoutConfig({ label, description, onDone }) {
	return (
		<Placeholder icon={grid} label={label}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flex: '1 0 0px',
					gap: '1em',
				}}
			>
				{description}
				<div
					style={{
						marginTop: '1.4rem',
						padding: '1rem',
						backgroundColor: 'var(--sc-color-gray-200)',
						fontSize: 'var(--wp--preset--font-size--medium)',
						borderRadisu: 'var(--sc-border-radius-medium)',
					}}
				>
					<div
						style={{
							backgroundColor: 'white',
							maxWidth: '22rem',
							minHeight: '22rem',
							margin: '0 auto',
							padding: '1.2rem',
						}}
					>
						<InnerBlocks
							templateLock={'insert'}
							template={PRODUCT_BLOCKS}
							allowedBlocks={ALLOWED_BLOCKS}
							renderAppender={false}
						/>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<Button
						variant="primary"
						style={{ marginBottom: 0 }}
						onClick={onDone}
					>
						{__('Done', 'surecart')}
					</Button>
				</div>
			</div>
		</Placeholder>
	);
}
