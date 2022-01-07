import docsJSON from './open-api.json';

export default ( { path, method, text = 'description' } ) => {
	return docsJSON?.paths?.[ '/api/v1/' + path ]?.[ method ]?.[ text ];
};
