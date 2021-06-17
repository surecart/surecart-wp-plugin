import { Component, h, Prop, Element, State, Watch } from '@stencil/core';
import { Price } from '../../../types';
import { getFormattedPrice } from '../../../functions/price';
import { createContext } from '../../context/utils/createContext';
const { Consumer, injectProps } = createContext({});

@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: false,
})
export class CePriceChoices {
  @Element() el: HTMLCePriceChoicesElement;

  @Prop() submitting: boolean = true;
  @Prop() prices: Array<Price>;
  @Prop() price_ids: Array<string>;
  @Prop() default: string;
  @Prop() type: 'radio' | 'checkbox' = 'radio';
  @Prop() columns: number = 1;

  @State() loading: boolean = true;

  @Watch('loading')
  handleLoadingChange() {
    if (!this.loading) {
      setTimeout(() => this.updateSelected(), 1);
    }
  }

  updateSelected() {
    const choices = this.el.querySelectorAll('ce-choice');
    const selected = Array.from(choices).filter(choice => {
      return choice.name && choice.checked && !choice.disabled;
    });

    let ids = (selected || []).map(item => item.value);
    console.log(ids);
  }

  renderHTML = ({ price_ids, loading, prices }) => {
    this.loading = loading;

    if (!price_ids?.length) {
      return;
    }

    if (loading) {
      // TODO: translations needed here - do this in provider
      return (
        <ce-choices style={{ '--columns': this.columns.toString() }}>
          {price_ids.map((id, index) => {
            return (
              <ce-choice name="loading" disabled type={this.type} checked={this.default ? this.default === id : index === 0}>
                <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
                <ce-skeleton style={{ width: '140px', display: 'inline-block' }} slot="description"></ce-skeleton>
                <ce-skeleton style={{ width: '20px', display: 'inline-block' }} slot="price"></ce-skeleton>
                <ce-skeleton style={{ width: '40px', display: 'inline-block' }} slot="per"></ce-skeleton>
              </ce-choice>
            );
          })}
        </ce-choices>
      );
    }

    if (!prices?.length) {
      return;
    }

    return (
      <ce-choices style={{ '--columns': this.columns.toString() }}>
        {prices.map((price, index) => {
          return (
            <ce-choice
              onCeChange={() => this.updateSelected()}
              name={price.product_id}
              value={price.id}
              type={this.type}
              checked={this.default ? this.default === price.id : index === 0}
            >
              {price.name}
              <span slot="description">{price.description}</span>
              <span slot="price">{getFormattedPrice(price)}</span>
              <span slot="per">{price.recurring_interval ? `/${price.recurring_interval}` : `once`}</span>
            </ce-choice>
          );
        })}
      </ce-choices>
    );
  };

  render() {
    return <Consumer>{({ price_ids, loading, prices }) => this.renderHTML({ price_ids, loading, prices })}</Consumer>;
  }
}

injectProps(CePriceChoices, ['message', 'increment']);
