import { Component, Watch, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { getIconLibrary, unwatchIcon, watchIcon } from './library';
import { requestIcon } from './request';

const parser = new DOMParser();

@Component({
  tag: 'sc-icon',
  styleUrl: 'sc-icon.css',
  shadow: true,
})
export class ScIcon {
  @State() private svg = '';

  /** The name of the icon to draw. */
  @Prop({ reflect: true }) name: string;

  /** An external URL of an SVG file. */
  @Prop() src: string;

  /** An alternative description to use for accessibility. If omitted, the name or src will be used to generate it. */
  @Prop() label: string;

  /** The name of a registered custom icon library. */
  @Prop() library = 'default';

  /** Emitted when the icon has loaded. */
  @Event() scLoad: EventEmitter<void>;

  /** Emitted when the icon failed to load.  */
  @Event() scError: EventEmitter<{ status: number }>;

  /** @internal Fetches the icon and redraws it. Used to handle library registrations. */
  redraw() {
    this.setIcon();
  }

  componentWillLoad() {
    this.setIcon();
  }

  connectedCallback() {
    watchIcon(this);
  }

  disconnectedCallback() {
    unwatchIcon(this);
  }

  getLabel() {
    let label = '';
    if (this.label) {
      label = this.label;
    } else if (this.name) {
      label = this.name.replace(/-/g, ' ');
    } else if (this.src) {
      label = this.src.replace(/.*\//, '').replace(/-/g, ' ').replace(/\.svg/i, '');
    }

    return label;
  }

  @Watch('name')
  @Watch('src')
  @Watch('library')
  async setIcon() {
    const library = getIconLibrary(this.library);
    const url = this.getUrl();
    if (url) {
      try {
        const file = await requestIcon(url)!;
        if (url !== this.getUrl()) {
          // If the url has changed while fetching the icon, ignore this request
          return;
        } else if (file.ok) {
          const doc = parser.parseFromString(file.svg, 'text/html');
          const svgEl = doc.body.querySelector('svg');

          if (svgEl) {
            if (library && library.mutator) {
              library.mutator(svgEl);
            }

            this.svg = svgEl.outerHTML;
            this.scLoad.emit();
          } else {
            this.svg = '';
            this.scError.emit({ status: file.status });
          }
        } else {
          this.svg = '';
          this.scError.emit({ status: file.status });
        }
      } catch {
        this.scError.emit({ status: -1 });
      }
    } else if (this.svg) {
      // If we can't resolve a URL and an icon was previously set, remove it
      this.svg = '';
    }
  }

  private getUrl(): string {
    const library = getIconLibrary(this.library);
    if (this.name && library) {
      return library.resolver(this.name);
    } else {
      return this.src;
    }
  }

  render() {
    return <div part="base" class="icon" role="img" aria-label={this.getLabel()} innerHTML={this.svg}></div>;
  }
}
