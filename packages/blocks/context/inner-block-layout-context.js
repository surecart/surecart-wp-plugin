/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

const InnerBlockLayoutContext = createContext({
	parentName: '',
	isLoading: false,
});

export const useInnerBlockLayoutContext = () =>
	useContext(InnerBlockLayoutContext);

export const InnerBlockLayoutContextProvider = ({
	parentName = '',
	children,
}) => {
	const contextValue = {
		parentName,
	};

	return (
		<InnerBlockLayoutContext.Provider value={contextValue}>
			{children}
		</InnerBlockLayoutContext.Provider>
	);
};
