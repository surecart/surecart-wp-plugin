import { createContext, useContext } from '@wordpress/element';

import { defaultProductData } from '../Blocks/ProductList/consts';

const ProductDataContext = createContext({
	product: defaultProductData,
	hasContext: false,
	isLoading: false,
});

export const useProductDataContext = () => useContext(ProductDataContext);

export const ProductDataContextProvider = ({
	product = null,
	children,
	isLoading,
}) => {
	const contextValue = {
		product: product || defaultProductData,
		isLoading,
		hasContext: true,
	};

	return (
		<ProductDataContext.Provider value={contextValue}>
			{isLoading ? (
				<div className="is-loading">{children}</div>
			) : (
				children
			)}
		</ProductDataContext.Provider>
	);
};
