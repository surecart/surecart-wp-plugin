if ( typeof window !== 'undefined' ) {
	const { defineCustomElements } = require( '@checkout-engine/components' );
	defineCustomElements();
}
// @ts-ignore
window.Buffer = window.Buffer || require( 'buffer' ).Buffer;
