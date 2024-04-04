import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	RangeControl,
	Notice,
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
} from '@wordpress/components';

export default function Settings({
	setAttributes,
	attributes: { columns, limit },
}) {
	return (
		<InspectorControls>
			<PanelBody title={__('Attributes', 'surecart')}>
				<RangeControl
					label={__('Columns', 'surecart')}
					value={columns}
					onChange={(columns) => setAttributes({ columns })}
					min={1}
					max={10}
				/>
				{columns > 6 && (
					<Notice
						status="warning"
						isDismissible={false}
						css={css`
							margin-bottom: 20px;
						`}
					>
						{__(
							'This column count exceeds the recommended amount and may cause visual breakage.'
						)}
					</Notice>
				)}
				<RangeControl
					label={__('Products Per Page', 'surecart')}
					value={limit}
					onChange={(limit) => setAttributes({ limit })}
					step={1}
					min={1}
					max={40}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
