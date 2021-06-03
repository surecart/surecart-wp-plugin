import { Component, Prop, Element, h } from '@stencil/core';
import { loadStripe } from '@stripe/stripe-js/pure';

@Component({
  tag: 'ce-stripe-element',
  styleUrl: 'ce-stripe-element.scss',
  shadow: false,
})
export class CEStripeElement {
  @Element() el: HTMLElement;
  private input: HTMLDivElement;
  private stripe: any;
  private elements: any;
  private element: any;

  /** Stripe publishable key */
  @Prop() publishableKey: string;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's label. Alternatively, you can use the label slot. */
  @Prop() label: string;

  /** The input's help text. Alternatively, you can use the help-text slot. */
  @Prop() help: string = '';

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** Inputs focus */
  @Prop({ mutable: true, reflect: true }) hasFocus: boolean;

  async componentWillLoad() {
    if (!this.publishableKey) {
      return;
    }
    this.stripe = await loadStripe(this.publishableKey);
    this.elements = this.stripe.elements();
  }

  componentDidLoad() {
    if (!this.elements) {
      return;
    }
    this.elements
      .create('card', {
        style: {
          base: {
            'color': '#303238',
            'fontSize': '16px',
            'fontSmoothing': 'antialiased',
            '::placeholder': {
              color: '#CFD7DF',
            },
          },
          invalid: {
            'color': '#e5424d',
            ':focus': {
              color: '#303238',
            },
          },
        },
      })
      .mount(this.input);

    this.element = this.elements.getElement('card');

    this.element.on('focus', () => {
      this.hasFocus = true;
    });
    this.element.on('blur', () => {
      this.hasFocus = false;
    });
  }

  render() {
    return (
      <ce-input class="ce-stripe" size={this.size} label={this.label} help={this.help} hasFocus={this.hasFocus}>
        <div ref={el => (this.input = el as HTMLDivElement)}></div>
      </ce-input>
    );
  }
}
