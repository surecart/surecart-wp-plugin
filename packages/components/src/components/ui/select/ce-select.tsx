import { h, Component, Method, Prop } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import {
  AjaxFn,
  ClassNames,
  FuseOptions,
  IChoicesProps,
  IChoicesMethods,
  ItemFilterFn,
  NoResultsTextFn,
  NoChoicesTextFn,
  AddItemTextFn,
  MaxItemTextFn,
  SortFn,
  OnInit,
  OnCreateTemplates,
  ValueCompareFunction,
} from './interfaces';
import { getValues, filterObject, isDefined } from './utils';
import Choices from 'choices.js';
let id = 0;

@Component({
  tag: 'ce-select',
  styleUrl: 'ce-select.scss',
  shadow: true,
})
export class CeSelect implements IChoicesProps, IChoicesMethods {
  private inputId: string = `input-${++id}`;
  private helpId = `input-help-text-${id}`;
  private labelId = `input-label-${id}`;
  private input: HTMLSelectElement | HTMLInputElement;

  /** The type of input */
  @Prop() public type?: 'single' | 'multiple' | 'text' = 'single';

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's name attribute. */
  @Prop() name: string;

  /** The input's value attribute. */
  @Prop({ mutable: true }) value = '';

  /** Draws a pill-style input with rounded edges. */
  @Prop({ reflect: true }) pill = false;

  /** The input's label. */
  @Prop() label: string;

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** The input's help text. */
  @Prop() help: string = '';

  /** Optionally suppress console errors and warnings. */
  @Prop() public silent: boolean = false;

  /** Add pre-selected items to text input */
  @Prop() public items: Array<any> = [];

  /** Add choices to select input. */
  @Prop() public choices: Array<any> = [];

  /** A The amount of choices to be rendered within the dropdown list ("-1" indicates no limit). This is useful if you have a lot of choices where it is easier for a user to use the search area to find a choice. */
  @Prop() public renderChoiceLimit: number = -1;

  /** The amount of items a user can input/select ("-1" indicates no limit). */
  @Prop() public maxItemCount: number;

  /** Whether a user can add items. */
  @Prop() public addItems: boolean;

  /** Whether a user can remove items. */
  @Prop() public removeItems: boolean;

  /** Whether each item should have a remove button. */
  @Prop() public removeItemButton: boolean;

  /** Whether a user can edit items. An item's value can be edited by pressing the backspace. */
  @Prop() public editItems: boolean;

  /** Whether duplicate inputted/chosen items are allowed. */
  @Prop() public duplicateItemsAllowed: boolean;

  /** What divides each value. The default delimiter separates each value with a comma: "Value 1, Value 2, Value 3" */
  @Prop() public delimiter: string = ',';

  /** Whether a user can paste into the input. */
  @Prop() public paste: boolean = true;

  /** Whether a search area should be shown. Note: Multiple select boxes will always show search areas. */
  @Prop() public searchEnabled: boolean = true;

  /** Whether choices should be filtered by input or not. If false, the search event will still emit, but choices will not be filtered. */
  @Prop() public searchChoices: boolean = true;

  /** Specify which fields should be used when a user is searching. If you have added custom properties to your choices, you can add these values thus: ['label', 'value', 'customProperties.example']. */
  @Prop() public searchFields: Array<string> | string;

  /** The minimum length a search value should be before choices are searched. */
  @Prop() public searchFloor: number;

  /** The maximum amount of search results to show.  */
  @Prop() public searchResultLimit: number;

  /** Whether the dropdown should appear above (top) or below (bottom) the input. By default, if there is not enough space within the window the dropdown will appear above the input, otherwise below it. */
  @Prop() public position: 'auto' | 'top' | 'bottom';

  /** Whether the scroll position should reset after adding an item. */
  @Prop() public resetScrollPosition: boolean;

  /** A RegExp or string (will be passed to RegExp constructor internally) or filter function that will need to return true for a user to successfully add an item. */
  @Prop() public shouldSort: boolean;

  /** Whether choices and groups should be sorted. If false, choices/groups will appear in the order they were given. */
  @Prop() public shouldSortItems: boolean;

