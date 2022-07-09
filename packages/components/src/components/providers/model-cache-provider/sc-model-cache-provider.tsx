import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'sc-model-cache-provider',
  shadow: true,
})
export class ScModelCacheProvider {
  @Prop() cacheKey: string;

  /** Order Object */
  @Prop() model: object;

  @Prop() syncTabs: boolean = true;

  /** Update line items event */
  @Event() scUpdateModel: EventEmitter<object>;

  /** Sync this session back to parent. */
  @Watch('model')
  handleOrderChange() {
    if (this.model === null) {
      window.localStorage.removeItem(this.cacheKey);
    } else {
      window.localStorage.setItem(this.cacheKey, JSON.stringify(this.model));
    }
    this.scUpdateModel.emit(this.model);
  }

  /** Sycn the model accoss tabs */
  componentWillLoad() {
    this.model = JSON.parse(window.localStorage.getItem(this.cacheKey)) || null;
    this.scUpdateModel.emit(this.model);

    if (this.syncTabs) {
      window.addEventListener('storage', e => {
        console.log(e);
        if (e.key === this.cacheKey) {
          this.model = JSON.parse(e.newValue);
        }
      });
    }
  }

  render() {
    return null;
  }
}
