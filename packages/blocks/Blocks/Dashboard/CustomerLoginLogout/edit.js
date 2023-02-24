import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const per_page = 10;
	return (
		<div>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<RangeControl
							label={__('Per Page', 'surecart')}
							value={per_page}
							onChange={(per_page) => setAttributes({ per_page })}
							min={1}
							max={30}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div>Test the Login</div>
		</div>
	);
};
