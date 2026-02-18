<style>
	#wpwrap {
		--sc-color-primary-500: #00824C;
		--sc-focus-ring-color-primary: #00824C;
		--sc-color-primary-text: #fff;
		background: var(--sc-color-brand-main-background);
	}

	/* Prevent flash of unstyled content while web components hydrate. */
	sc-card:not(:defined),
	sc-flex:not(:defined),
	sc-icon:not(:defined),
	sc-heading:not(:defined),
	sc-text:not(:defined),
	sc-button:not(:defined),
	sc-breadcrumbs:not(:defined) {
		opacity: 0;
	}

	sc-card:defined,
	sc-flex:defined,
	sc-icon:defined,
	sc-heading:defined,
	sc-text:defined,
	sc-button:defined,
	sc-breadcrumbs:defined {
		opacity: 1;
		transition: opacity 0.15s ease-in;
	}

	.wrap .import-results-container {
		width: 100%;
		padding-top: 3em;
	}

	.wrap .import-results-container sc-card {
		width: 100%;
		max-width: 700px;
	}

	.import-results-icon {
		font-size: 24px;
		color: var(--sc-color-primary-500);
	}

	.import-results-summary {
		font-size: 14px;
		line-height: 1.6;
	}

	.import-results-summary strong {
		font-weight: 600;
	}

	.import-results-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
		border: 1px solid var(--sc-color-gray-300, #e0e0e0);
	}

	.import-results-table th,
	.import-results-table td {
		text-align: left;
		padding: 8px 12px;
		border: 1px solid var(--sc-color-gray-300, #e0e0e0);
		color: var(--sc-color-gray-700, #555);
	}

	.import-results-table th {
		font-weight: 600;
		background: var(--sc-color-gray-50, #fafafa);
	}

	.import-results-docs-link {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		color: #2563EB;
		text-decoration: none;
		font-size: 14px;
	}

	.import-results-docs-link:hover {
		text-decoration: underline;
	}
</style>

<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>

	<sc-flex justify-content="center" class="import-results-container">
		<sc-card style="--sc-card-padding: var(--sc-spacing-xxx-large)">
			<sc-flex flex-direction="column" style="--sc-flex-column-gap: 1.25em;">
				<sc-icon name="download" class="import-results-icon"></sc-icon>

				<sc-heading size="large"><?php esc_html_e( 'Import Products', 'surecart' ); ?></sc-heading>

				<div class="import-results-summary">
					<?php
					printf(
						/* translators: %s: number of successfully imported products */
						esc_html__( 'You have successfully imported %s products.', 'surecart' ),
						'<strong>' . esc_html( $succeeded_count ) . '</strong>'
					);
					?>

					<?php if ( ! empty( $failed_rows ) ) : ?>
						<br />
						<?php
						printf(
							/* translators: %s: number of failed products */
							esc_html__( '%s products failed to import due to:', 'surecart' ),
							'<strong>' . esc_html( count( $failed_rows ) ) . '</strong>'
						);
						?>
					<?php endif; ?>
				</div>

				<?php if ( ! empty( $failed_rows ) ) : ?>
					<table class="import-results-table">
						<thead>
							<tr>
								<th><?php esc_html_e( 'Product Name', 'surecart' ); ?></th>
								<th><?php esc_html_e( 'Reason', 'surecart' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php foreach ( $failed_rows as $row ) : ?>
								<tr>
									<td><?php echo esc_html( $row['name'] ?? '' ); ?></td>
									<td><?php echo esc_html( $row['reason'] ?? '' ); ?></td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				<?php endif; ?>

				<a href="https://surecart.com/docs" target="_blank" rel="noopener noreferrer" class="import-results-docs-link">
					<?php esc_html_e( 'Go to documentation', 'surecart' ); ?>
					<sc-icon name="external-link" style="font-size: 14px;"></sc-icon>
				</a>

				<div>
					<sc-button href="<?php echo esc_url( \SureCart::getUrl()->index( 'products' ) ); ?>" size="medium" type="primary">
						<?php esc_html_e( 'Show All Products', 'surecart' ); ?>
					</sc-button>
				</div>
			</sc-flex>
		</sc-card>
	</sc-flex>
</div>
