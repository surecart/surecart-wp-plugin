<style>
	#wpbody-content, #wpcontent {
		padding: 0 !important;
		font-size: 14px;
		color: var(--sc-color-brand-body);
	}

	#wpfooter {
		display: none;
	}

	#sc-admin-header {
		width: 100%;
		margin-left: 0;
	}

	@media screen and (max-width: 600px) {
		#sc-admin-header {
			padding-top: var(--wp-admin--admin-bar--height, 46px);
		}
	}

	body {
		background: var(--sc-color-brand-main-background);
	}

	.sc-container {
		width: 100%;
	}

	.sc-content {
		margin-left: auto;
		margin-right: auto;
		max-width: var(--sc-settings-content-width, 768px);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: var(--sc-spacing-large);
	}
</style>

<div class="sc-container">
	<div class="sc-content" id="app"></div>
</div>
