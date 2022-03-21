import { __, _n, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { CeDashboardModule } from '@checkout-engine/components-react';
import { Fragment } from 'react';

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

			<CeDashboardModule {...blockProps}>
				<RichText
					aria-label={__('Title')}
					placeholder={__('Add A Title…')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					slot="heading"
					allowedFormats={['core/bold', 'core/italic']}
				/>

				<ce-button type="link" slot="end">
					<ce-icon name="edit-3" slot="prefix"></ce-icon>
					{__('Update', 'surecart')}
				</ce-button>

				<ce-card no-padding>
					<ce-stacked-list>
						<ce-stacked-list-row style={{ '--columns': '3' }}>
							<div>{__('Display Name', 'surecart')}</div>
							<div>Jane Doe</div>
							<div></div>
						</ce-stacked-list-row>
						<ce-stacked-list-row style={{ '--columns': '3' }}>
							<div>{__('Email Address', 'surecart')}</div>
							<div>customer@email.com</div>
							<div></div>
						</ce-stacked-list-row>
						<ce-stacked-list-row style={{ '--columns': '3' }}>
							<div>{__('First Name', 'surecart')}</div>
							<div>Jane Doe</div>
							<div></div>
						</ce-stacked-list-row>
						<ce-stacked-list-row style={{ '--columns': '3' }}>
							<div>{__('Last Name', 'surecart')}</div>
							<div>Jane Doe</div>
							<div></div>
						</ce-stacked-list-row>
					</ce-stacked-list>
				</ce-card>
			</CeDashboardModule>
		</Fragment>
	);
};
