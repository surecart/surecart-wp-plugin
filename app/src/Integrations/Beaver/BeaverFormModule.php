<?php

namespace SureCart\Integrations\Beaver;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * SureCart form form widget.
 *
 * Surecart widget that displays a form.
 */
class BeaverFormModule extends \FLBuilderModule {
	
	public function __construct() {
        parent::__construct([
            'name'            => __('SureCart Form', 'surecart'),
            'description'     => __('SureCart Form', 'surecart'),
            'group'           => __('SureCart', 'surecart'),
            'category'        => __('SureCart', 'surecart'),
            'dir'             => SURECART_BB_DIR . 'ReusableFormModule/',
            'url'             => SURECART_BB_URL . 'ReusableFormModule/',
            'icon'            => 'button.svg',
            'editor_export'   => true, // Defaults to true and can be omitted.
            'enabled'         => true, // Defaults to true and can be omitted.
            'partial_refresh' => false, // Defaults to false and can be omitted.
        ]);

        $this->slug = 'surecart-form';
    }

    /**
     * Should be overridden by subclasses to enqueue
     * additional css/js using the add_css and add_js methods.
     *
     * @since x.x.x
	 *
     * @return void
     */
    public function enqueue_scripts() {
		do_action('surecart_form/bb_scripts');

		$this->add_js('surecart-beaver-scripts', plugins_url( 'ReusableFormModule/src/settings.js', __FILE__ ), array( 'jquery' ), time(), true );
    	$this->add_css('surecart-beaver-style', plugins_url( 'ReusableFormModule/css/settings.css', __FILE__ ), '', time(), 'all');
	}

	/**
	 * Get settings
	 *
	 * @return array
	 */
    public static function getSettings() {
        return [
            'settings' => [
                'title' => __('Settings', 'surecart'),
                'sections' => [
                    'sc_form_select' => [
                        'title' => 'Checkout Forms',
                        'fields' => [
                            'sc_form_select_ajax' => [
                                'type' => 'raw',
                                'label' => __('Select Form', 'fl-builder'),
                                'content' => self::dynamic_dropdown()
                            ],
                            'form_id' => [
                                'type' => 'text',
                            ],
                            'form_name' => [
                                'type' => 'text',
                            ]
                        ]
                    ]
                ]
            ],
        ];
    }

	/**
	 * Get dynamic forms dropdown
	 *
	 * @return html
	 */
    public static function dynamic_dropdown() {
        ob_start();
		?>
        <div class="surecart-builder--custom-form-controls">
            <div class="fl-builder--category-select" x-data="window.surecartBBDropdown({nonce: '<?php echo wp_create_nonce('wp_rest'); ?>'})" x-init="init">
                <div class="fl-builder--selector-display" x-on:click="open">
                    <button class="fl-builder--selector-display-label">
                        <span class="fl-builder--group-label"><?php esc_html_e('SureCart Checkout Forms', 'surecart'); ?></span>
                        <span class="fl-builder--current-view-name" x-text="form.name || 'Select Form'"></span>
                    </button>
                </div>
                <div class="surecart-builder--selector-menu">
                    <div class="surecart-builder--menu" x-show="isOpen()" x-on:click.away="close">
                        <input class="surecart-builder--dropdown-search" x-ref="searchbox" type="text" x-model="search" placeholder="<?php esc_html_e('Search Forms', 'surecart'); ?>" />
                        <template x-if="loading">
                            <svg width='14px' height='14px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring">
                                <rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect>
                                <circle cx="50" cy="50" r="44" stroke-dasharray="179.69909978533616 96.7610537305656" stroke="#2ea2cc" fill="none" stroke-width="12">
                                    <animateTransform attributeName="transform" type="rotate" values="0 50 50;180 50 50;360 50 50;" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" begin="0s"></animateTransform>
                                </circle>
                            </svg>
                        </template>
                        <template x-if="!loading" x-for="item in items" :key="item.ID">
                            <button class="surecart-builder--menu-item" x-text="item.post_title" x-on:click="setForm(item)"></button>
                        </template>
                    </div>
                </div>
                <div class="surecart-builder--form-edit-buttons">
                    <a href="/wp-admin/post-new.php?post_type=sc_form" class="fl-builder-button surecart-create-bb-form" target="_blank">
                        <?php esc_html_e('Create', 'surecart'); ?>
                    </a> &nbsp;
                    <template x-if="form.id">
                        <a x-bind:href="form.editLink" class="fl-builder-button surecart-create-bb-form" target="_blank">
                            <?php esc_html_e('Edit', 'surecart'); ?>
                        </a>
                    </template>
                </div>
            </div>
    	<?php
        return ob_get_clean();
    }

    /**
     * Display the block
     *
     * @return void
     */
    public function display() {
		if ( ! $this->settings->form_id ) {
            return;
        }

		echo do_shortcode( '[sc_form id=' . $this->settings->form_id . ']' );
        return;
    }
}
