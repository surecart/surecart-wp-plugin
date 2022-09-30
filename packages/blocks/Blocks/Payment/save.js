/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export default ({ className, attributes }) => {
	const { label, secure_notice, default_processor } = attributes;

	const hasProcessor = (type) => {
		return scBlockData?.processors.some((p) => p.processor_type === type);
	};

	return (
		<>
			{hasProcessor("stripe") && ! scData.is_ssl &&(
				<sc-alert type="warning" open>
					{__(
						'SSL is required for Stripe Payment.',
						'surecart'
					)}
				</sc-alert>
			)}
			<sc-payment
				class={className}
				label={label}
				default-processor={default_processor}
				secure-notice={secure_notice}
			></sc-payment>
		</>
	);
};
