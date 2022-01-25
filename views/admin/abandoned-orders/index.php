<div class="wrap">
    <?php \CheckoutEngine::render('layouts/partials/admin-index-header', [
        'title' => __('Abandoned Orders', 'checkout_engine'),
    ]); ?>

    <?php $table->display(); ?>
</div>
