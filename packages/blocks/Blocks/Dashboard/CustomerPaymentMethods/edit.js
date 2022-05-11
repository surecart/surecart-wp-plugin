import { __, _n, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { ScDashboardModule } from '@surecart/components-react';
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
				<RichText
					aria-label={__('Title')}
					placeholder={__('Add A Title…')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					slot="heading"
					allowedFormats={['core/bold', 'core/italic']}
				/>

				<sc-flex slot="end">
					<sc-button type="link">
						<sc-icon name="clock" slot="prefix"></sc-icon>
						{__('Payment History', 'surecart')}
					</sc-button>
					<sc-button type="link">
						<sc-icon name="plus" slot="prefix"></sc-icon>
						{__('Add', 'surecart')}
					</sc-button>
				</sc-flex>

				<sc-card no-padding>
					<OverlayLabel>{__('Sample Data', 'surecart')}</OverlayLabel>
					<sc-stacked-list>
						<sc-stacked-list-row
							style={{ '--columns': '4' }}
							mobile-size={0}
						>
							<sc-flex
								justify-content="flex-start"
								align-items="center"
								style={{ '--spacing': '0.5em' }}
							>
								<sc-cc-logo
									style={{ fontSize: '36px' }}
									brand={'visa'}
								></sc-cc-logo>
								<span
									style={{
										fontSize: '7px',
										whiteSpace: 'nowrap',
									}}
								>
									{'\u2B24'} {'\u2B24'} {'\u2B24'} {'\u2B24'}
								</span>
								<span>1234</span>
							</sc-flex>

							<div>{__('Exp.', 'surecart')} 11/29</div>

							<div>
								<sc-tag type="info">
									{__('Default', 'surecart')}
								</sc-tag>
							</div>

							<div>
								<sc-icon
									name="more-horizontal"
									slot="trigger"
								></sc-icon>
							</div>
						</sc-stacked-list-row>
						<sc-stacked-list-row
							style={{ '--columns': '4' }}
							mobile-size={0}
						>
							<sc-flex
								justify-content="flex-start"
								align-items="center"
								style={{ '--spacing': '0.5em' }}
							>
								<sc-cc-logo
									style={{ fontSize: '36px' }}
									brand={'mastercard'}
								></sc-cc-logo>
								<span
									style={{
										fontSize: '7px',
										whiteSpace: 'nowrap',
									}}
								>
									{'\u2B24'} {'\u2B24'} {'\u2B24'} {'\u2B24'}
								</span>
								<span>1234</span>
							</sc-flex>

							<div>{__('Exp.', 'surecart')} 11/29</div>

							<div></div>

							<div>
								<sc-icon
									name="more-horizontal"
									slot="trigger"
								></sc-icon>
							</div>
						</sc-stacked-list-row>
					</sc-stacked-list>
				</sc-card>
			</ScDashboardModule>
		</Fragment>
	);
};
