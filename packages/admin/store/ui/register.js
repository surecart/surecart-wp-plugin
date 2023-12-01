const { registerStore, select } = wp.data;
import { store, config } from './index';

if (!select(store)) {
	registerStore(store, config);
}
