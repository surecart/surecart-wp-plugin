import state, { onChange } from './store';

onChange('selectedPrice', value => {
  // update the total when the selected price changes.
  state.total = state.adHocAmount || value?.amount || 0;
  // set the ad hoc amount to the selected product amount.
  state.adHocAmount = value?.amount;
});
