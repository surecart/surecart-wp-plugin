<?php

namespace SureCart\Integrations\HelpWidget;

/**
 * Help Widget.
 */
class HelpWidget {
	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_footer', [ $this, 'showWidget' ], 999 );
	}

	/**
	 * Is Enabled.
	 *
	 * @return bool
	 */
	public function isEnabled() {
		if ( ! \SureCart::account()->is_connected ) {
			return false;
		}

		return current_user_can( 'manage_options' ) && in_array( get_current_screen()->id, \SureCart::pages()->getSureCartPageScreenIds(), true );
	}

	/**
	 * Get Checklist ID.
	 *
	 * @return string
	 */
	public function getChecklistId() {
		// no charges yet.
		if ( ! \SureCart::account()->has_charges ) {
			return '680fd578155c006aea08424b';
		}

		// has charges.
		return null;
	}

	/**
	 * Render Checklist.
	 *
	 * @return void
	 */
	public function renderChecklist() {
		// not enabled.
		if ( ! $this->isEnabled() ) {
			return;
		}

		// no checklist id.
		$checklist_id = $this->getChecklistId();
		if ( empty( $checklist_id ) ) {
			return;
		}

		?>
			<gleap-checklist checklistid="<?php echo esc_attr( $checklist_id ); ?>" floating="true" sharedKey="<?php echo esc_attr( \SureCart::account()->id ); ?>"></gleap-checklist>
		<?php
	}

	/**
	 * Show Widget script.
	 *
	 * @return void
	 */
	public function showWidget(): void {
		if ( ! $this->isEnabled() ) {
			return;
		}
		?>
		<script>
		!function(Gleap,t,i){if(!(Gleap=window.Gleap=window.Gleap||[]).invoked){for(window.GleapActions=[],Gleap.invoked=!0,Gleap.methods=["identify","setEnvironment","setTags","attachCustomData","setCustomData","removeCustomData","clearCustomData","registerCustomAction","trackEvent","setUseCookies","log","preFillForm","showSurvey","sendSilentCrashReport","startFeedbackFlow","startBot","setAppBuildNumber","setAppVersionCode","setApiUrl","setFrameUrl","isOpened","open","close","on","setLanguage","setOfflineMode","startClassicForm","initialize","disableConsoleLogOverwrite","logEvent","hide","enableShortcuts","showFeedbackButton","destroy","getIdentity","isUserIdentified","clearIdentity","openConversations","openConversation","openHelpCenterCollection","openHelpCenterArticle","openHelpCenter","searchHelpCenter","openNewsArticle","openChecklists","startChecklist","openNews","openFeatureRequests","isLiveMode"],Gleap.f=function(e){return function(){var t=Array.prototype.slice.call(arguments);window.GleapActions.push({e:e,a:t})}},t=0;t<Gleap.methods.length;t++)Gleap[i=Gleap.methods[t]]=Gleap.f(i);Gleap.load=function(){var t=document.getElementsByTagName("head")[0],i=document.createElement("script");i.type="text/javascript",i.async=!0,i.src="https://sdk.gleap.io/latest/index.js",t.appendChild(i)},Gleap.load(),
			Gleap.initialize("0suyWPJ1PjG0zzzBZPBVkCFUoajlj1jS")
		}}();
		</script>
		<?php
	}
}
