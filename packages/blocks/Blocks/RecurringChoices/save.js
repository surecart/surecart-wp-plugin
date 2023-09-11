export default ({ attributes }) => {
	const { label, amount, currency } = attributes;

	return (
		<sc-recurring-price-choice-container
			label={__('Subscribe and Save', 'surecart')}
			prices={[]}
		/>
	);
};
