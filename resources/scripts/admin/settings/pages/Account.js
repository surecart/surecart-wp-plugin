const { Card, CardBody, Spinner, TextControl } = wp.components;
const { useSelect, dispatch } = wp.data;

export default () => {
	const { settings, loading } = useSelect( ( select ) => {
		return {
			settings: select( 'checkout-engine/settings' ).getSettings(),
			loading: select( 'checkout-engine/settings' ).isResolving(
				'getSettings'
			),
		};
	} );

	if ( loading ) {
		return <Spinner />;
	}

	return (
		<ce-form-section>
			<span slot="label">Settings</span>
			<span slot="description">Test Description.</span>
			<Card>
				<CardBody>
					<TextControl
						label="Account Name"
						value={ settings?.checkout_engine_account?.name }
						onChange={ ( value ) =>
							dispatch(
								'checkout-engine/settings'
							).updateSetting( { name: value }, 'account' )
						}
					/>
					<TextControl
						label="Currency"
						value={ settings?.checkout_engine_account?.currency }
						onChange={ ( value ) =>
							dispatch(
								'checkout-engine/settings'
							).updateSetting( { currency: value }, 'account' )
						}
					/>
				</CardBody>
			</Card>
		</ce-form-section>
	);
};
