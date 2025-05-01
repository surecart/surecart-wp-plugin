<style>
	#wpwrap {
		color: var(--sc-color-brand-body);
		background: var(--sc-color-brand-main-background);
	}


	.wrap {
		display: grid;
		height: calc(100vh - 208px);
	}

	.sc-container {
		margin: auto;
		max-width: 500px;
		width: 100%;
		padding: 2rem;
	}
</style>

<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>

	<?php if ( current_user_can( 'manage_options' ) ) : ?>
		<div class="sc-container">
			<?php \SureCart::helpWidget()->checklist()->render(); ?>
		</div>
	<?php endif; ?>
</div>
