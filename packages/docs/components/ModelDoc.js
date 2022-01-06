import docsJSON from './open-api.json';
import styles from './styles/styles.module.css';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import React from 'react';
import ModelParameter from './ModelParameter';

export default ( { path, method } ) => {
	const item = docsJSON.paths?.[ path ]?.[ method ];

  const renderParameters = () => {
    if (!item?.parameters) return;
    return (item.parameters || []).map((parameter) => {
      return <ModelParameter path={parameter.$ref} key={parameter.$ref} />;
    });
  }

	return 	(<div>
    <h1>
      <Translate id="component.properties"	description="Properties Title">
			  {item.summary}
			</Translate>
    </h1>

    <h2>Where Parameters</h2>
    {renderParameters()}
  </div>);
};
