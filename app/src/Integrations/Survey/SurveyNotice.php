<?php

namespace SureCart\Integrations\Survey;

/**
 * Nps Survey Notice.
 */
class SurveyNotice {
	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_footer', [ $this, 'showNotice' ], 999 );
	}

	/**
	 * Show Notice script.
	 *
	 * @return void
	 */
	public function showNotice(): void {
		// Load only if has manage_options capability and on SureCart pages.
		if (
			! current_user_can( 'manage_options' )
			|| ! in_array( get_current_screen()->id, \SureCart::pages()->getSureCartPageScreenIds(), true )
		) {
			return;
		}

		?>
		<script src="https://arbex.involve.me/embed?type=popup"></script>
		<script>
			// Create the chat button
			involvemeEmbedPopup.createTriggerEvent({
				projectUrl: "nps-survey",
				organizationUrl: "https://arbex.involve.me",
				embedMode: "chatButton",
				triggerEvent: "button",
				popupSize: "small",
				buttonTextColor: "#FFFFFF",
				buttonColor: "#2679ff",
				icon: "speech-bubble",
			});
		</script>
		<?php
	}
}
