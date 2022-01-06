import React from 'react';
import Attribute from './Attribute';

export default ( { parameter, required } ) => {
  return <div>
      <strong>{parameter.name}</strong> <Attribute>{parameter?.schema?.type || parameter?.type}</Attribute> {required && <Attribute required>required</Attribute>}
      <p>{parameter.description}</p>
    </div>;
};
