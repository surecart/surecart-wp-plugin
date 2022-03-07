import { __, _n, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from 'react';
import { CeDashboardModule } from '@checkout-engine/components-react';

export default ({ attributes, setAttributes }) => {
	const { title } = attributes;
	const blockProps = useBlockProps();
	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'checkout_engine')}>
					<PanelRow>
						<TextControl
							label={__('Title', 'checkout_engine')}
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

				<ce-flex slot="end">
					<ce-button type="link">
						<ce-icon name="clock" slot="prefix"></ce-icon>
						{__('Payment History', 'checkout_engine')}
					</ce-button>
					<ce-button type="link">
						<ce-icon name="plus" slot="prefix"></ce-icon>
						{__('Add', 'checkout_engine')}
					</ce-button>
				</ce-flex>

				<ce-card no-padding>
					<ce-stacked-list>
						<ce-stacked-list-row
							style={{ '--columns': '4' }}
							mobile-size={0}
						>
							<ce-flex
								justify-content="flex-start"
								align-items="center"
								style={{ '--spacing': '0.5em' }}
							>
								<ce-cc-logo
									style={{ fontSize: '36px' }}
									brand={'visa'}
								></ce-cc-logo>
								<span
									style={{
										fontSize: '7px',
										whiteSpace: 'nowrap',
									}}
								>
									{'\u2B24'} {'\u2B24'} {'\u2B24'} {'\u2B24'}
								</span>
								<span>1234</span>
							</ce-flex>

							<div>{__('Exp.', 'checkout_engine')} 11/29</div>

							<div>
								<ce-tag type="info">
									{__('Default', 'checkout_engine')}
								</ce-tag>
							</div>

							<div>
								<ce-icon
									name="more-horizontal"
									slot="trigger"
								></ce-icon>
							</div>
						</ce-stacked-list-row>
						<ce-stacked-list-row
							style={{ '--columns': '4' }}
							mobile-size={0}
						>
							<ce-flex
								justify-content="flex-start"
								align-items="center"
								style={{ '--spacing': '0.5em' }}
							>
								<ce-cc-logo
									style={{ fontSize: '36px' }}
									brand={'mastercard'}
								></ce-cc-logo>
								<span
									style={{
										fontSize: '7px',
										whiteSpace: 'nowrap',
									}}
								>
									{'\u2B24'} {'\u2B24'} {'\u2B24'} {'\u2B24'}
								</span>
								<span>1234</span>
							</ce-flex>

							<div>{__('Exp.', 'checkout_engine')} 11/29</div>

							<div></div>

							<div>
								<ce-icon
									name="more-horizontal"
									slot="trigger"
								></ce-icon>
							</div>
						</ce-stacked-list-row>
					</ce-stacked-list>
				</ce-card>
			</CeDashboardModule>
		</Fragment>
	);
};
