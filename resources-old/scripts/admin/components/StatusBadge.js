import { translate } from '../util';

export default ( { status } ) => {
	switch ( status ) {
		case 'draft':
			return <ce-tag type="info">{ translate( status ) }</ce-tag>;
		case 'archived':
			return <ce-tag type="warning">{ translate( status ) }</ce-tag>;
		default:
			return <ce-tag type="success">{ translate( 'active' ) }</ce-tag>;
	}
};
