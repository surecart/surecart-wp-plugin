/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { CeButton, CeAlert } from '@checkout-engine/react';
import { useCopyToClipboard } from '@wordpress/compose';

function CopyButton( { text, children } ) {
	const ref = useCopyToClipboard( text );
	return <CeButton ref={ ref }>{ children }</CeButton>;
}

export default class ErrorBoundary extends Component {
	constructor() {
		super( ...arguments );

		this.reboot = this.reboot.bind( this );

		this.state = {
			error: null,
		};
	}

	componentDidCatch( error ) {
		this.setState( { error } );
	}

	reboot() {
		this.props.onError();
	}

	render() {
		const { error } = this.state;

		if ( ! error ) {
			return this.props.children;
		}

		return (
			<div>
				<CeAlert type="danger">
					{ __(
						'The editor has encountered an unexpected error.',
						'checkout_engine'
					) }
					<CeButton key="recovery" onClick={ this.reboot }>
						{ __( 'Attempt Recovery' ) }
					</CeButton>
					<CopyButton key="copy-error" text={ error.stack }>
						{ __( 'Copy Error' ) }
					</CopyButton>
				</CeAlert>
				{ this.props.children }
			</div>
		);
	}
}
