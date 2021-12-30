import { Component, h, Listen, Element, State, Watch, Prop } from '@stencil/core';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
import { Universe } from 'stencil-wormhole';

@Component({
  tag: 'ce-router',
  shadow: true,
})
export class CeRouter {
  @Element() el: HTMLCeRouterElement;
  @State() location: string;
  @Prop() autoScroll: boolean;

  // update the location prop in route components.
  @Listen('ceNavigate', { target: 'window' })
  handleNavigation(e) {
    this.location = '';
    this.location = addQueryArgs(window.location.href, e.detail || {});
  }

  componentDidLoad() {
    window.onpopstate = () => {
      this.updateComponentLocations(window.location.href);
      this.checkDefaultRoute();
    };
    this.updateComponentLocations(window.location.href);
    this.checkDefaultRoute();
  }

  @Watch('location')
  handleLocationChange() {
    window.history.pushState(null, '', this.location);
    this.updateComponentLocations(this.location);
    this.checkDefaultRoute();
    if (this.autoScroll) {
      this.el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateComponentLocations(location: string) {
    this.el.querySelectorAll('ce-route').forEach(route => {
      route.location = location;
    });
  }

  componentWillLoad() {
    // @ts-ignore
    Universe.create(this, this.state());
  }

  /** Load the default route if there are no matches. */
  checkDefaultRoute() {
    let matched = false;
    const defaultRoute = this.el.querySelector('ce-route[default]') as HTMLCeRouteElement;

    this.el.querySelectorAll('ce-route').forEach(route => {
      if (route.matched && !matched) {
        matched = true;
      }
    });

    if (!matched && defaultRoute) {
      defaultRoute.matched = true;
    }
  }

  state() {
    return {
      location: window.location.href,
      ...getQueryArgs(window.location.href),
    };
  }

  render() {
    return (
      <Universe.Provider state={this.state()}>
        <slot></slot>
      </Universe.Provider>
    );
  }
}
