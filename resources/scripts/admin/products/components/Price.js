/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import SelectControl from '../../components/SelectControl';
const { __ } = wp.i18n;
const { useSelect } = wp.data;
const {
	BaseControl,
	Button,
	RadioControl,
	ToggleControl,
	DropdownMenu,
	__experimentalInputControl: InputControl,
} = wp.components;
import TextControl from '../../components/TextControl';
import CurrencyInputControl from '../../components/CurrencyInputControl';

export default ( { price, updatePrice, index } ) => {
	const currencies = Object.keys( ceData.supported_currencies || {} ).map(
		( code ) => {
			return {
				value: code,
				label: ceData.supported_currencies[ code ],
			};
		}
	);

	return (
		<div>
			<BaseControl>
				<div
					css={ css`
						display: flex;
						gap: 1em;
						align-items: center;
					` }
				>
					<TextControl
						css={ css`
							flex: 1;
							margin-top: 8px;
						` }
						label={ __( 'Name', 'checkout_engine' ) }
						className="ce-price-name"
						help={
							<div>
								{ __(
									'A short name for your price (i.e Professional Plan).',
									'checkout_engine'
								) }
							</div>
						}
						attribute="name"
						value={ price?.name }
						onChange={ ( name ) => updatePrice( { name }, index ) }
						required
					/>
					<DropdownMenu
						icon={ 'ellipsis' }
						label="Select a direction"
						controls={ [
							{
								title: 'Archive',
								icon: 'archive',
							},
							{
								title: 'Delete',
								icon: 'trash',
							},
							{
								title: 'Duplicate',
								icon: 'welcome-add-page',
							},
						] }
					/>
				</div>
			</BaseControl>

			<BaseControl
				css={ css`
					margin-top: 10px;
				` }
			>
				<BaseControl.VisualLabel
					css={ css`
						display: block;
					` }
				>
					{ __( 'Pricing', 'checkout_engine' ) }
				</BaseControl.VisualLabel>
				{ /* <ToggleControl
					label={ __( 'Recurring Subscription', 'checkout_engine' ) }
					checked={ price?.recurring }
					onChange={ ( recurring ) => {
						updatePrice( { recurring }, index );
					} }
				/> */ }
				<RadioControl
					css={ css`
						.components-base-control__field {
							display: flex;
							align-items: stretch;
							gap: 1em;
						}
						.components-radio-control__option {
							display: flex;
							flex: 1 1 50%;
							margin-bottom: 4px;
							border: 1px solid #dcdcdc;
							border-radius: 2px;
							padding: 15px;
						}
					` }
					selected={ price?.recurring ? 'recurring' : 'once' }
					options={ [
						{
							label: (
								<span>
									<strong>Single Payment</strong>
									<br />
									Charge a one-time fee.
								</span>
							),
							value: 'once',
						},
						{
							label: (
								<span>
									<strong>Subscription</strong>
									<br />
									Charge an ongoing fee.
								</span>
							),
							value: 'recurring',
						},
					] }
					onChange={ ( value ) => {
						updatePrice(
							{ recurring: value === 'recurring' },
							index
						);
					} }
				/>
			</BaseControl>

			<CurrencyInputControl
				attribute={ 'amount' }
				currency={ price?.currency }
				currencies={ currencies }
				onChangeCurrency={ ( currency ) =>
					updatePrice( { currency }, index )
				}
				value={ price?.amount }
				onChange={ ( amount ) => {
					updatePrice(
						{
							amount,
						},
						index
					);
				} }
			/>

			<div>
				<ToggleControl
					label={ __(
						'Allow customers to pay what they want?',
						'checkout_engine'
					) }
					checked={ price?.ad_hoc }
					onChange={ ( ad_hoc ) => {
						updatePrice( { ad_hoc }, index );
					} }
				/>
			</div>

			{ price?.recurring && (
				<BaseControl>
					<BaseControl.VisualLabel
						css={ css`
							display: block;
						` }
					>
						{ __( 'Repeat Payment Every', 'checkout_engine' ) }
					</BaseControl.VisualLabel>
					<div
						css={ css`
							display: flex;
						` }
					>
						<InputControl
							value={ price?.recurring_interval_count || 1 }
							onChange={ ( recurring_interval_count ) =>
								updatePrice(
									{ recurring_interval_count },
									index
								)
							}
							css={ css`
								flex: 1;
								margin-right: -2px;
								z-index: 1;
								border-radius: 2px 0 0 2px !important;
							` }
						/>
						<SelectControl
							attribute="recurring_interval"
							value={ price?.recurring_interval || 'month' }
							options={ [
								{
									value: 'day',
									label: __( 'Day', 'checkout_engine' ),
								},
								{
									value: 'week',
									label: __( 'Week', 'checkout_engine' ),
								},
								{
									value: 'month',
									label: __( 'Month', 'checkout_engine' ),
								},
								{
									value: 'year',
									label: __( 'Year', 'checkout_engine' ),
								},
							] }
							onChange={ ( recurring_interval ) =>
								updatePrice( { recurring_interval }, index )
							}
							required={ price?.recurring }
						/>
					</div>
				</BaseControl>
			) }
			<BaseControl>
				<Button isSecondary variant="secondary">
					Add Automation
				</Button>
			</BaseControl>
		</div>
	);
};
