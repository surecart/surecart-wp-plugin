import { Product } from 'src/types';
import { state, dispose } from '..';

describe('checkout store', () => {
  beforeEach(() => {
    dispose();
  });

  describe('events', () => {
    it('emits scProductViewed event', () => {
      // listen to scCheckoutIntiated event
      const listener = jest.fn();
      window.addEventListener('scProductViewed', listener);

      // expect event to be emitted
      state.product = {
        id: 'test',
      } as Product;

      expect(listener).toBeCalledTimes(1);
    });
  });
});
