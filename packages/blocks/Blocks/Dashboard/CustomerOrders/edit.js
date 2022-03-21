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
	ToggleControl,
} from '@wordpress/components';
import { CeDashboardModule } from '@surecart/components-react';
import { Fragment } from 'react';

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
					{__('View all', 'surecart')}
					<ce-icon name="chevron-right" slot="suffix"></ce-icon>
				</ce-button>

				<ce-card no-padding>
					<ce-stacked-list>
						<ce-stacked-list-row
							style={{ '--columns': '4' }}
							mobile-size={500}
						>
							<div>
								<ce-format-date
									date={Date.now() / 1000}
									type="timestamp"
									month="short"
									day="numeric"
									year="numeric"
								></ce-format-date>
							</div>

							<div>
								<ce-text
									truncate
									style={{
										'--color': 'var(--ce-color-gray-500)',
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
								</ce-text>
							</div>
							<div>
								<ce-tag type="success">
									{__('Paid', 'surecart')}
								</ce-tag>
							</div>
							<div>
								<ce-format-number
									type="currency"
									currency={ceData?.currency || 'usd'}
									value={12300}
								></ce-format-number>
							</div>
						</ce-stacked-list-row>
						<ce-stacked-list-row
							style={{ '--columns': '4' }}
							mobile-size={500}
						>
							<div>
								<ce-format-date
									date={Date.now() / 1000}
									type="timestamp"
									month="short"
									day="numeric"
									year="numeric"
								></ce-format-date>
							</div>

							<div>
								<ce-text
									truncate
									style={{
										'--color': 'var(--ce-color-gray-500)',
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
								</ce-text>
							</div>
							<div>
								<ce-tag type="danger">
									{__('Refunded', 'surecart')}
								</ce-tag>
							</div>
							<div>
								<ce-format-number
									type="currency"
									currency={ceData?.currency || 'usd'}
									value={45600}
								></ce-format-number>
							</div>
						</ce-stacked-list-row>
					</ce-stacked-list>
				</ce-card>
			</CeDashboardModule>
		</Fragment>
	);
};
