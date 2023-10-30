import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScDialog,
	ScForm,
	ScPillOption,
	ScFormControl,
	ScAlert,
} from '@surecart/components-react';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';
import CopyInput from './CopyInput';
import { useEffect } from '@wordpress/element';

export const getVariantFromValues = ({ variants, values }) => {
	const variantValueKeys = Object.keys(values || {});

	for (const variant of variants) {
		const variantValues = ['option_1', 'option_2', 'option_3']
			.map((option) => variant[option])
			.filter((value) => value !== null && value !== undefined);

		if (
			variantValues?.length === variantValueKeys?.length &&
			variantValueKeys.every((key) => variantValues.includes(values[key]))
		) {
			return variant;
		}
	}
	return null;
};

export default ({ open, price, variants, variantOptions, onRequestClose }) => {
	const [selectedVariant, setSelectedVariant] = useState();
	const [variantValues, setVariantValues] = useState({
		...(variants[0]?.option_1 ? { option_1: variants[0]?.option_1 } : {}),
		...(variants[0]?.option_2 ? { option_2: variants[0]?.option_2 } : {}),
		...(variants[0]?.option_3 ? { option_3: variants[0]?.option_3 } : {}),
	});

	useEffect(() => {
		setSelectedVariant(
			getVariantFromValues({ variants, values: variantValues })
		);
	}, [variantValues]);

	const canCopy = !variants?.length || selectedVariant?.status === 'active';

	return (
		open && (
			<ScDialog
				open={open}
				label={__('Price Details', 'surecart')}
				onScAfterHide={onRequestClose}
			>
				<ScForm style={{ '--sc-form-row-spacing': '1.25em' }}>
					{(variantOptions || [])?.map((option, index) => {
						const optionNumber = index + 1;
						return (
							<div>
								<ScFormControl label={option?.name}>
									<div
										style={{
											display: 'flex',
											flexWrap: 'wrap',
											gap: 'var(--sc-spacing-x-small)',
										}}
									>
										{(option?.values || []).map((value) => {
											return (
												<ScPillOption
													isSelected={
														variantValues[
															`option_${optionNumber}`
														] === value
													}
													onClick={() =>
														setVariantValues({
															...variantValues,
															[`option_${optionNumber}`]:
																value,
														})
													}
												>
													{value}
												</ScPillOption>
											);
										})}
									</div>
								</ScFormControl>
							</div>
						);
					})}
					{canCopy ? (
						<CopyInput
							label={__('Buy Link', 'surecart')}
							text={addQueryArgs(scData?.checkout_page_url, {
								line_items: [
									{
										price_id: price?.id,
										quantity: 1,
										variant_id: selectedVariant?.id,
										no_cart: true,
									},
								],
							})}
						/>
					) : (
						<ScAlert type="warning" open>
							{__(
								'Please select an available option.',
								'surecart'
							)}
						</ScAlert>
					)}

					<CopyInput
						label={__('Price ID', 'surecart')}
						text={price?.id}
					/>
				</ScForm>

				<ScButton
					onClick={() => setCopyDialog(false)}
					type="primary"
					slot="footer"
				>
					{__('Done', 'surecart')}
				</ScButton>
			</ScDialog>
		)
	);
};
