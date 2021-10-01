/**
 * WordPress dependencies
 */
import {
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
		await insertBlock( 'Checkout Button' );
		expect(
			await page.$( `[data-type="checkout-engine/button"]` )
		).not.toBeNull();
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );
