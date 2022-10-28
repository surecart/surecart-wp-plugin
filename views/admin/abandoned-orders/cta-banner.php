<style>
    #wpwrap {
		color: var(--sc-color-brand-body);
		background: var(--sc-color-brand-main-background);
	}

	.wrap {
		display: grid;
		margin: 0px;
	}

	.sc-container {
		margin: auto;
		max-width: 1200px;
		padding: 2rem;
	}

	#wpcontent {
		padding-left: 0px;
	}

	.sc-banner-top-area {
		box-shadow: 0 0 #00000070;
		padding: 10px 0px 0px 50px;
		row-gap: 20px;
		column-gap: 20px;
		overflow: hidden;
		background-color: #fcf2f7;
		position: relative;
		top: -10px;
		border-radius: 20px;
	}

	.sc-banner-top-area img {
		max-width: 600px;
		margin: 0px;
		padding: 0px;
		top: 45px;
		position: relative;
		right: -15px;
		box-shadow: -8px -2px 24px #ccc;
		border-radius: 10px;
	}

	.sc-get-started-top-desc {
		margin-top: 10px;
	}

	.sc-get-started-button{
		margin-top: 20px;
	}

	#sc-settings-header {
		box-sizing: border-box;
		width: 100%;
		position: sticky;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px;
		background: #fff;
		border-bottom: 1px solid var(--sc-color-gray-200);
		height: 66px;
	}
</style>

<div class="wrap">
    <div class="sc-container">
        <div class="sc-section-top-banner">
            <sc-flex class="sc-banner-top-area"  style="--sc-flex-column-gap: 5%" align-items="center">
                <div>
                    <sc-text style="--font-size: var(--sc-font-size-xxx-large); --line-height: 50px; --font-weight: var(--sc-font-weight-bold)">
                        <?php esc_html_e( 'Abanonded Checkouts List', 'surecart' ); ?>
                    </sc-text>
                    <sc-text class="sc-get-started-top-desc" style="--font-size: var(--sc-font-size-x-large); --line-height: var(--sc-line-height-normal)">
                        <?php esc_html_e( 'Get Abandoned Checkouts list full access where can view the checkout cart item details with customers..', 'surecart' ); ?>
                    </sc-text>
                    <sc-button class="sc-get-started-button" type="primary" target="_blank" size="large" href="<?php echo esc_url_raw( 'https://surecart.com/pricing/' ); ?>">
                        <?php esc_html_e( 'Upgrade to Pro', 'surecart' ); ?>
                        <sc-icon name="arrow-right" slot="suffix"></sc-icon>
                    </sc-button>
                </div>
                <div class="sc-banner-top-img-area">
                    <img src="<?php echo esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/abandoned-hero.png' ); ?>" alt="Abandoned-Banner">
                </div>
            </sc-flex>   
        </div>
    </div>
</div>