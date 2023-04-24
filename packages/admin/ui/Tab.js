import { ScButton } from '@surecart/components-react';

export default ({ selected, children, onClick }) => {
	return (
		<ScButton
			pill
			onClick={onClick}
			style={{
				'--sc-color-primary-500': 'var(--sc-input-color-focus)',
				'--sc-focus-ring-color-primary': 'var(--sc-color-gray-400)',
			}}
			type={selected ? 'default' : 'text'}
		>
			{children}
		</ScButton>
	);
};
