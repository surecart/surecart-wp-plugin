import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl } from '@wordpress/components';

export default ( { attributes, setAttributes } ) => {
	const { per_page } = attributes;
	return (
		<div>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout_engine' ) }>
					<PanelRow>
						<RangeControl
							label={ __( 'Per Page', 'checkout_engine' ) }
							value={ per_page }
							onChange={ ( per_page ) =>
								setAttributes( { per_page } )
							}
							min={ 1 }
							max={ 30 }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ce-spacing style={ { '--spacing': 'var(--ce-spacing-xx-large)' } }>
				<ce-card borderless>
					<ce-heading slot="title">Payment Methods</ce-heading>
					<ce-flex justify-content="flex-start">
						<div>•••• 4242</div>
						<div>Expires 4/2024</div>
						<div style={ { 'margin-left': 'auto;' } }>
							<ce-button size="small" type="danger" outline>
								Remove
							</ce-button>
						</div>
					</ce-flex>
					<ce-button size="small">
						<ce-icon slot="prefix" name="plus"></ce-icon> New
						Payment Method
					</ce-button>
				</ce-card>

				<ce-card borderless>
					<ce-heading slot="title">Recent Orders</ce-heading>

					<ce-table>
						<ce-table-cell slot="head">
							{ __( 'Number', 'checkout_engine' ) }
						</ce-table-cell>
						<ce-table-cell slot="head">
							{ __( 'Items', 'checkout_engine' ) }
						</ce-table-cell>
						<ce-table-cell slot="head">
							{ __( 'Total', 'checkout_engine' ) }
						</ce-table-cell>
						<ce-table-cell slot="head" style={ { width: '100px' } }>
							{ __( 'Status', 'checkout_engine' ) }
						</ce-table-cell>
						<ce-table-cell
							slot="head"
							style={ { width: '100px' } }
						></ce-table-cell>
						<ce-table-row>
							<ce-table-cell>
								<ce-text
									truncate
									style={ {
										'--font-weight':
											'var(--ce-font-weight-semibold)',
									} }
								>
									15AG68LR
								</ce-text>
							</ce-table-cell>
							<ce-table-cell>
								<ce-text
									truncate
									style={ {
										'--color': 'var(--ce-color-gray-500);',
									} }
								>
									{ sprintf(
										_n(
											'%s item',
											'%s items',
											2,
											'checkout_engine'
										),
										2
									) }
								</ce-text>
							</ce-table-cell>
							<ce-table-cell>
								<ce-format-number
									type="currency"
									currency="usd"
									value="2500"
								></ce-format-number>
							</ce-table-cell>
							<ce-table-cell>
								<ce-session-status-badge status="paid"></ce-session-status-badge>
							</ce-table-cell>
							<ce-table-cell>
								<ce-button size="small">
									{ __( 'View', 'checkout_engine' ) }
								</ce-button>
								<ce-button size="small">
									{ __(
										'Download Invoice',
										'checkout_engine'
									) }
								</ce-button>
							</ce-table-cell>
						</ce-table-row>
					</ce-table>
				</ce-card>
			</ce-spacing>
		</div>
	);
};
