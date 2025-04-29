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

	.sc-section-heading {
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.sc-section-heading h3 {
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 600;
		color: rgba(17, 24, 39, 1);
		display: flex;
		align-items: center;
		gap: 0.5em;
		color: var(--sc-color-brand-heading);
	}
</style>

<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<div class="sc-container">
		<?php \SureCart::helpWidget()->renderChecklist(); ?>
	</div>
</div>
