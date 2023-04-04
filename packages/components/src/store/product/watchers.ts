import state, { onChange } from './store';

onChange('selectedPrice', value => {
  state.total = state.adHocAmount || value?.amount || 0;
});
