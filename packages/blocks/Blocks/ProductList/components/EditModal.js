import { grid } from '@wordpress/icons';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

const DEFAULT_TEMPLATE = [
	[
		'core/paragraph',
		{
			content: __('Product Name', 'surecart'),
		},
	],
	[
		'surecart/product-image',
		{
			url: 'https://i.picsum.photos/id/1016/600/600.jpg?hmac=cFjlj-fuzpd0BofY0YlXjH-ccjalkAe30I8A7peBtYk',
		},
	],
];

export default function EditModal({ attributes }) {
	return (
		<Placeholder icon={grid} label={__('All Products', 'surecart')}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flex: '1 0 0px',
				}}
			>
				{__(
					'Display all products from your store as a grid.',
					'surecart'
				)}
				<div
					style={{
						marginTop: '2rem',
						padding: '1rem',
						backgroundColor: 'var(--sc-color-gray-200)',
					}}
				>
					<div
						style={{
							backgroundColor: 'white',
							maxWidth: '22rem',
							height: '28rem',
							margin: '0 auto',
							padding: '1rem',
						}}
					>
						<InnerBlocks
							templateLock={false}
							template={DEFAULT_TEMPLATE}
						/>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						padding: '1rem 1rem 0',
					}}
				>
					<Button
						variant="primary"
						style={{ marginBottom: 0 }}
						// onClick={onDone}
					>
						{__('Done', 'surecart')}
					</Button>
					<Button
						variant="tertiary"
						// onClick={onCancel}
					>
						{__('Cancel', 'surecart')}
					</Button>
				</div>
			</div>
		</Placeholder>
	);
}
