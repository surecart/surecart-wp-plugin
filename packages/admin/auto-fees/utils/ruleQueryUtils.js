import {
	DATE_ATTRIBUTES,
	PRICE_ATTRIBUTES,
	TEXT_ATTRIBUTES,
	EMAIL_ATTRIBUTES,
	NUMBER_ATTRIBUTES,
	USER_ROLE_ATTRIBUTES,
} from './constants';

export const getInputType = (attribute) => {
	if (DATE_ATTRIBUTES?.includes(attribute)) return 'date';
	if (PRICE_ATTRIBUTES?.includes(attribute)) return 'price';
	if (EMAIL_ATTRIBUTES?.includes(attribute)) return 'email';
	if (TEXT_ATTRIBUTES?.includes(attribute)) return 'text';
	if (NUMBER_ATTRIBUTES?.includes(attribute)) return 'number';
	if (USER_ROLE_ATTRIBUTES?.includes(attribute)) return 'user_role';

	return 'text';
};
