import { createStore } from '@stencil/store';

interface Store {
  id: string;
  method: string;
  manual: boolean;
}

const { state, onChange } = createStore<Store>({
  id: '',
  method: '',
  manual: false,
});

export default state;
export { state, onChange };
