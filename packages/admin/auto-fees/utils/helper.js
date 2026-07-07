import {
	ATTRIBUTE_REGISTRY,
	ATTRIBUTE_TYPE_MAP,
	STRING_OPERATORS,
} from './constants';

// Geo-address attribute names, derived from the registry so new ones flow in automatically.
const GEO_ADDRESS_ATTRIBUTES = Object.keys( ATTRIBUTE_REGISTRY.country );

export const getInputType = (attribute, operator = false) => {
	if (operator && STRING_OPERATORS.includes(operator)) {
		return 'text';
	}
	return ATTRIBUTE_TYPE_MAP[attribute] || 'text';
};

export const getCurrencyCode = (autoFee) => {
	return autoFee?.currency || window?.scData?.currency_code || 'USD';
};

/**
 * Whether a rules tree contains a Geo Address Country condition.
 *
 * The tree is the OR→AND group shape used by dynamic prices: groups nest a
 * `conditions` array of either sub-groups or leaf conditions. Walks recursively
 * so it holds regardless of nesting depth.
 *
 * @param {Object} rules Rules group ({ conditions: [...] }).
 * @return {boolean} True if any leaf targets a geo-address attribute.
 */
export const rulesHaveGeoAddressCountry = (rules) => {
	const conditions = rules?.conditions;
	if (!Array.isArray(conditions)) {
		return false;
	}
	return conditions.some((node) => {
		if (GEO_ADDRESS_ATTRIBUTES.includes(node?.attribute_name)) {
			return true;
		}
		return rulesHaveGeoAddressCountry(node);
	});
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
