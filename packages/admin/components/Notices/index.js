import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import NoticesList from './NoticesList';

export default () => {
	const notices = useSelect((select) => select(noticesStore).getNotices());

	return (
		<>
			{/* Errors */}
			<NoticesList
				type="error"
				notices={notices.filter(
					({ type, status }) =>
						type === 'default' && status === 'error'
				)}
			/>

			{/* Notices */}
			<NoticesList
				type="info"
				notices={notices.filter(
					({ type, status }) =>
						type === 'default' && status === 'info'
				)}
			/>
		</>
	);
};
