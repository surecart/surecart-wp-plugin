export default ( { attributes } ) => {
	const { type, full, size, text, show_total, show_icon } = attributes;

	return (
		<ce-button
			submit="1"
			type={ type }
			full={ full ? '1' : false }
			size={ size }
		>
			{ show_icon && (
				<svg
					slot="prefix"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			) }
			{ text }
			{ show_total && (
				<span>
					{ '\u00A0' }
					<ce-total></ce-total>
				</span>
			) }
		</ce-button>
	);
};
