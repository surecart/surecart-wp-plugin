import { Fragment } from '@wordpress/element';
import { ScAlert } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
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
		info: 'info',
		success: 'success',
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
			{filteredNotices.map((notice, index) => (
				<Fragment key={notice.id}>
					<p
						style={{
							margin: index === 0 ? 0 : '0.5rem 0 0',
							whiteSpace: 'pre-line',
						}}
					>
						{notice.content}
					</p>
					{notice.actions?.length > 0 && (
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: '0.75rem',
								marginTop: '0.5rem',
							}}
						>
							{notice.actions.map((action, actionIndex) =>
								action.url ? (
									<a
										key={actionIndex}
										href={action.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										{action.label}
									</a>
								) : (
									<button
										key={actionIndex}
										type="button"
										onClick={action.onClick}
										style={{
											background: 'none',
											border: 'none',
											padding: 0,
											cursor: 'pointer',
											textDecoration: 'underline',
											font: 'inherit',
											color: 'inherit',
										}}
									>
										{action.label}
									</button>
								)
							)}
						</div>
					)}
				</Fragment>
			))}
		</ScAlert>
	);
};
