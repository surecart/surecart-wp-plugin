import { __ } from '@wordpress/i18n';
import { ScFormControl, ScIcon, ScSelect } from '@surecart/components-react';
import HelpTooltip from '../../../components/HelpTooltip';
import { ExternalLink } from '@wordpress/components';

export default function ReplacementBehavior({ upsell, onUpdate }) {
	return (
		<div>
			<ScFormControl label={__('When accepted', 'surecart')}>
				<HelpTooltip
					content={
						<div>
							<p style={{ marginTop: 0 }}>
								<strong>
									{__('Add to the order', 'surecart')}
								</strong>
								<br />
								{__(
									'The upsell is added in addition to the customer’s current order.',
									'surecart'
								)}
							</p>
							<p>
								<strong>
									{__('Replace the entire order', 'surecart')}
								</strong>
								<br />
								{__(
									'The upsell replaces the customer’s entire order, removing all existing items.',
									'surecart'
								)}
							</p>
							<ExternalLink
								href="https://surecart.com/docs/price-boost/"
								target="_blank"
							>
								{__('Learn More', 'surecart')}
							</ExternalLink>
						</div>
					}
					position="top left"
					slot="label-end"
				>
					<ScIcon name="info" style={{ opacity: 0.5 }} />
				</HelpTooltip>
			</ScFormControl>
			<ScSelect
				choices={[
					{
						label: __('Replace the entire order', 'surecart'),
						value: 'all',
					},
					{
						label: __('Add to the order', 'surecart'),
						value: 'none',
					},
				]}
				value={upsell?.replacement_behavior || 'none'}
				help={__(
					'Choose the behavior of accepting this upsell',
					'surecart'
				)}
				onScChange={(e) =>
					onUpdate({
						replacement_behavior: e.target.value,
					})
				}
			/>
		</div>
	);
}
