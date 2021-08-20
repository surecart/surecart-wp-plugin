const { useRef } = wp.element;
const { SelectControl } = wp.components;
import classNames from 'classnames';

import useValidationErrors from '../hooks/useValidationErrors';
import ValidationErrors from './ValidationErrors';

export default ( props ) => {
	const { attribute, onChange, className, help, ...rest } = props;

	const input = useRef();
	const { clearValidation, hasErrors, errors } = useValidationErrors(
		attribute,
		input
	);

	return (
		<SelectControl
			className={ classNames( hasErrors ? 'is-error' : '', className ) }
			onChange={ ( ...args ) => {
				clearValidation();
				onChange( ...args );
			} }
			help={
				errors?.length ? (
					<div>
						<ValidationErrors errors={ errors } />
						{ help }
					</div>
				) : (
					help
				)
			}
			ref={ input }
			{ ...rest }
		/>
	);
};
