<div class="wrap">
    <h1 class="wp-heading-inline">{{ __('Orders', 'checkout_engine') }}</h1>
    <hr class="wp-header-end" />

    <?php $table->search(); ?>

    <?php $table->views(); ?>

    <?php $table->display(); ?>
</div>
