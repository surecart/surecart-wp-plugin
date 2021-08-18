<div class="wrap">
    <h1 class="wp-heading-inline">{{ __('Coupons', 'checkout_engine') }}</h1>
	<a href="{{\CheckoutEngine::getEditUrl( 'coupon' )}}" class="page-title-action">Add New</a>
    <hr class="wp-header-end" />

    <?php
    // $table->search();
    ?>

    <?php
    // $table->views();
    ?>

    <?php $table->display(); ?>
</div>
