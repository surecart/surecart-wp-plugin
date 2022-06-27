import { createLocalStore } from './local';
export default createLocalStore<any>('surecart-local-storage', () => ({}), true);
