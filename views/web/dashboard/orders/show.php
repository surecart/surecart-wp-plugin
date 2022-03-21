<ce-breadcrumbs>
	<ce-breadcrumb href="<?php echo esc_url( $back_url ); ?>">Dashboard</ce-breadcrumb>
	<ce-breadcrumb>Order</ce-breadcrumb>
</ce-breadcrumbs>

<ce-card
	style="--spacing: var(--ce-spacing-medium)"
	no-divider
>
	<ce-order-detail
		order-id="<?php echo esc_attr( $id ); ?>"
		style="margin-bottom: 2em;"
	>
		<span slot="title">
			<?php echo __( 'Order Details', 'surecart' ); ?>
			<ce-divider></ce-divider>
		</span>
	</ce-order-detail>
	<?php
		\CheckoutEngine::assets()->addComponentData(
			'ce-order-detail',
			'',
			[
				'query' => $order['query'] ?? [],
			]
		);
		?>

	<ce-charges-list
		id="customer-order-charges-list"
		style="margin-bottom: 2em;"
	>
		<span slot="title">
			<?php echo __( 'Payment', 'surecart' ); ?>
			<ce-divider></ce-divider>
		</span>
		<span slot="empty">
			<ce-alert
				type="info"
				open
			>
			<?php esc_html_e( 'You have not been charged for this order.', 'surecart' ); ?>
			</ce-alert>
		</span>
	</ce-charges-list>
	<?php
		\CheckoutEngine::assets()->addComponentData(
			'ce-charges-list',
			'#customer-order-charges-list',
			[
				'query' => $charges['query'] ?? [],
			]
		);
		?>

	<ce-subscriptions-list id="<?php echo esc_attr( 'list' . $id ); ?>">
		<span slot="title">
			<?php echo __( 'Subscriptions', 'surecart' ); ?>
			<ce-divider></ce-divider>
		</span>
		<span slot="empty"></span>
	</ce-subscriptions-list>
	<?php
		\CheckoutEngine::assets()->addComponentData(
			'ce-subscriptions-list',
			'#list' . $id,
			[
				'query' => $subscriptions['query'] ?? [],
			]
		);
		?>
</ce-card>
