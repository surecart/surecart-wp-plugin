import { createBrowserHistory } from 'history';
import { locationToRoute } from './utils';
import { createContext } from 'react';

export const history = createBrowserHistory();
export const RouterContext = createContext({
	route: locationToRoute(history.location),
});
