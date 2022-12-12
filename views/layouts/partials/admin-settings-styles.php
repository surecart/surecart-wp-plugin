<style>
	#wpbody-content, #wpcontent {
		padding: 0 !important;
		font-size: 14px;
		color: var(--sc-color-brand-body);
	}
	.sc-item-stick-bottom {
		margin-top: auto;
		padding-top: var(--sc-spacing-large);
	}

	a.surecart-help {
		position: fixed;
		box-shadow: var(--sc-shadow-large);
		display: flex;
		align-items: center;
		font-size: var(--sc-font-size-large);
		gap: 0.5em;
		padding: 0.2em 1.5em;
		bottom: 30px;
		right: 30px;
		background: var(--sc-color-brand-primary);
		text-decoration: none;
		color: white;
		line-height: 50px;
		border-radius: 999px;
		line-height: 50px;
		z-index: 99;
	}

	#wpfooter {
		display:none;
	}
	#wpbody, #wpbody-content, #wpcontent, #wpwrap, body, html {
		height: 100% !important;
		background-color: transparent;
	}
	#sc-settings-container {
		position: absolute;
		top: 0;
		width: 100% !important;
		left: 0;
		background: var(--sc-color-brand-main-background);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	@media screen and (max-width: 600px) {
		#sc-settings-container {
   			margin-top: 46px;
		}
	}

	#sc-settings-content {
		display: flex;
		flex: 1;
	}
	#sc-settings {
		flex: 1;
	}
	#sc-nav {
		background: #fff;
		padding: 20px;
		border-right: 1px solid var(--sc-color-gray-200);
		display: flex;
		flex-direction: column;
		gap: 2px;
		width: 100%;
		max-width: 250px;
		overflow: auto;
	}

	.surecart-cta {
		--sc-card-border-color: var(--sc-color-primary-500);
	}
	.sc-container {
		width: 100%;
		overflow-y: auto;
	}

	.sc-content {
		margin-left: auto;
		margin-right: auto;
		max-width: 768px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: var(--sc-spacing-large);
	}

	/* .sc-container {
		margin-left: auto;
		margin-right: auto;
		max-width: 768px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: var(--sc-spacing-large);
	} */

	.sc-section-heading {
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid rgba(229, 231, 235, 1);
		padding-bottom: 1rem;
	}

	.sc-section-heading h3 {
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1rem;
		line-height: 1.75rem;
		font-weight: 600;
		color: rgba(17, 24, 39, 1);
		display: flex;
		align-items: center;
		gap: 0.5em;
		color: var(--sc-color-gray-900);
	}

	.sc-section-heading sc-icon {
		font-size: 1.3rem;
	}

	sc-icon {
		width: 18px;
		height: 18px;
	}

	sc-tab, sc-icon, sc-breadcrumbs, sc-breadcrumb, sc-button, sc-card, sc-tag, sc-dashboard-module, sc-form {
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}
	sc-tab.hydrated,
	sc-icon.hydrated,
	sc-breadcrumbs.hydrated,
	sc-breadcrumb.hydrated,
	sc-button.hydrated,
	sc-card.hydrated,
	sc-tag.hydrated,
	sc-dashboard-module.hydrated,
	sc-form.hydrated {
		visibility: inherit;
		opacity: 1;
	}
</style>
