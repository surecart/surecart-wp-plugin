import { translate } from '../util';

const statusTagTypes = {
	draft: 'info',
	processing: 'info',
	archived: 'warning',
	pending: 'warning',
	reviewing: 'warning',
	denied: 'danger',
	inactive: 'danger',
	approved: 'success',
	paid: 'success',
};

export default ({ status }) => {
	const tagType = statusTagTypes[status] || 'success';
	const displayStatus = status || 'active';

	return <sc-tag type={tagType}>{translate(displayStatus)}</sc-tag>;
};
