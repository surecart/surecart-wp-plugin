import Price from '../../components/price';

export default ({ prices, product, children }) => {
	if (!prices || !prices.length) {
		return children;
	}

	return (prices || []).map((price) => {
		return (
			<Price
				id={price?.id}
				prices={prices}
				product={product}
				key={price?.id}
			/>
		);
	});
};
