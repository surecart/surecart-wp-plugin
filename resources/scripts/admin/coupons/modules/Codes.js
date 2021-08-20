const { __ } = wp.i18n;
const { BaseControl } = wp.components;

import Box from '../../ui/Box';
import TextControl from '../../components/TextControl';

export default ( { promotion, updatePromotion, loading } ) => {
	return (
		<Box
			title={ __( 'Discount Code', 'checkout_engine' ) }
			loading={ loading }
		>
			<BaseControl>
				<TextControl
					className="ce-promotion-code"
					value={ promotion?.code }
					className={ 'ce-promotion-code' }
					attribute="code"
					help={ __(
						'Customers will enter this discount code at checkout. Leave this blank and we will generate one for you.',
						'checkout_engine'
					) }
					onChange={ ( code ) => updatePromotion( { code } ) }
				/>
			</BaseControl>
		</Box>
	);
};
