import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls, PanelColorSettings, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { gap, color } = attributes;

  const wrapperStyle = {
    'display': 'inline-flex',
		'column-gap': gap
  };

  const linkStyle = {
    'color': color,
  };

  const units = [
    { value: 'px', label: 'px', default: 25 },
    { value: 'em', label: 'em', default: 2 },
  ];

    // return (
    //     <UnitControl onChange={ setValue } value={ value } units={ units } />
    // );

	return (
		<div>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
            <UnitControl
							label={__('Gap')}
							labelPosition="side"
							value={gap || ''}
							onChange={(nextValue) => {
								nextValue =
									0 > parseFloat(nextValue) ? '0' : nextValue;
								setAttributes({ gap: nextValue });
							}}
							units={units}
						/>
					</PanelRow>
				</PanelBody>
        <PanelColorSettings
          title={__('Color Settings')}
          colorSettings={[
            {
              value: color,
              onChange: (color) =>
                setAttributes({ color }),
              label: __('Color', 'surecart'),
            },
          ]}
        ></PanelColorSettings>
			</InspectorControls>
      <div style={wrapperStyle} className="sc-customer-store-links">
        <a href="#" style={linkStyle}>{ __( 'Terms', 'surecart' ) }</a>
        <a href="#" style={linkStyle}>{ __( 'Privacy Policy', 'surecart' ) }</a>
      </div>
		</div>
	);
};
