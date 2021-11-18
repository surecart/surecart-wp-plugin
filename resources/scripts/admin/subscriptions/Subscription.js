/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import FlashError from '../components/FlashError';
import { CeAlert } from '@checkout-engine/react';

// template
import Template from '../templates/Model';
import useSubscriptionData from './hooks/useSubscriptionData';
import Details from './modules/Details';
import SubscriptionItems from './modules/SubscriptionItems';

export default () => {
	const { subscription, loading, error } = useSubscriptionData();

	const onSubmit = ( values ) => {};
	const onInvalid = ( errors ) => {};

	if ( error?.message ) {
		return (
			<CeAlert
				css={ css`
					margin-top: 20px;
					margin-right: 20px;
				` }
				type="danger"
				open={ error?.message }
				onCeShow={ ( e ) => {
					if ( scrollIntoView ) {
						e.target.scrollIntoView( {
							behavior: 'smooth',
							block: 'start',
							inline: 'nearest',
						} );
					}
				} }
			>
				<span slot="title">
					{ __(
						'There was an error loading this page.',
						'checkout_engine'
					) }
				</span>
				{ error?.message }
			</CeAlert>
		);
	}

	return (
		<Template
			loading={ loading }
			modelName="subscriptions"
			title={ __( 'Edit Subscription', 'checkout_engine' ) }
			back={ {
				url: 'admin.php?page=ce-orders',
				text: __( 'Back to All Subscriptions', 'checkout_engine' ),
			} }
			buttonText={ __( 'Save Subscription', 'checkout_engine' ) }
			onSubmit={ onSubmit }
			onInvalid={ onInvalid }
		>
			<FlashError path="subscriptions" scrollIntoView />
			<Details />
			<SubscriptionItems />
		</Template>
	);
};
