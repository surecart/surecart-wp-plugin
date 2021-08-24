const { useRef } = wp.element;
const { TextControl } = wp.components;
import classNames from 'classnames';

import useValidationErrors from '../hooks/useValidationErrors';
import ValidationErrors from './ValidationErrors';

export default ( props ) => {
	const { attribute, onChange, className, help, ...rest } = props;

	const { clearValidation, hasErrors, errors } = useValidationErrors(
		attribute
	);

	return (
		<TextControl
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
			{ ...rest }
		/>
	);
};
