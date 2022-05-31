<div class="wrap">

	<?php
	echo wp_kses_post(
		\SureCart::notices()->render(
			[
				'name'  => 'subscription_info',
				'title' => esc_html__( 'What are Subscriptions?', 'surecart' ),
				'text'  => esc_html__( 'This is a list for all your subscription plans. Subscriptions represent recurring payment plans for your users.', 'surecart' ),
			]
		)
	);
	?>

	<?php
	\SureCart::render( 'layouts/partials/admin-index-styles' );
	?>

	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Subscriptions', 'surecart' ),
		]
	);
	?>

	<?php $table->display(); ?>
</div>
