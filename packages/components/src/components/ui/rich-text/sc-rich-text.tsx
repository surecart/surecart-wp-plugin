import { Component, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
let id = 0;

@Component({
  tag: 'sc-rich-text',
  styleUrl: 'sc-rich-text.scss',
  shadow: true,
})
export class ScRichText {
  private inputId: string = `sc-richtext-${++id}`;
  private helpId = `sc-richtext-help-text-${id}`;
  private labelId = `sc-richtext-label-${id}`;

  /** The textarea's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The textarea's name attribute. */
  @Prop() name: string;

  /** The textarea's value attribute. */
  @Prop() value = '';

  /** The textarea's label. Alternatively, you can use the label slot. */
  @Prop() label = '';

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** The textarea's help text. Alternatively, you can use the help-text slot. */
  @Prop() help = '';

  /** The textarea's placeholder text. */
  @Prop() placeholder: string;

  /** Disables the textarea. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Makes the textarea readonly. */
  @Prop({ reflect: true }) readonly: boolean = false;

  /** Makes the textarea a required field. */
  @Prop({ reflect: true }) required: boolean = false;

  @State() updatedAt: any = Date.now();
  @State() hasFocus: boolean;

  @Event() scChange: EventEmitter<void>;
  @Event() scInput: EventEmitter<void>;
  @Event() scBlur: EventEmitter<void>;
  @Event() scFocus: EventEmitter<void>;

  private element: HTMLDivElement;
  private editor: any;

  componentDidLoad() {
    if (this.editor) return;
    this.editor = new Editor({
      element: this.element,
      extensions: [StarterKit],
      content: this.value,
      onCreate: ({ editor }) => {
        this.value = editor.getHTML();
      },
      onUpdate: ({ editor }) => {
        this.value = editor.getHTML();
        this.scInput.emit();
        this.scChange.emit();
      },
      onSelectionUpdate: () => {
        this.updatedAt = Date.now();
      },
      onFocus: () => {
        this.handleFocus();
      },
      onBlur: () => {
        this.handleBlur();
      },
    });
  }

  handleFocus() {
    this.hasFocus = true;
    this.scFocus.emit();
  }

  handleBlur() {
    this.hasFocus = false;
    this.scBlur.emit();
  }

  isActive(type, opts = {}) {
    return this.editor?.isActive?.(type, opts);
  }

  toggleHeading(opts) {
    this.editor.chain().toggleHeading(opts).focus().run();
  }

  toggleBold() {
    this.editor.chain().toggleBold().focus().run();
  }

  toggleItalic() {
    this.editor.chain().toggleItalic().focus().run();
  }

  can(property) {
    return this.editor?.can()?.chain?.()?.focus?.()?.[property]?.()?.run?.();
  }

  run(property) {
    return this.editor?.chain?.()?.focus?.()?.[property]?.()?.run?.();
  }

  render() {
    return (
      <Host>
        <sc-form-control
          exportparts="label, help-text, form-control"
          size={this.size}
          required={this.required}
          label={this.label}
          showLabel={this.showLabel}
          help={this.help}
          inputId={this.inputId}
          helpId={this.helpId}
          labelId={this.labelId}
          name={this.name}
        >
          <div part="base" class={{ 'editor-base': true, 'editor--focused': this.hasFocus }}>
            <div class="menu">
              <sc-button size="small" type={this.editor?.isActive?.('bold') ? 'default' : 'text'} onClick={() => this.run('toggleBold')} disabled={!this.can('toggleBold')}>
                <sc-icon name="bold" />
              </sc-button>
              <sc-button size="small" type={this.editor?.isActive?.('italic') ? 'default' : 'text'} onClick={() => this.run('toggleItalic')} disabled={!this.can('toggleItalic')}>
                <sc-icon name="italic" />
              </sc-button>
              <sc-button size="small" type={this.editor?.isActive?.('bulletList') ? 'default' : 'text'} onClick={() => this.run('toggleBulletList')}>
                <sc-icon name="list" />
              </sc-button>
              <sc-button size="small" type={this.editor?.isActive?.('strike') ? 'default' : 'text'} onClick={() => this.run('toggleStrike')}>
                <sc-icon name="minus" />
              </sc-button>
              <sc-button class="right" size="small" type="text" onClick={() => this.run('undo')} disabled={!this.can('undo')}>
                <sc-icon name="corner-up-left" />
              </sc-button>
              <sc-button size="small" type="text" onClick={() => this.run('redo')} disabled={!this.can('redo')}>
                <sc-icon name="corner-up-right" />
              </sc-button>
            </div>
            <div
              part="editor"
              class={{
                editor: true,
              }}
              ref={el => (this.element = el as HTMLDivElement)}
            ></div>
          </div>
        </sc-form-control>
      </Host>
    );
  }
}
