import { ScAlert } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

export default ({ margin = '0', scrollOnOpen = true, type: noticeType }) => {
	const notices = useSelect((select) => select(noticesStore).getNotices());
	const { removeNotice } = useDispatch(noticesStore);
	const filteredNotices = notices.filter(
		({ type, status }) => type === 'default' && status === noticeType
	);
	if (!filteredNotices?.length) {
		return null;
	}

	const alertType = {
		error: 'danger',
		notice: 'info',
		warning: 'warning',
	};

	return (
		<ScAlert
			open={true}
			type={alertType[noticeType]}
			closable={true}
			scrollOnOpen={scrollOnOpen}
			scrollMargin={margin}
			onScHide={() => {
				filteredNotices.forEach((notice) => {
					removeNotice(notice?.id);
				});
			}}
		>
			{filteredNotices.map((notice, index) => {
				if (0 === index) {
					return <span slot="title">{notice.content}</span>;
				}
				return notice.content;
			})}
		</ScAlert>
	);
};
