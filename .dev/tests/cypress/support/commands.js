import { loginToSite, disableGutenbergFeatures } from '../helpers';
import 'cypress-file-upload';

before( function () {
	cy.visit( '/wp-admin' );
	cy.location( 'pathname' ).then( ( pathname ) => {
		if ( pathname === '/wp-login.php' ) {
			cy.get( '#user_login' )
				.wait( 200 )
				.type( Cypress.env( 'wpUsername' ), { force: true } );
			cy.get( '#user_pass' )
				.wait( 200 )
				.type( Cypress.env( 'wpPassword' ), { force: true } );
			cy.get( '#wp-submit' ).click();
		}
	} );

	disableGutenbergFeatures();
} );

// Maintain WordPress logged in state
Cypress.Cookies.defaults( {
	preserve: /wordpress_.*/,
} );

const waitForSomething = async ( name, res ) => {
	await cy.writeFile(
		`cypress/fixtures/${ name }.json`,
		JSON.stringify( res.body )
	);
	return res;
};

Cypress.Commands.add( 'mockBody', ( body ) => {
	return Cypress.env( 'mockRequests' ) ? body : null;
} );

const usingLiveRequests = () => {
	return Cypress.env( 'mockRequests' ) === false;
};

Cypress.Commands.add(
	'interceptWithFixture',
	( method, url, { fixture, as = 'request' } ) => {
		cy.fixture( fixture ).then( ( body ) => {
			if ( usingLiveRequests() ) {
				cy.intercept( method, url ).as( as );
			} else {
				cy.intercept( method, url, body ).as( as );
			}
		} );
	}
);

Cypress.Commands.add( 'updateFixture', ( fixture, content, json = true ) => {
	if ( ! usingLiveRequests() ) return;
	cy.writeFile(
		`.dev/tests/cypress/fixtures/${ fixture }.json`,
		json ? JSON.stringify( content, null, 2 ) : content
	);
} );

// Custom uploadFile command
Cypress.Commands.add( 'uploadFile', ( fileName, fileType, selector ) => {
	cy.get( selector ).then( ( subject ) => {
		cy.fixture( fileName, 'hex' ).then( ( fileHex ) => {
			const fileBytes = hexStringToByte( fileHex );
			const testFile = new File( [ fileBytes ], fileName, {
				type: fileType,
			} );
			const dataTransfer = new DataTransfer();
			const el = subject[ 0 ];

			dataTransfer.items.add( testFile );
			el.files = dataTransfer.files;
		} );
	} );
} );

// Utilities
function hexStringToByte( str ) {
	if ( ! str ) {
		return new Uint8Array();
	}

	const a = [];
	for ( let i = 0, len = str.length; i < len; i += 2 ) {
		a.push( parseInt( str.substr( i, 2 ), 16 ) );
	}

	return new Uint8Array( a );
}

/**
 * Starting in Cypress 8.1.0 Unhandled Exceptions now cause tests to fail.
 * Sometimes unhandled exceptions occur in Core that do not effect the UX created by CoBlocks.
 * We discard unhandled exceptions and pass the test as long as assertions continue expectedly.
 */
Cypress.on( 'uncaught:exception', () => {
	// returning false here prevents Cypress from failing the test.
	return false;
} );
