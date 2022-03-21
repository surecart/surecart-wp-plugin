import { CeAlert } from '@surecart/components-react';
import useValidationErrors from '../hooks/useValidationErrors';

export default ({ onShow, scrollIntoView, path = '', index = 0 }) => {
	const { errors, clearErrors } = useValidationErrors(path, index);

	if (!errors?.[0]?.error?.message) {
		return '';
	}

	return (
		<CeAlert
			type="danger"
			closable
			open={errors?.[0]?.error?.message}
			onCeShow={(e) => {
				if (scrollIntoView) {
					e.target.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
						inline: 'nearest',
					});
				}
				onShow && onShow(e);
			}}
			onCeHide={() => clearErrors(index)}
		>
			<span slot="title">{errors?.[0]?.error?.message}</span>
			{errors?.[0]?.error?.additional_errors?.length && (
				<ul>
					{(errors?.[0]?.error?.additional_errors || []).map(
						(error, index) => (
							<ul key={index}>{error?.message}</ul>
						)
					)}
				</ul>
			)}
		</CeAlert>
	);
};
