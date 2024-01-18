import { createStore } from '@stencil/store';
import { ScNoticeStore } from '../../types';

const store = createStore<ScNoticeStore>(
  {
    type: 'default',
    code: '',
    message: '',
    data: {
      status: 0,
      type: '',
      http_status: '',
    },
    additional_errors: [],
    dismissible: false,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

const { state, onChange, on, dispose, forceUpdate } = store;
export default state;
export { state, onChange, on, dispose, forceUpdate };
