import ModelParameter from './ModelParameter';
import docsJSON from './open-api.json';
import Translate from '@docusaurus/Translate';
import React from 'react';

export default ({ path, method }) => {
	const item = docsJSON.paths?.['/v1/' + path]?.[method];

	const renderParameters = () => {
		if (!item?.parameters) return;
		return (item.parameters || []).map((parameter) => {
			return (
				<ModelParameter path={parameter.$ref} key={parameter.$ref} />
			);
		});
	};

	return (
		<div>
			<h1>
				<Translate
					id="component.properties"
					description="Properties Title"
				>
					{item.summary}
				</Translate>
			</h1>

			<h2>Where Parameters</h2>
			{renderParameters()}
		</div>
	);
};
