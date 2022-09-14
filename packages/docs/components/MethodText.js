import docsJSON from './open-api.json';

export default ({ path, method, text = 'description' }) => {
	return docsJSON?.paths?.['/v1/' + path]?.[method]?.[text] || '';
};
