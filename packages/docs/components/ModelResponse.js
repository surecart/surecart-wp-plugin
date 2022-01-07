import docsJSON from './open-api.json';
import React from 'react';
import { useState, useEffect } from 'react';

import ModelParameter from './ModelParameter';

export default ( { path, method, model } ) => {
	const [ data, setData ] = useState( null );

	useEffect( () => {
		SwaggerClient.resolve( { spec: docsJSON } ).then( ( { spec } ) => {
			setData( spec );
		} );
	}, [] );

  const properties = data?.paths?.[ '/api/v1/' + path ]?.[ method ]?.responses?.[200]?.content?.['application/json']?.schema?.properties;

	if ( ! Object.keys(properties || {})?.length ) return '';
	return (Object.keys(properties)).map( ( key ) => {
    const property = {
      ...properties[ key ],
      name: key,
    };
		return <ModelParameter parameter={property} />;
	} );
};
