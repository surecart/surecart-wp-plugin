/**
 * WordPress dependencies
 */
import {
	createContext,
	useContext,
	useSyncExternalStore,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import history from './history';
import { NavigationConfirmProvider } from './NavigationConfirmProvider';

const RoutesContext = createContext();
const HistoryContext = createContext();

export function useLocation() {
	return useContext(RoutesContext);
}

export function useHistory() {
	return useContext(HistoryContext);
}

export function RouterProvider({ children }) {
	const location = useSyncExternalStore(
		history.listen,
		history.getLocationWithParams,
		history.getLocationWithParams
	);

	return (
		<HistoryContext.Provider value={history}>
			<RoutesContext.Provider value={location}>
				<NavigationConfirmProvider>{children}</NavigationConfirmProvider>
			</RoutesContext.Provider>
		</HistoryContext.Provider>
	);
}

export { useNavigationConfirm } from './NavigationConfirmProvider';
export * from './useLink';
