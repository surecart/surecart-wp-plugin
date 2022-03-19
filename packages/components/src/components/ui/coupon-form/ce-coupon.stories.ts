export default {
  title: 'Components/CouponForm',
  argTypes: {
    couponState: {
      control: {
        type: 'select',
      },
      options: ['empty', 'invalid', 'success'],
    },
  },
};

const Template = ({ couponState, label, button, loading }) => {
  setTimeout(() => {
    const form = document.querySelector('ce-coupon-form');
    if (couponState === 'success') {
      form.discount = {
        id: '4d75c0c8-e33c-4473-8f0b-349595c5faa5',
        object: 'discount',
        coupon: {
          id: '9ce92285-5194-42fe-b659-c2ff7e7bc1a1',
          object: 'coupon',
          amount_off: null,
          currency: 'usd',
          duration: 'forever',
          duration_in_months: null,
          expired: false,
          metadata: {
            wp_created_by: '1',
          },
          max_redemptions: null,
          name: '100 Percent',
          percent_off: 100,
          redeem_by: null,
          times_redeemed: 3,
          created_at: 1646924766,
          updated_at: 1647653097,
        },
        promotion: {
          id: 'cd9467c3-f810-4c26-aac4-ac497c2f8847',
          object: 'promotion',
          code: 'DEVTEST',
          expired: false,
          max_redemptions: null,
          metadata: [],
          redeem_by: null,
          times_redeemed: 3,
          created_at: 12345,
        },
      };
    }
    if (couponState === 'invalid') {
      form.open = true;
      form.error = 'This coupon is not valid.';
    }
  });
  return `<ce-coupon-form label="${label}" ${loading && 'loading'}>${button}</ce-coupon-form>`;
};

export const Default = Template.bind({});
Default.args = {
  couponState: 'empty',
  label: 'Add Coupon',
  button: 'Apply Coupon',
  loading: false,
};
