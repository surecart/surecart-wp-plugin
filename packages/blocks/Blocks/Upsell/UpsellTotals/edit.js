export default () => {
	return (
		<sc-summary
			open-text="Totals"
			closed-text="Total"
			collapsible={true}
			collapsed={true}
		>
			<sc-format-number
				slot="price"
				type="currency"
				value="1200"
				currency={scBlockData?.currency || 'usd'}
			></sc-format-number>

			<sc-divider></sc-divider>

			<sc-line-item>
				<span slot="description">Subtotal</span>
				<sc-format-number
					slot="price"
					type="currency"
					value="1000"
					currency={scBlockData?.currency || 'usd'}
				></sc-format-number>
			</sc-line-item>

			<sc-line-item>
				<span slot="description">Tax</span>
				<sc-format-number
					slot="price"
					type="currency"
					value="50"
					currency={scBlockData?.currency || 'usd'}
				></sc-format-number>
			</sc-line-item>

			<sc-divider></sc-divider>

			<sc-line-item
				style={{ '--price-size': 'var(--sc-font-size-x-large)' }}
			>
				<span slot="title">Total</span>
				<sc-format-number
					slot="price"
					type="currency"
					value="1200"
					currency={scBlockData?.currency || 'usd'}
				></sc-format-number>
			</sc-line-item>
		</sc-summary>
	);
};
