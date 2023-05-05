/**
 * WordPress dependencies
 */
import {
	createNewPost,
	insertBlock,
	enablePageDialogAccept,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

describe('surecart/cart-menu-button', () => {
	beforeAll(async () => {
		await enablePageDialogAccept();
	});

	beforeEach(async () => {
		await createNewPost();
	});

	it('Should render', async () => {
		await insertBlock('Cart Menu Button');
		expect(await page.$(`[data-type="surecart/cart-menu-button"]`)).not.toBeNull();
		expect(await getEditedPostContent()).toMatchSnapshot();
	});
});