  /** The function that will sort choices and items before they are displayed (unless a user is searching). By default choices and items are sorted by alphabetical order. */
  @Prop() public sorter: SortFn;

  /** Whether the input should show a placeholder. Used in conjunction with placeholderValue. If placeholder is set to true and no value is passed to placeholderValue, the passed input's placeholder attribute will be used as the placeholder value. */
  @Prop() public placeholder: boolean | string;

  /** The value of the inputs placeholder. */
  @Prop() public placeholderValue: string;

  /** The value of the search inputs placeholder. */
  @Prop() public searchPlaceholderValue: string;

  /** Prepend a value to each item added/selected. */
  @Prop() public prependValue: string;

  /** Append a value to each item added/selected. */
  @Prop() public appendValue: string;

  /** Whether selected choices should be removed from the list. By default choices are removed when they are selected in multiple select box. To always render choices pass always. */
  @Prop() public renderSelectedChoices: 'always' | 'auto' = 'auto';

  /** The text that is shown whilst choices are being populated via AJAX. */
  @Prop() public loadingText: string = 'Loading...';

  /** The text that is shown when a user's search has returned no results. Optionally pass a function returning a string. */
  @Prop() public noResultsText: string | NoResultsTextFn = 'No results found.';

  /** The text that is shown when a user has selected all possible choices. Optionally pass a function returning a string. */
  @Prop() public noChoicesText: string | NoChoicesTextFn = 'No choices found.';

  /** The text that is shown when a user hovers over a selectable choice. */
  @Prop() public itemSelectText: string = 'Press to select';

  /** The text that is shown when a user has inputted a new item but has not pressed the enter key. To access the current input value, pass a function with a value argument (see the default config for an example), otherwise pass a string. */
  @Prop() public addItemText: string | AddItemTextFn;

  /** The text that is shown when a user has focus on the input but has already reached the max item count. To access the max item count, pass a function with a maxItemCount argument (see the default config for an example), otherwise pass a string. */
  @Prop() public maxItemText: string | MaxItemTextFn;

  /** Classnames to use */
  @Prop() public classNames: ClassNames;

  /** Fuse.js options */
  @Prop() public fuseOptions: FuseOptions;

  /** A RegExp or string (will be passed to RegExp constructor internally) or filter function that will need to return true for a user to successfully add an item. */
  @Prop() public addItemFilter: string | RegExp | ItemFilterFn;
  @Prop() public callbackOnInit: OnInit;
  @Prop() public callbackOnCreateTemplates: OnCreateTemplates;
  @Prop() public valueComparer: ValueCompareFunction;

  private choice;
  private element;

  @Method()
  public async highlightItem(item: HTMLElement, runEvent?: boolean) {
    this.choice.highlightItem(item, runEvent);

    return this;
  }

  @Method()
  public async unhighlightItem(item: HTMLElement) {
    this.choice.unhighlightItem(item);

    return this;
  }

  @Method()
  public async highlightAll() {
    this.choice.highlightAll();

    return this;
  }

  @Method()
  public async unhighlightAll() {
    this.choice.unhighlightAll();

    return this;
  }

  @Method()
  public async removeActiveItemsByValue(value: string) {
    this.choice.removeActiveItemsByValue(value);

    return this;
  }

  @Method()
  public async removeActiveItems(excludedId?: number) {
    this.choice.removeActiveItems(excludedId);

    return this;
  }

  @Method()
  public async removeHighlightedItems(runEvent?: boolean) {
    this.choice.removeHighlightedItems(runEvent);

    return this;
  }

  @Method()
  public async showDropdown(focusInput?: boolean) {
    this.choice.showDropdown(focusInput);

    return this;
  }

  @Method()
  public async hideDropdown(blurInput?: boolean) {
    this.choice.hideDropdown(blurInput);

    return this;
  }

  @Method()
  public async getValue(valueOnly?: boolean): Promise<string | Array<string>> {
    return this.choice.getValue(valueOnly);
  }

  @Method()
  public async setValue(args: Array<any>) {
    this.choice.setValue(args);

    return this;
  }

  @Method()
  public async setChoiceByValue(value: string | Array<string>) {
    this.choice.setChoiceByValue(value);

    return this;
  }

