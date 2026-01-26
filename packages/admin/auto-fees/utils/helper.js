import { ATTRIBUTE_TYPE_MAP, STRING_OPERATORS } from './constants';

export const getInputType = (attribute, operator = false) => {
	if (operator && STRING_OPERATORS.includes(operator)) {
		return 'text';
	}
	return ATTRIBUTE_TYPE_MAP[attribute] || 'text';
};

export const getCurrencyCode = (autoFee) => {
	return autoFee?.currency || window?.scData?.currency_code || 'USD';
};
