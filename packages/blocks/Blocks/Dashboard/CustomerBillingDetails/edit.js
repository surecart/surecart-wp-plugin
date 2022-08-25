import { __, _n, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { ScDashboardModule } from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import OverlayLabel from '../../../components/OverlayLabel';

export default ({ attributes, setAttributes }) => {
	const { title } = attributes;
	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Title', 'surecart')}
							value={title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScDashboardModule {...blockProps}>
				<OverlayLabel>{__('Sample Data', 'surecart')}</OverlayLabel>
				<RichText
					aria-label={__('Title')}
					placeholder={__('Add A Title…')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					slot="heading"
					allowedFormats={['core/bold', 'core/italic']}
				/>

				<sc-button type="link" slot="end">
					<sc-icon name="edit-3" slot="prefix"></sc-icon>
					{__('Update', 'surecart')}
				</sc-button>

				<sc-card no-padding>
					<sc-stacked-list>
						<sc-stacked-list-row style={{ '--columns': '3' }}>
							<div>{__('Billing Name', 'surecart')}</div>
							<div>Jane Doe</div>
							<div></div>
						</sc-stacked-list-row>
						<sc-stacked-list-row style={{ '--columns': '3' }}>
							<div>{__('Billing Email', 'surecart')}</div>
							<div>customer@email.com</div>
							<div></div>
						</sc-stacked-list-row>
						<sc-stacked-list-row style={{ '--columns': '3' }}>
							<div>{__('Shipping Address', 'surecart')}</div>
							<div>
								3606 Neville Street
								<br />
								Terre Haute, Indiana 47802
								<br />
								USA
							</div>
							<div></div>
						</sc-stacked-list-row>
						<sc-stacked-list-row style={{ '--columns': '3' }}>
							<div>{__('Billing Address', 'surecart')}</div>
							<div>
								3606 Neville Street
								<br />
								Terre Haute, Indiana 47802
								<br />
								USA
							</div>
							<div></div>
						</sc-stacked-list-row>
						<sc-stacked-list-row style={{ '--columns': '3' }}>
							<div>{__('Phone', 'surecart')}</div>
							<div>555-867-5309</div>
							<div></div>
						</sc-stacked-list-row>
					</sc-stacked-list>
				</sc-card>
			</ScDashboardModule>
		</Fragment>
	);
};
