import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { per_page } = attributes;
	return (
		<div>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<RangeControl
							label={__('Per Page', 'surecart')}
							value={per_page}
							onChange={(per_page) => setAttributes({ per_page })}
							min={1}
							max={30}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<sc-flex
				justify-content="flex-end"
				flex-direction="column"
				style={{ '--spacing': 'var(--sc-spacing-large)' }}
			>
				<sc-table>
					<sc-table-cell slot="head">
						{__('Number', 'surecart')}
					</sc-table-cell>
					<sc-table-cell slot="head">
						{__('Items', 'surecart')}
					</sc-table-cell>
					<sc-table-cell slot="head">
						{__('Total', 'surecart')}
					</sc-table-cell>
					<sc-table-cell slot="head" style={{ width: '100px' }}>
						{__('Status', 'surecart')}
					</sc-table-cell>
					<sc-table-cell
						slot="head"
						style={{ width: '100px' }}
					></sc-table-cell>

					{[...Array(per_page || 10)].map(() => (
						<sc-table-row>
							<sc-table-cell>
								<sc-text
									truncate
									style={{
										'--font-weight':
											'var(--sc-font-weight-semibold)',
									}}
								>
									15AG68LR
								</sc-text>
							</sc-table-cell>
							<sc-table-cell>
								<sc-text
									truncate
									style={{
										'--color': 'var(--sc-color-gray-500)',
									}}
								>
									{sprintf(
										_n(
											'%s item',
											'%s items',
											2,
											'surecart'
										),
										2
									)}
								</sc-text>
							</sc-table-cell>
							<sc-table-cell>
								<sc-format-number
									type="currency"
									currency={'USD'}
									value={2500}
								></sc-format-number>
							</sc-table-cell>
							<sc-table-cell>
								<sc-order-status-badge status="paid"></sc-order-status-badge>
							</sc-table-cell>
							<sc-table-cell>
								<sc-button size="small">
									{__('View', 'surecart')}
								</sc-button>
							</sc-table-cell>
						</sc-table-row>
					))}
				</sc-table>

				<sc-flex
					justify-content="space-between"
					align-items="center"
					style={{ '--spacing': 'var(--sc-spacing-large)' }}
				>
					<sc-text
						style={{
							'--size': 'var(--sc-font-size-small)',
							'--color': 'var(--sc-color-gray-500)',
						}}
					>
						{__('Showing 1 to 10 of 20 results', 'surecart')}
					</sc-text>

					<sc-flex>
						<sc-button>{__('Prev Page', 'surecart')}</sc-button>
						<sc-button>{__('Next Page', 'surecart')}</sc-button>
					</sc-flex>
				</sc-flex>
			</sc-flex>
		</div>
	);
};
