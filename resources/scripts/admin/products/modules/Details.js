const { __ } = wp.i18n;
const { BaseControl } = wp.components;

import Box from '../../ui/Box';
import TextControl from '../../components/TextControl';

export default ( { product, updateProduct, loading } ) => {
	return (
		<Box title={ __( 'General', 'checkout_engine' ) } loading={ loading }>
			<div>
				<BaseControl>
					<TextControl
						label={ __( 'Name', 'checkout_engine' ) }
						className="ce-product-name"
						help={
							<div>
								{ __(
									'A short name for your product.',
									'checkout_engine'
								) }
							</div>
						}
						attribute="name"
						value={ product?.name }
						onChange={ ( name ) => updateProduct( { name } ) }
						required
					/>
				</BaseControl>
				<BaseControl>
					<TextControl
						label={ __( 'Description', 'checkout_engine' ) }
						className="ce-product-description"
						help={
							<div>
								{ __(
									'A short description for your product.',
									'checkout_engine'
								) }
							</div>
						}
						attribute="description"
						value={ product?.description }
						onChange={ ( description ) =>
							updateProduct( { description } )
						}
						required
					/>
				</BaseControl>
			</div>
		</Box>
	);
};
