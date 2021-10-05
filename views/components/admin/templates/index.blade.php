<div class="wrap">

	@include('components.admin.flash-messages')

    <h1 class="wp-heading-inline">{{ $title }}</h1>

	@isset($model_type)
		<a href="<?php echo esc_url(\CheckoutEngine::getUrl()->edit( $model_type )); ?>" class="page-title-action">
			{{__('Add New','checkout_engine')}}
		</a>
	@endif

    <hr class="wp-header-end" />

	<?php
    // $table->search();
    ?>

    <?php
    // $table->views();
    ?>

    <?php $table->display(); ?>

	{{ $slot }}
</div>
