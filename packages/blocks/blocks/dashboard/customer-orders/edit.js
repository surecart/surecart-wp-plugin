import { __, _n, sprintf } from '@wordpress/i18n';
export default () => {
	return (
		<div>
			<ce-header>{ __( 'Orders', 'checkout_engine' ) }</ce-header>
			<ce-divider
				style={ { '--spacing': 'var(--ce-spacing-medium)' } }
			></ce-divider>
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
							style={ { '--color': 'var(--ce-color-gray-500)' } }
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
							currency={ 'USD' }
							value={ 2500 }
						></ce-format-number>
					</ce-table-cell>
					<ce-table-cell>
						<ce-session-status-badge status="paid"></ce-session-status-badge>
					</ce-table-cell>
					<ce-table-cell>
						<ce-button size="small">
							{ __( 'View', 'checkout_engine' ) }
						</ce-button>
					</ce-table-cell>
				</ce-table-row>
			</ce-table>

			<ce-button>{ __( 'Prev Page', 'checkout_engine' ) }</ce-button>

			<ce-button>{ __( 'Next Page', 'checkout_engine' ) }</ce-button>
		</div>
	);
};
