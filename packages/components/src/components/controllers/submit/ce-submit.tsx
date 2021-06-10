import { Component, h, Prop, Element } from '@stencil/core';
import { createContext } from '../../context/utils/createContext';
const { Consumer } = createContext({}); // Import the Tunnel

@Component({
  tag: 'ce-submit',
  shadow: false,
})
export class CeSubmit {
  @Element() host: HTMLDivElement;

  /** The button's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'large';

  /** Draws the button full-width */
  @Prop({ reflect: true }) full?: boolean = true;

  /** Draws the button full-width */
  @Prop() text: string = '';

  render() {
    return (
      <Consumer>
        {({ loading }) => (
          <ce-button loading={loading} disabled={loading} type="primary" submit full={this.full} size={this.size}>
            {this.text}
          </ce-button>
        )}
      </Consumer>
    );
  }
}
