export const getRef = ( { path, docsJSON } ) => {
	while ( path.includes( '#/' ) ) {
		path.replace( '#/', '' ).replaceAll( '/', '.' );
		path.replace( '#/', '' ).replaceAll( '/', '.' );
		path = parsed.split( '.' ).reduce( ( o, i ) => o[ i ], docsJSON );
		if ( path?.allOf?.[ 0 ]?.$ref ) {
			path = path?.allOf?.[ 0 ]?.$ref;
		}
	}
};

export const parseSpec = async ( spec ) => {
	return await new SwaggerClient( { spec } );
};
