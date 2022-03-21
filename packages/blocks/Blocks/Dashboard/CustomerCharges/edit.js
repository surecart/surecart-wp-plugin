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
			<ce-flex
				justify-content="flex-end"
				flex-direction="column"
				style={{ '--spacing': 'var(--ce-spacing-large)' }}
			>
				<ce-table>
					<ce-table-cell slot="head">
						{__('Number', 'surecart')}
					</ce-table-cell>
					<ce-table-cell slot="head">
						{__('Items', 'surecart')}
					</ce-table-cell>
					<ce-table-cell slot="head">
						{__('Total', 'surecart')}
					</ce-table-cell>
					<ce-table-cell slot="head" style={{ width: '100px' }}>
						{__('Status', 'surecart')}
					</ce-table-cell>
					<ce-table-cell
						slot="head"
						style={{ width: '100px' }}
					></ce-table-cell>

					{[...Array(per_page || 10)].map(() => (
						<ce-table-row>
							<ce-table-cell>
								<ce-text
									truncate
									style={{
										'--font-weight':
											'var(--ce-font-weight-semibold)',
									}}
								>
									15AG68LR
								</ce-text>
							</ce-table-cell>
							<ce-table-cell>
								<ce-text
									truncate
									style={{
										'--color': 'var(--ce-color-gray-500)',
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
								</ce-text>
							</ce-table-cell>
							<ce-table-cell>
								<ce-format-number
									type="currency"
									currency={'USD'}
									value={2500}
								></ce-format-number>
							</ce-table-cell>
							<ce-table-cell>
								<ce-order-status-badge status="paid"></ce-order-status-badge>
							</ce-table-cell>
							<ce-table-cell>
								<ce-button size="small">
									{__('View', 'surecart')}
								</ce-button>
							</ce-table-cell>
						</ce-table-row>
					))}
				</ce-table>

				<ce-flex
					justify-content="space-between"
					align-items="center"
					style={{ '--spacing': 'var(--ce-spacing-large)' }}
				>
					<ce-text
						style={{
							'--size': 'var(--ce-font-size-small)',
							'--color': 'var(--ce-color-gray-500)',
						}}
					>
						{__('Showing 1 to 10 of 20 results', 'surecart')}
					</ce-text>

					<ce-flex>
						<ce-button>{__('Prev Page', 'surecart')}</ce-button>
						<ce-button>{__('Next Page', 'surecart')}</ce-button>
					</ce-flex>
				</ce-flex>
			</ce-flex>
		</div>
	);
};
