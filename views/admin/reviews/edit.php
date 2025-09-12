<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Edit Review', 'surecart' ),
			'back_link' => add_query_arg( [ 'page' => 'sc-reviews' ], admin_url( 'admin.php' ) ),
		]
	);
	?>

	<sc-spacing style="--spacing: var(--sc-spacing-large)">
		<sc-dashboard-module>
			<sc-card>
				<sc-flex justify-content="space-between" align-items="center">
					<sc-text style="font-weight: var(--sc-font-weight-semibold); font-size: var(--sc-font-size-large)">
						<?php esc_html_e( 'Review Details', 'surecart' ); ?>
					</sc-text>
					<sc-flex>
						<?php if ( 'published' === $review->status ) : ?>
							<sc-button
								type="default"
								size="small"
								href="<?php echo esc_url( wp_nonce_url( add_query_arg( [ 'action' => 'unpublish', 'id' => $review->id ], admin_url( 'admin.php?page=sc-reviews' ) ), 'unpublish_review' ) ); ?>"
							>
								<?php esc_html_e( 'Unpublish', 'surecart' ); ?>
							</sc-button>
						<?php else : ?>
							<sc-button
								type="primary"
								size="small"
								href="<?php echo esc_url( wp_nonce_url( add_query_arg( [ 'action' => 'publish', 'id' => $review->id ], admin_url( 'admin.php?page=sc-reviews' ) ), 'publish_review' ) ); ?>"
							>
								<?php esc_html_e( 'Publish', 'surecart' ); ?>
							</sc-button>
						<?php endif; ?>
						<sc-button
							type="default"
							size="small"
							href="<?php echo esc_url( wp_nonce_url( add_query_arg( [ 'action' => 'delete', 'id' => $review->id ], admin_url( 'admin.php?page=sc-reviews' ) ), 'delete_review' ) ); ?>"
							onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to delete this review?', 'surecart' ); ?>');"
						>
							<?php esc_html_e( 'Delete', 'surecart' ); ?>
						</sc-button>
					</sc-flex>
				</sc-flex>

				<sc-divider style="--spacing: var(--sc-spacing-large)"></sc-divider>

				<sc-form-control label="<?php esc_attr_e( 'Status', 'surecart' ); ?>">
					<sc-tag type="<?php echo 'published' === $review->status ? 'success' : 'warning'; ?>">
						<?php echo esc_html( $review->status_display ); ?>
					</sc-tag>
				</sc-form-control>

				<sc-form-control label="<?php esc_attr_e( 'Rating', 'surecart' ); ?>">
					<sc-rating value="<?php echo esc_attr( $review->stars ); ?>" readonly></sc-rating>
				</sc-form-control>

				<sc-form-control label="<?php esc_attr_e( 'Title', 'surecart' ); ?>">
					<sc-input 
						name="title" 
						value="<?php echo esc_attr( $review->title ); ?>" 
						placeholder="<?php esc_attr_e( 'Review title', 'surecart' ); ?>"
						readonly
					></sc-input>
				</sc-form-control>

				<sc-form-control label="<?php esc_attr_e( 'Review', 'surecart' ); ?>">
					<sc-textarea 
						name="body" 
						value="<?php echo esc_textarea( $review->body ); ?>" 
						placeholder="<?php esc_attr_e( 'Review content', 'surecart' ); ?>"
						rows="5"
						readonly
					></sc-textarea>
				</sc-form-control>

				<sc-form-control label="<?php esc_attr_e( 'Customer', 'surecart' ); ?>">
					<sc-flex align-items="center">
						<?php if ( $review->customer_avatar_url ) : ?>
							<img src="<?php echo esc_url( $review->customer_avatar_url ); ?>" width="32" height="32" style="border-radius: 50%; margin-right: var(--sc-spacing-small);">
						<?php endif; ?>
						<div>
							<div><?php echo esc_html( $review->customer_name ); ?></div>
							<sc-text style="color: var(--sc-color-gray-500); font-size: var(--sc-font-size-small)">
								<?php echo esc_html( $review->customer_email ); ?>
							</sc-text>
						</div>
					</sc-flex>
				</sc-form-control>

				<sc-form-control label="<?php esc_attr_e( 'Product', 'surecart' ); ?>">
					<sc-text><?php echo esc_html( $review->product_name ); ?></sc-text>
				</sc-form-control>

				<?php if ( $review->verified ) : ?>
					<sc-form-control label="<?php esc_attr_e( 'Verification', 'surecart' ); ?>">
						<sc-tag type="info">
							<sc-icon name="check-circle" slot="prefix"></sc-icon>
							<?php esc_html_e( 'Verified Purchase', 'surecart' ); ?>
						</sc-tag>
					</sc-form-control>
				<?php endif; ?>

				<sc-form-control label="<?php esc_attr_e( 'Submitted', 'surecart' ); ?>">
					<sc-text><?php echo esc_html( $review->created_at_date ); ?></sc-text>
				</sc-form-control>
			</sc-card>
		</sc-dashboard-module>
	</sc-spacing>
</div>