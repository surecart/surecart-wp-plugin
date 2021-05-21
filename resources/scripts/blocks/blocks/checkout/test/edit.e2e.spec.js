/**
 * WordPress dependencies
 */
import {
	// insertBlock,
	createNewPost,
	insertBlock,
	enablePageDialogAccept,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe( 'checkout-engine/checkout-form', () => {
	beforeAll( async () => {
		await enablePageDialogAccept();
	} );
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'Should render', async () => {
		await insertBlock( 'Checkout Form' );
		expect(
			await page.$( '[data-type="checkout-engine/checkout-form"]' )
		).not.toBeNull();
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );
