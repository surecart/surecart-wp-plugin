import { ScAlert } from '@surecart/components-react';

export default ({ errors, onHide }) => {
	if (!errors?.[0]?.message) return null;
	return (
		<ScAlert
			type="danger"
			closable
			open={errors?.[0]?.message}
			onScShow={(e) => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}
			onScHide={onHide}
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
		</ScAlert>
	);
};
