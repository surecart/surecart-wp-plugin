/** @jsx jsx */
import classNames from 'classnames';
import { css, jsx } from '@emotion/core';
import SelectControl from './SelectControl';
const { __experimentalInputControl: InputControl } = wp.components;
import useValidationErrors from '../hooks/useValidationErrors';
import { getCurrencySymbol } from '../util';
import ValidationErrors from './ValidationErrors';

export default ( props ) => {
	const {
		currency,
		currencies,
		attribute,
		currencyAttribute = 'currency',
		value,
		onChange,
		onChangeCurrency,
		className,
		...rest
	} = props;

	const { clearValidation, hasErrors, errors } = useValidationErrors(
		attribute
	);

	return (
		<div>
			<div
				css={ css`
					margin: 1em 0;
					position: relative;
					display: flex;
				` }
			>
				<InputControl
					className={ classNames(
						hasErrors ? 'is-error' : '',
						className
					) }
					css={ css`
						flex: 1;
						margin-right: -2px;
						z-index: 1;
						border-radius: 2px 0 0 2px !important;
					` }
					prefix={
						<div
							css={ css`
								opacity: 0.5;
								margin-left: 8px;
							` }
						>
							{ getCurrencySymbol( currency ) }
						</div>
					}
					className={ className }
					attribute={ attribute }
					type="number"
					min="0.00"
					step="0.001"
					value={ value / 100 || null }
					onChange={ ( value ) => {
						clearValidation();
						onChange( value * 100 );
					} }
					{ ...rest }
				/>
				{ !! currencies && (
					<SelectControl
						attribute={ currencyAttribute }
						value={ currency || 'usd' }
						options={ currencies }
						onChange={ onChangeCurrency }
					/>
				) }
			</div>
			<ValidationErrors errors={ errors } />
		</div>
	);
};
