import { translate } from '../util';

export default ({ status }) => {
	switch (status) {
		case 'draft':
		case 'processing':
			return <sc-tag type="info">{translate(status)}</sc-tag>;
		case 'archived':
		case 'pending':
		case 'inactive':
		case 'reviewing':
			return <sc-tag type="warning">{translate(status)}</sc-tag>;
		case 'denied':
			return <sc-tag type="danger">{translate(status)}</sc-tag>;
		case 'approved':
			return <sc-tag type="success">{translate(status)}</sc-tag>;
		default:
			return <sc-tag type="success">{translate('active')}</sc-tag>;
	}
};
