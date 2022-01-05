const { TextControl } = wp.components;

export default ( props ) => {
	const { attribute, onChange, className, help, ...rest } = props;

	return (
		<TextControl
			className={ className }
			onChange={ onChange }
			help={ help }
			{ ...rest }
		/>
	);
};
