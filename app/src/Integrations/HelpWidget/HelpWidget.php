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
	public function canView() {
		if ( ! \SureCart::account()->is_connected ) {
			return false;
		};
		return current_user_can( 'manage_options' );
	}

	/**
	 * Has Checklist.
	 *
	 * @return bool
	 */
	public function hasChecklist() {
		// cannot view the widget.
		if ( ! $this->canView() ) {
			return false;
		}

		// has a checklist.
		return \SureCart::account()->has_checklist;
	}

	/**
	 * Render Checklist.
	 *
	 * @return void
	 */
	public function renderChecklist( $args = [] ) {
		if ( ! $this->hasChecklist() ) {
			return;
		}

		// no checklist id.
		$checklist = \SureCart::account()->onboarding_checklist;
		if ( empty( $checklist ) ) {
			return;
		}

		$args = wp_parse_args(
			$args,
			[
				'floating' => false,
				'checklistid' => $checklist['id'],
				'sharedKey' => $checklist['sharedKey'],
			]
		);

		// convert to a string of html attributes.
		$attributes = '';
		foreach ( $args as $key => $value ) {
			if ( is_bool( $value ) ) {
				$value = $value ? 'true' : 'false';
			}
			$attributes .= $key . '="' . esc_attr( $value ) . '" ';
		}

		?>
			<gleap-checklist <?php echo $attributes;?>></gleap-checklist>
		<?php
	}

	/**
	 * Show Widget script.
	 *
	 * @return void
	 */
	public function showWidget(): void {
		if ( ! $this->canView() ) {
			return;
		}
		if ( ! in_array( get_current_screen()->id, \SureCart::pages()->getSureCartPageScreenIds(), true ) ) {
			return;
		}
		?>
		<script>
		!function(Gleap,t,i){if(!(Gleap=window.Gleap=window.Gleap||[]).invoked){for(window.GleapActions=[],Gleap.invoked=!0,Gleap.methods=["identify","setEnvironment","setTags","attachCustomData","setCustomData","removeCustomData","clearCustomData","registerCustomAction","trackEvent","setUseCookies","log","preFillForm","showSurvey","sendSilentCrashReport","startFeedbackFlow","startBot","setAppBuildNumber","setAppVersionCode","setApiUrl","setFrameUrl","isOpened","open","close","on","setLanguage","setOfflineMode","startClassicForm","initialize","disableConsoleLogOverwrite","logEvent","hide","enableShortcuts","showFeedbackButton","destroy","getIdentity","isUserIdentified","clearIdentity","openConversations","openConversation","openHelpCenterCollection","openHelpCenterArticle","openHelpCenter","searchHelpCenter","openNewsArticle","openChecklists","startChecklist","openNews","openFeatureRequests","isLiveMode"],Gleap.f=function(e){return function(){var t=Array.prototype.slice.call(arguments);window.GleapActions.push({e:e,a:t})}},t=0;t<Gleap.methods.length;t++)Gleap[i=Gleap.methods[t]]=Gleap.f(i);Gleap.load=function(){var t=document.getElementsByTagName("head")[0],i=document.createElement("script");i.type="text/javascript",i.async=!0,i.src="https://sdk.gleap.io/latest/index.js",t.appendChild(i)},Gleap.load(),
			Gleap.initialize("0suyWPJ1PjG0zzzBZPBVkCFUoajlj1jS")

		}}();


		Gleap.on("initialized", () => {
			Gleap.setUrlHandler((url) => {
				if ( url.includes('set-up-your-branding') ) {
					location.href = '<?php echo admin_url('admin.php?page=sc-settings&tab=brand'); ?>';
					return;
				}
				if ( url.includes('create-product') ) {
					location.href = '<?php echo admin_url('admin.php?page=sc-products&action=edit'); ?>';
					return;
				}
				if ( url.includes('set-up-your-payment-methods') ) {
					location.href = 'https://app.surecart.com/processor_types?switch_account_id=<?php echo \SureCart::account()->id; ?>';
					return;
				}
				location.href = url;
			});
		});
		</script>
		<?php
	}
}
