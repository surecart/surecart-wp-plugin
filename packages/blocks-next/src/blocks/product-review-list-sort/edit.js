import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<TextControl
						label={__('Label', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
						help={__(
							'The label shown before the dropdown',
							'surecart'
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{label && <label className="sc-form-label">{label}</label>}
				<div className="">
					<div className="sc-form-check">
						<input
							className="sc-check-input"
							type="checkbox"
							id="newest-first"
						/>
						<label htmlFor="newest-first">
							{__('5 Stars (10)', 'surecart')}
						</label>
					</div>
					<div className="sc-form-check">
						<input
							className="sc-check-input"
							type="checkbox"
							id="oldest-first"
						/>
						<label htmlFor="oldest-first">
							{__('4 Stars (2)', 'surecart')}
						</label>
					</div>
					<div className="sc-form-check">
						<input
							className="sc-check-input"
							type="checkbox"
							id="highest-rated"
						/>
						<label htmlFor="highest-rated">
							{__('3 Stars (1)', 'surecart')}
						</label>
					</div>
					<div className="sc-form-check">
						<input
							className="sc-check-input"
							type="checkbox"
							id="lowest-rated"
						/>
						<label htmlFor="lowest-rated">
							{__('2 Stars (0)', 'surecart')}
						</label>
					</div>
					<div className="sc-form-check">
						<input
							className="sc-check-input"
							type="checkbox"
							id="most-helpful"
						/>
						<label htmlFor="most-helpful">
							{__('1 Star (0)', 'surecart')}
						</label>
					</div>
				</div>
			</div>
		</>
	);
};
