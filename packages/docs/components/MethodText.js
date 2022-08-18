import docsJSON from './open-api.json';

export default ({ path, method, text = 'description' }) => {
	console.log(docsJSON);
	return docsJSON?.paths?.['/v1/' + path]?.[method]?.[text] || '';
};
