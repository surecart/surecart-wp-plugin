export default function save({ attributes, context }) {
	const slot = context?.['surecart/slot'] || 'footer';
	const { text, border } = attributes;
	return (
		<sc-button
			slot={`cart-${slot}`}
			class={border ? '' : 'sc-no-border'}
			type="primary"
			full="1"
		>
			{text}
		</sc-button>
	);
}
