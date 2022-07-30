import { ScAlert } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

export default ({ margin = '0', scrollOnOpen = true, type: noticeType }) => {
	const notices = useSelect((select) => select(noticesStore).getNotices());
	const { removeNotice } = useDispatch(noticesStore);
	const errorNotices = notices.filter(
		({ type, status }) => type === 'default' && status === noticeType
	);

	if (!errorNotices?.length) {
		return null;
	}

	const alertType = {
		error: 'danger',
		notice: 'info',
		warning: 'warning',
	};

	return errorNotices.map((notice) => (
		<ScAlert
			open={true}
			type={alertType[noticeType]}
			key={notice?.id}
			closable={notice.isDissmissible}
			scrollOnOpen={scrollOnOpen}
			scrollMargin={margin}
			onScHide={() => removeNotice(notice?.id)}
		>
			<span slot="title">{notice.content}</span>
		</ScAlert>
	));
};
