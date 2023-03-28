/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { ScFormatDate, ScButton, ScIcon } from '@surecart/components-react';
import { DateTimePicker, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { css, jsx } from '@emotion/core';
import { useEffect } from 'react';
import Error from './Error';

export default (props) => {
	const {
		currentDate,
		onChange,
		onChoose,
		placeholder,
		title,
		chooseDateLabel,
		required,
		children,
		...rest
	} = props;
	const [isVisible, setIsVisible] = useState(false);
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

	const onChooseDate = () => {
		if (!date && required) {
			setError({
				message: __('Please choose date to continue.', 'surecart'),
			});
			return;
		}

		onChoose(date);
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
				<>
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
						{currentDate ? (
							<ScIcon name="edit" slot="suffix" />
						) : (
							<ScIcon name="plus" slot="suffix" />
						)}
					</ScButton>
				</>
			)}

			{isVisible && (
				<Modal title={title} onRequestClose={toggleVisible}>
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
						<ScButton onClick={toggleVisible}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
				</Modal>
			)}
		</div>
	);
};
