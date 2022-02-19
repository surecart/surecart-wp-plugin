
<style>
	#wpbody-content, #wpcontent {
		padding: 0 !important;
	}
	#wpbody, #wpbody-content, #wpcontent, #wpwrap, body, html {
		height: 100% !important;
		background-color: transparent;
	}
	#sc-settings-container {
		position: absolute;
		top: 0;
		height: 100% !important;
		width: 100% !important;
		left: 0;
		background: white;
	}
	#sc-settings {
		position: absolute;
		top: 0;
		border: 0 none transparent !important;
		padding: 0 !important;
		width: 100% !important;
		left: 0;
		background: white;
	}
</style>


<div id="sc-settings-container">
	<iframe id="sc-settings" src="<?php echo esc_url( $session_url ); ?>" width="100%" height="100%" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
</div>

