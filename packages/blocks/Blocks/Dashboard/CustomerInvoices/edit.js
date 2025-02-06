import { __, _n } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { ScDashboardModule } from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import OverlayLabel from '../../../components/OverlayLabel';
import { formatDate } from '../../../../admin/util/time';

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
					{__('View all', 'surecart')}
					<sc-icon name="chevron-right" slot="suffix"></sc-icon>
				</sc-button>

				<sc-card no-padding>
					<OverlayLabel>{__('Sample Data', 'surecart')}</OverlayLabel>
					<sc-stacked-list>
						<sc-stacked-list-row
							style={{ '--columns': '4' }}
							mobile-size={500}
						>
							<div>#0001</div>
							<div>
								{formatDate(Date.now())}
							</div>
							<div>
								<sc-tag type="success">
									{__('Paid', 'surecart')}
								</sc-tag>
							</div>
							<div>
								<sc-format-number
									type="currency"
									currency={
										scBlockData?.currency ||
										scData?.currency ||
										'usd'
									}
									value={12300}
								></sc-format-number>
							</div>
						</sc-stacked-list-row>
						<sc-stacked-list-row
							style={{ '--columns': '4' }}
							mobile-size={500}
						>
							<div>#0002</div>
							<div>
								{formatDate(Date.now())}
							</div>
							<div>
								<sc-tag type="info">
									{__('Open', 'surecart')}
								</sc-tag>
							</div>
							<div>
								<sc-format-number
									type="currency"
									currency={
										scBlockData?.currency ||
										scData?.currency ||
										'usd'
									}
									value={45600}
								></sc-format-number>
							</div>
						</sc-stacked-list-row>
					</sc-stacked-list>
				</sc-card>
			</ScDashboardModule>
		</Fragment>
	);
};
