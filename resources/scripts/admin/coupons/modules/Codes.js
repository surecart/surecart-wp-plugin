import { __ } from '@wordpress/i18n';
import { BaseControl } from '@wordpress/components';

import Box from '../../ui/Box';
import { CeInput, CeFormRow } from '@checkout-engine/react';

export default ( { promotion, updatePromotion, loading } ) => {
	return (
		<Box
			title={ __( 'Discount Code', 'checkout_engine' ) }
			loading={ loading }
		>
			<CeInput
				className="ce-promotion-code"
				help={ __(
					'Customers will enter this discount code at checkout. Leave this blank and we will generate one for you.',
					'checkout_engine'
				) }
				attribute="name"
				value={ promotion?.code }
				onCeChange={ ( e ) =>
					updatePromotion( { code: e.target.value } )
				}
			/>
		</Box>
	);
};
