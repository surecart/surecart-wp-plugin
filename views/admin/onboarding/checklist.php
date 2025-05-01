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

	gleap-checklist::part(sender){
		display:none
	}

	gleap-checklist {
		--color-gray-light: var(--sc-color-brand-stroke);
		--color-gray-dark: var(--sc-color-brand-body);
		--color-font-title: var(--sc-color-brand-heading);
		--color-success: var(--sc-color-brand-primary);
		--color-gray-lighter: var(--sc-color-gray-50);
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
