export default ( { className, attributes } ) => {
	const {
		firstnameLabel,
		lastnameLabel,
		firstnameHelp,
		lastnameHelp,
	} = attributes;

	return (
		<ce-form-row className={ className }>
			<ce-input
				label={ firstnameLabel }
				name="firstname"
				help={ firstnameHelp }
			></ce-input>
			<ce-input
				label={ lastnameLabel }
				name="lastname"
				help={ lastnameHelp }
			></ce-input>
		</ce-form-row>
	);
};
