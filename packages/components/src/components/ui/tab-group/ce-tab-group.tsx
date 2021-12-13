import { Component, h, Element, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'ce-tab-group',
  styleUrl: 'ce-tab-group.scss',
  shadow: true,
})
export class CeTabGroup {
  @Element() el: HTMLCeTabGroupElement;
  @State() activeTab: HTMLCeTabElement;

  private tabs: HTMLCeTabElement[] = [];
  private panels: HTMLCeTabPanelElement[] = [];

  @Event() ceTabHide: EventEmitter<string>;
  @Event() ceTabShow: EventEmitter<string>;

  componentDidLoad() {
    this.tabs = this.getAllTabs();
    this.panels = this.getAllPanels();
    this.setAriaLabels();
    this.setActiveTab(this.getActiveTab() || this.tabs[0], { emitEvents: false });
  }

  setAriaLabels() {
    // Link each tab with its corresponding panel
    this.tabs.map(tab => {
      const panel = this.panels.find(el => el.name === tab.panel) as HTMLCeTabPanelElement;
      if (panel) {
        tab.setAttribute('aria-controls', panel.getAttribute('id') as string);
        panel.setAttribute('aria-labelledby', tab.getAttribute('id') as string);
      }
    });
  }

  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const tab = target.closest('ce-tab') as HTMLCeTabElement;
    const tabGroup = tab?.closest('ce-tab-group') as HTMLCeTabGroupElement;

    // Ensure the target tab is in this tab group
    if (tabGroup !== this.el) {
      return;
    }

    if (tab) {
      this.setActiveTab(tab, { scrollBehavior: 'smooth' });
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const tab = target.closest('ce-tab') as HTMLCeTabElement;
    const tabGroup = tab?.closest('ce-tab-group');

    console.log(event.key);

    // Ensure the target tab is in this tab group
    if (tabGroup !== this.el) {
      return;
    }

    // Activate a tab
    if (['Enter', ' '].includes(event.key)) {
      if (tab) {
        this.setActiveTab(tab, { scrollBehavior: 'smooth' });
        event.preventDefault();
      }
    }

    // Move focus left or right
    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      const activeEl = document.activeElement as HTMLCeTabElement;

      if (activeEl && activeEl.tagName.toLowerCase() === 'ce-tab') {
        let index = this.tabs.indexOf(activeEl);

        if (event.key === 'Home') {
          index = 0;
        } else if (event.key === 'End') {
          index = this.tabs.length - 1;
        } else if (event.key === 'ArrowUp') {
          index = Math.max(0, index - 1);
        } else if (event.key === 'ArrowDown') {
          index = Math.min(this.tabs.length - 1, index + 1);
        }

        this.tabs[index].triggerFocus({ preventScroll: true });

        event.preventDefault();
      }
    }
  }

  /** Handle the active tabl selection */
  setActiveTab(tab: HTMLCeTabElement, options?: { emitEvents?: boolean; scrollBehavior?: 'auto' | 'smooth' }) {
    options = Object.assign(
      {
        emitEvents: true,
        scrollBehavior: 'auto',
      },
      options,
    );

    if (tab && tab !== this.activeTab && !tab.disabled) {
      const previousTab = this.activeTab;
      this.activeTab = tab;

      this.tabs.map(el => (el.active = el === this.activeTab));
      this.panels.map(el => (el.active = el.name === this.activeTab.panel));

      // Emit events
      if (options.emitEvents) {
        if (previousTab) {
          this.ceTabHide.emit(previousTab.panel);
        }
        this.ceTabShow.emit(this.activeTab.panel);
      }
    }
  }

  getActiveTab() {
    const tabs = this.getAllTabs();
    return tabs.find(el => el.active);
  }

  /** Get all child tabs */
  getAllTabs(includeDisabled = false) {
    return Array.from(this.el.children).filter((el: any) => {
      return includeDisabled ? el.tagName.toLowerCase() === 'ce-tab' : el.tagName.toLowerCase() === 'ce-tab' && !el.disabled;
    }) as HTMLCeTabElement[];
  }

  /** Get all child panels */
  getAllPanels() {
    return Array.from(this.el.children).filter((el: any) => el.tagName.toLowerCase() === 'ce-tab-panel') as [HTMLCeTabPanelElement];
  }

  render() {
    return (
      <div
        part="base"
        class={{
          'tab-group': true,
        }}
        onClick={e => this.handleClick(e)}
        onKeyDown={e => this.handleKeyDown(e)}
      >
        <div class="tab-group__nav-container" part="nav">
          <div class="tab-group__nav">
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <div part="active-tab-indicator" class="tab-group__indicator"></div>
              <slot name="nav"></slot>
            </div>
          </div>
        </div>
        <div part="body" class="tab-group__body">
          <slot />
        </div>
      </div>
    );
  }
}
