/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { DateTimePicker, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { ScFormatDate, ScButton, ScIcon } from '@surecart/components-react';
import Error from './Error';

export default (props) => {
	const {
		currentDate,
		onChange,
		onChoose,
		onClear = () => {},
		onRequestClose = () => {},
		placeholder,
		title,
		chooseDateLabel,
		clearDateLabel,
		required,
		children,
		visible = false,
		...rest
	} = props;
	const [isVisible, setIsVisible] = useState(visible);
	const [date, setDate] = useState(currentDate);
	const [error, setError] = useState();

	useEffect(() => {
		if (!isVisible) {
			setDate();
			setError();
		}
	}, [isVisible]);
	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};

	const noDateSetOrRequired = !date && !required;

	const onChooseDate = () => {
		if (!date && required) {
			setError({
				message: __('Please choose date to continue.', 'surecart'),
			});
			return;
		}

		// If date is not set and not required, set current date.
		const updatedDate = noDateSetOrRequired ? new Date() : date;

		onChoose(updatedDate);
		toggleVisible();
	};

	const onChangeDate = (date) => {
		setDate(date);
		onChange && onChange(date);
	};

	useEffect(() => {
		setDate(currentDate);
	}, [currentDate]);

	return (
		<div {...props}>
			{children ? (
				<a onClick={toggleVisible}>{children}</a>
			) : (
				<ScButton onClick={toggleVisible}>
					{currentDate ? (
						<ScFormatDate
							date={currentDate}
							month="long"
							day="numeric"
							year="numeric"
						/>
					) : (
						placeholder || __('Select date', 'surecart')
					)}

					<ScIcon
						name={currentDate ? 'edit' : 'plus'}
						slot="suffix"
					/>
				</ScButton>
			)}

			{isVisible && (
				<Modal
					title={title}
					onRequestClose={() => {
						onRequestClose();
						toggleVisible();
					}}
				>
					<Error error={error} />
					<DateTimePicker
						currentDate={date}
						onChange={onChangeDate}
						{...rest}
					/>
					<div
						css={css`
							margin-top: 1em;
							display: flex;
							align-items: center;
							gap: 1em;
						`}
					>
						<ScButton type="primary" onClick={onChooseDate}>
							{chooseDateLabel || __('Choose', 'surecart')}
						</ScButton>
						<ScButton
							onClick={() => {
								onClear();
								toggleVisible();
							}}
						>
							{noDateSetOrRequired
								? __('Cancel', 'surecart')
								: clearDateLabel || __('Clear', 'surecart')}
						</ScButton>
					</div>
				</Modal>
			)}
		</div>
	);
};
