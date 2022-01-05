import { CeDropdown, CeMenu, CeMenuItem } from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';

export default ( { attributes, setAttributes } ) => {
	const { mode } = attributes;

	const renderBadge = () => {
		if ( mode === 'test' ) {
			return (
				<ce-button type="warning" size="small" caret>
					{ __( 'Test', 'checkout_engine' ) }
				</ce-button>
			);
		}

		return (
			<ce-button type="success" size="small" caret>
				{ __( 'Live', 'checkout_engine' ) }
			</ce-button>
		);
	};

	return (
		<CeDropdown position="bottom-right">
			<span slot="trigger">{ renderBadge() }</span>
			<CeMenu>
				<CeMenuItem
					onClick={ () => setAttributes( { mode: 'test' } ) }
					checked={ mode === 'test' }
				>
					{ __( 'Test', 'checkout_engine' ) }
				</CeMenuItem>
				<CeMenuItem
					onClick={ () => setAttributes( { mode: 'live' } ) }
					checked={ mode === 'live' || ! mode }
				>
					{ __( 'Live', 'checkout_engine' ) }
				</CeMenuItem>
			</CeMenu>
		</CeDropdown>
	);
};