  @Method()
  public async setChoices(choices: Array<any>, value: string, label: string, replaceChoices?: boolean) {
    this.choice.setChoices(choices, value, label, replaceChoices);

    return this;
  }

  @Method()
  public async clearChoices() {
    this.choice.clearChoices();

    return this;
  }

  @Method()
  public async clearStore() {
    this.choice.clearStore();

    return this;
  }

  @Method()
  public async clearInput() {
    this.choice.clearInput();

    return this;
  }

  @Method()
  public async enable() {
    this.choice.enable();

    return this;
  }

  @Method()
  public async disable() {
    this.choice.disable();

    return this;
  }

  @Method()
  public async ajax(fn: AjaxFn) {
    this.choice.ajax(fn);

    return this;
  }

  protected componentDidLoad() {
    this.init();
  }

  protected componentDidUpdate() {
    this.init();
  }

  protected disconnectedCallback() {
    this.destroy();
  }

  renderElement() {
    const attributes = {
      name: this.name || null,
    };

    switch (this.type) {
      case 'single':
        return (
          <select {...attributes} ref={el => (this.input = el as HTMLSelectElement)}>
            {this.value ? this.createSelectOptions(this.value) : null}
          </select>
        );
      case 'multiple':
        return (
          <select {...attributes} multiple ref={el => (this.input = el as HTMLSelectElement)}>
            {this.value ? this.createSelectOptions(this.value) : null}
          </select>
        );
      case 'text':
      default:
        return <input type="text" value={this.value} ref={el => (this.input = el as HTMLInputElement)} {...attributes} />;
    }
  }

  protected render(): any {
    // destroy choices element to restore previous dom structure
    // so vdom can replace the element correctly
    this.destroy();

    return (
      <ce-form-control size={this.size} label={this.label} showLabel={this.showLabel} help={this.help} inputId={this.inputId} helpId={this.helpId} labelId={this.labelId}>
        <div onClick={() => this.showDropdown()}>{this.renderElement()}</div>
      </ce-form-control>
    );
  }

  private init() {
    const props = {
      silent: this.silent,
      items: this.items,
      choices: this.choices,
      renderChoiceLimit: this.renderChoiceLimit,
      maxItemCount: this.maxItemCount,
      addItems: this.addItems,
      removeItems: this.removeItems,
      removeItemButton: this.removeItemButton,
      editItems: this.editItems,
      duplicateItemsAllowed: this.duplicateItemsAllowed,
      delimiter: this.delimiter,
      paste: this.paste,
      searchEnabled: this.searchEnabled,
      searchChoices: this.searchChoices,
      searchFields: this.searchFields,
      searchFloor: this.searchFloor,
      searchResultLimit: this.searchResultLimit,
      position: this.position,
      resetScrollPosition: this.resetScrollPosition,
      shouldSort: this.shouldSort,
      shouldSortItems: this.shouldSortItems,
      sorter: this.sorter,
      placeholder: true,
      placeholderValue: this.placeholderValue || (typeof this.placeholder === 'string' && this.placeholder) || ' ',
      searchPlaceholderValue: this.searchPlaceholderValue,
      prependValue: this.prependValue,
      appendValue: this.appendValue,
      renderSelectedChoices: this.renderSelectedChoices,
      loadingText: this.loadingText,
      noResultsText: this.noResultsText,
      noChoicesText: this.noChoicesText,
      itemSelectText: this.itemSelectText,
      addItemText: this.addItemText,
      maxItemText: this.maxItemText,
      classNames: this.classNames,
      fuseOptions: this.fuseOptions,
      callbackOnInit: this.callbackOnInit,
      callbackOnCreateTemplates: this.callbackOnCreateTemplates,
      valueComparer: this.valueComparer,
      addItemFilter: this.addItemFilter,
    };
    const settings = filterObject(props, isDefined);

    this.choice = new Choices(this.input, settings);
  }

  private destroy() {
    if (this.element) {
      this.element = null;
    }

    if (this.choice) {
      this.choice.destroy();
      this.choice = null;
    }
  }

  private createSelectOptions(values: string | Array<string>): Array<HTMLStencilElement> {
    return getValues(values).map(value => <option value={value}>{value}</option>);
  }
}
