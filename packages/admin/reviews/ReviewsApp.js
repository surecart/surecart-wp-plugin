/**
 * ReviewsApp — SPA root for `?page=sc-reviews`.
 *
 * Reviews have no "create" flow (customers submit them), so this is just
 * List + Edit. The lazy `./Review` import resolves to the existing edit page.
 */
import createListEditApp from '../components/createListEditApp';
import ReviewsList from './ReviewsList';

export default createListEditApp({
	pageSlug: 'sc-reviews',
	ListComponent: ReviewsList,
	loadEditComponent: () =>
		import(/* webpackChunkName: "sc-reviews-detail" */ './Review'),
});
