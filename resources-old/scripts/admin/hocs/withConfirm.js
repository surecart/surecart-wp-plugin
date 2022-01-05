/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createHigherOrderComponent } = wp.compose;
const { useState, Fragment } = wp.element;
const { Modal, Button } = wp.components;
import { CeButton } from '@checkout-engine/components-react';

/**
 * Higher order component factory for injecting the editor colors as the
 * `colors` prop in the `withColors` HOC.
 *
 * @return {Function} The higher order component.
 */
export default createHigherOrderComponent( ( OriginalComponent ) => {
	function Component( props, ref ) {
		const [ modal, setModal ] = useState( {
			title: '',
			message: '',
			confirmButtonText: __( 'Okay', 'checkout_engine' ),
			open: false,
			isSaving: false,
			className: 'ce-confirm',
			isDestructive: false,
			onRequestClose: () => {},
			onRequestConfirm: () => {},
		} );

		return (
			<Fragment>
				<OriginalComponent
					confirmModal={ modal }
					setConfirm={ setModal }
					{ ...props }
				/>
				{ !! modal?.open && (
					<Modal
						className={ 'ce-disable-confirm' }
						title={ modal?.title }
						onRequestClose={ modal?.onRequestClose }
					>
						<p>{ modal?.message }</p>
						<CeButton
							type={ modal?.isDestructive ? 'danger' : 'primary' }
							loading={ modal?.isSaving }
							disabled={ modal?.isSaving }
							onClick={ modal?.onRequestConfirm }
						>
							{ modal?.confirmButtonText ||
								__( 'Confirm', 'checkout_engine' ) }
						</CeButton>
						<CeButton type="text" onClick={ modal?.onRequestClose }>
							{ __( 'Cancel', 'checkout_engine' ) }
						</CeButton>
					</Modal>
				) }
			</Fragment>
		);
	}

	let isForwardRef;
	const { render } = OriginalComponent;

	// Returns a forwardRef if OriginalComponent appears to be a forwardRef
	if ( typeof render === 'function' ) {
		isForwardRef = true;
		return forwardRef( Component );
	}

	return Component;
} );
