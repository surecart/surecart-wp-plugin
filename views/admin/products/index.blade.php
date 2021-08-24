<div id="app"></div>
<div class="wrap">
    <h1 class="wp-heading-inline">{{ __('Products', 'checkout_engine') }}</h1>
	<a href="{{\CheckoutEngine::getEditUrl( 'product' )}}" class="page-title-action">
		{{__('Add New','checkout_engine')}}
	</a>
    <hr class="wp-header-end" />

    <?php
    // $table->search();
    ?>

    <?php
    // $table->views();
    ?>

    <?php $table->display(); ?>
</div>
