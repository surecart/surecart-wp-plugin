// TODO: Remove this when wp-a11y is treated as a module
// And in SureCart, makde min WP version as 6.7

let previousMessage = '';

/**
 * Filter the message to be announced to the screenreader.
 *
 * @param {string} message The message to be announced.
 *
 * @return {string} The filtered message.
 */
function filterMessage( message ) {
	/*
	 * Strip HTML tags (if any) from the message string. Ideally, messages should
	 * be simple strings, carefully crafted for specific use with A11ySpeak.
	 * When re-using already existing strings this will ensure simple HTML to be
	 * stripped out and replaced with a space. Browsers will collapse multiple
	 * spaces natively.
	 */
	message = message.replace( /<[^<>]+>/g, ' ' );

	/*
	 * Safari + VoiceOver don't announce repeated, identical strings. We use
	 * a `no-break space` to force them to think identical strings are different.
	 */
	if ( previousMessage === message ) {
		message += '\u00A0';
	}

	previousMessage = message;

	return message;
}

/**
 * Clears the a11y-speak-region elements and hides the explanatory text.
 */
function clear() {
	const regions = document.getElementsByClassName( 'a11y-speak-region' );
	const introText = document.getElementById( 'a11y-speak-intro-text' );

	for ( let i = 0; i < regions.length; i++ ) {
		regions[ i ].textContent = '';
	}

	// Make sure the explanatory text is hidden from assistive technologies.
	if ( introText ) {
		introText.setAttribute( 'hidden', 'hidden' );
	}
}

export function speak( message, ariaLive ) {
	/*
	 * Clear previous messages to allow repeated strings being read out and hide
	 * the explanatory text from assistive technologies.
	 */
	clear();

	message = filterMessage( message );

	const introText = document.getElementById( 'a11y-speak-intro-text' );
	const containerAssertive = document.getElementById(
		'a11y-speak-assertive'
	);
	const containerPolite = document.getElementById( 'a11y-speak-polite' );

	if ( containerAssertive && ariaLive === 'assertive' ) {
		containerAssertive.textContent = message;
	} else if ( containerPolite ) {
		containerPolite.textContent = message;
	}

	/*
	 * Make the explanatory text available to assistive technologies by removing
	 * the 'hidden' HTML attribute.
	 */
	if ( introText ) {
		introText.removeAttribute( 'hidden' );
	}
}
