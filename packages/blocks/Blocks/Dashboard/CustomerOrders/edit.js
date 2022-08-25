import { __, _n, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	TextControl,
	ToggleControl
} from '@wordpress/components';
import { ScDashboardModule } from '@surecart/components-react';
import { Fragment } from '@wordpress/element';
import OverlayLabel from '../../../components/OverlayLabel';

export default ({ attributes, setAttributes }) => {
	const { per_page, paginate, title } = attributes;
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
							<div>
								<sc-format-date
									date={Date.now() / 1000}
									type="timestamp"
									month="short"
									day="numeric"
									year="numeric"
								></sc-format-date>
							</div>

							<div>
								<sc-text
									truncate
									style={{
										'--color': 'var(--sc-color-gray-500)',
									}}
								>
									{sprintf(
										_n(
											'%s item',
											'%s items',
											1,
											'surecart'
										),
										1
									)}
								</sc-text>
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
							<div>
								<sc-format-date
									date={Date.now() / 1000}
									type="timestamp"
									month="short"
									day="numeric"
									year="numeric"
								></sc-format-date>
							</div>

							<div>
								<sc-text
									truncate
									style={{
										'--color': 'var(--sc-color-gray-500)',
									}}
								>
									{sprintf(
										_n(
											'%s item',
											'%s items',
											1,
											'surecart'
										),
										1
									)}
								</sc-text>
							</div>
							<div>
								<sc-tag type="danger">
									{__('Refunded', 'surecart')}
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
