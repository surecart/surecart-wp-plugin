import state, { onChange } from './store';
import { setOrder } from '../checkouts';
onChange('checkout', val => setOrder(val, state.formId));
