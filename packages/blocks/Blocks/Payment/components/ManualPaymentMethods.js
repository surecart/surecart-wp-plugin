import ManualPaymentMethod from './ManualPaymentMethod';

export default ({ attributes }) => {
	const methods = scBlockData?.manualPaymentMethods || null;

	if (!methods?.length) {
		return null;
	}

	return methods.map((method) => (
		<ManualPaymentMethod
			method={method}
			key={method?.id}
			attributes={attributes}
		/>
	));
};
