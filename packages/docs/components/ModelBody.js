import ModelParameter from './ModelParameter';
import docsJSON from './open-api.json';
import React from 'react';
import { useState, useEffect } from 'react';

export default ({ path, method, model }) => {
	const [data, setData] = useState(null);

	useEffect(() => {
		SwaggerClient.resolve({ spec: docsJSON }).then(({ spec }) => {
			setData(spec);
		});
	}, []);

	const modelSchema =
		data?.paths?.['/v1/' + path]?.[method]?.requestBody?.content?.[
			'application/json'
		]?.schema?.properties?.[model];
	const properties = modelSchema?.properties;
	const required = modelSchema?.required;

	if (!Object.keys(properties || {})?.length) return '';
	return Object.keys(properties).map((key) => {
		const property = {
			...properties[key],
			name: key,
		};
		return (
			<ModelParameter
				parameter={property}
				required={required && required.includes(key)}
			/>
		);
	});
};
