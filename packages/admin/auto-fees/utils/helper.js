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

export const getAppliesWhileRule = (appliesWhile, feeTarget) => {
	if ('both' === appliesWhile) {
		return false;
	}
	return {
		type: 'condition',
		attribute_name:
			'line_item' === feeTarget ? 'checkout.order_type' : 'order_type',
		operator_label: 'is',
		comparison_value:
			'initial' === appliesWhile ? 'checkout' : 'subscription',
	};
};
