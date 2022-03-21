import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';

@Component({
  tag: 'sc-consumer',
})
export class ScConsumer {
  @Prop() renderer: any;
  @State() context: any;
  @Event({ eventName: 'mountConsumer' }) mountEmitter: EventEmitter;
  @State() promise: Promise<any>;
  @State() resolvePromise: any;

  constructor() {
    this.promise = new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }

  setContext = async (context: any) => {
    this.context = context;
    return this.promise;
  };

  componentWillLoad() {
    this.mountEmitter.emit(this.setContext);
  }

  disconnectedCallback() {
    this.resolvePromise();
  }

  render() {
    if (!this.context) {
      return null;
    }
    return this.renderer(this.context);
  }
}
