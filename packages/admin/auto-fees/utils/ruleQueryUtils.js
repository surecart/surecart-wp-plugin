import { ATTRIBUTE_TYPE_MAP } from './constants';

export const getInputType = (attribute) => {
	return ATTRIBUTE_TYPE_MAP[attribute] || 'text';
};
