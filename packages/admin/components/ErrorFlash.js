import { CeAlert } from '@surecart/components-react';

export default ({ errors, onHide }) => {
	if (!errors?.[0]?.message) return null;
	return (
		<CeAlert
			type="danger"
			closable
			open={errors?.[0]?.message}
			onCeShow={(e) => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}
			onCeHide={onHide}
		>
			<span slot="title">{errors?.[0]?.message}</span>
			{errors?.[0]?.additional_errors?.length && (
				<ul>
					{(errors?.[0]?.additional_errors || []).map(
						(error, index) => (
							<ul key={index}>{error?.message}</ul>
						)
					)}
				</ul>
			)}
		</CeAlert>
	);
};
