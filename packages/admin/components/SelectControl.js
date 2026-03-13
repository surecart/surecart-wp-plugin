const { useRef } = wp.element;
const { SelectControl } = wp.components;
import classNames from 'classnames';

export default (props) => {
	const { attribute, onChange, className, help, ...rest } = props;

	return (
		<SelectControl
			__next40pxDefaultSize
			className={className}
			onChange={onChange}
			help={help}
			{...rest}
		/>
	);
};
