import ModelParameter from './ModelParameter';
import docsJSON from './open-api.json';
import { parseSpec } from './utils';
import React from 'react';
import { useState, useEffect } from 'react';

export default ( { path, method } ) => {
	const [ data, setData ] = useState( null );

	useEffect( () => {
		SwaggerClient.resolve( { spec: docsJSON } ).then( ( { spec } ) => {
			setData( spec );
		} );
	}, [] );

	const item = data?.paths?.[ '/api/v1/' + path ]?.[ method ];

	if ( ! item?.parameters?.length ) return '';
	return item.parameters.map( ( parameter ) => {
    if ( ['limit', 'page'].includes(parameter?.name)) return;
		return <ModelParameter parameter={parameter} />;
	} );
};
