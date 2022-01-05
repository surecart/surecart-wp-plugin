import docsJSON from './open-api.json';

export default ({ path }) => {
	return JSON.stringify(docsJSON.paths?.[path]);
};
