import { normalizePrices } from '../../../utils/schema';

export function setEntities(payload) {
	return {
		type: 'SET_ENTITIES',
		payload,
	};
}

export function mergeEntities(payload) {
	return {
		type: 'MERGE_ENTITIES',
		payload,
	};
}

export function setPrices(payload) {
	const { entities } = normalizePrices(payload);
	return mergeEntities(entities);
}

export function setProducts(payload) {
	const { entities } = normalizeProducts(payload);
	return mergeEntities(entities);
}
