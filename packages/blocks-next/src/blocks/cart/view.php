<div
    <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
    <?php
        echo wp_kses_data(
            wp_interactivity_data_wp_context(
                [
                    'formId' => esc_attr( $form->ID ),
                    'mode' => esc_attr( $mode ),
                ]
            )
        );
    ?>
	data-wp-interactive='{ "namespace": "surecart/checkout" }'
    data-wp-watch="surecart/checkout::callbacks.fetchCheckout"
>
    <dialog
        class="sc-drawer"
        data-wp-on--click="surecart/dialog::actions.closeOverlay"
    >
        <div class="sc-drawer__wrapper">
            <?php echo do_blocks( $content ); ?>
        </div>
    </dialog>
</div>
