import { ScChoices, ScPriceChoiceContainer } from '@surecart/components-react';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { label } = attributes;
	const blockProps = useBlockProps({
		label,
	});

	return (
		<div {...blockProps}>
			<ScChoices label={label} required style={{ '--columns': '2' }}>
				<ScPriceChoiceContainer
					label={__('One Time', 'surecart')}
					price={{
						amount: 1900,
						currency: scData?.currency,
					}}
					checked={true}
				/>
				<ScPriceChoiceContainer
					label={__('Subscribe and Save', 'surecart')}
					price={{
						amount: 1900,
						currency: scData?.currency,
					}}
				/>
			</ScChoices>
		</div>
	);
};
