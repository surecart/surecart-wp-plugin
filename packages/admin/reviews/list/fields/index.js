// Plugins can extend via `surecart.dataview.reviews.fields`.
import reviewField from './review';
import starsField from './stars';
import customerField from './customer';
import productField from './product';
import statusField from './status';
import createdField from './created';

import { applyFieldExtensions } from '../../../components/dataview-list';

export const buildReviewFields = (ctx) => {
	const fields = [
		reviewField(ctx),
		starsField(ctx),
		customerField(ctx),
		productField(ctx),
		statusField(ctx),
		createdField(ctx),
	];
	return applyFieldExtensions('reviews', fields, ctx);
};

export {
	reviewField,
	starsField,
	customerField,
	productField,
	statusField,
	createdField,
};

// Re-exported for plugin extenders so they don't redefine the enums.
export { STARS_ELEMENTS as REVIEW_STARS_ELEMENTS } from './stars';
export { STATUS_ELEMENTS as REVIEW_STATUS_ELEMENTS } from './status';
