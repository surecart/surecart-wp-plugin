export default ( { path, onSelect } ) => {
	if ( ! path.id ) {
		return (
			<PriceSelector
				value={ value }
				open={ false }
				ad_hoc={ false }
				createNew={ true }
				onSelect={ ( id ) => {
					onSelect( id );
				} }
			/>
		);
	}

	return path.id;
};
