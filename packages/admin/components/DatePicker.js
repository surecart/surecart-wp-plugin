/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { CeFormatDate, CeButton } from '@surecart/components-react';
import { Button, Popover, DateTimePicker } from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';
import { css, jsx } from '@emotion/core';
import { useEffect } from 'react';

export default (props) => {
	const {
		currentDate,
		onChange,
		onChoose,
		placeholder,
		popoverTitle,
		...rest
	} = props;
	const [isVisible, setIsVisible] = useState(false);
	const [date, setDate] = useState(currentDate);

	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};

	const onChooseDate = () => {
		onChoose(date);
	};

	const onChangeDate = (date) => {
		setDate(date);
		onChange && onChange(date);
	};

	useEffect(() => {
		setDate(currentDate);
	}, [currentDate]);

	return (
		<div
			css={css`
				display: inline-block;
			`}
		>
			<CeButton onClick={toggleVisible}>
				{currentDate ? (
					<CeFormatDate
						date={currentDate}
						month="long"
						day="numeric"
						year="numeric"
					/>
				) : (
					placeholder || __('Select date', 'surecart')
				)}
			</CeButton>

			{isVisible && (
				<Popover position="bottom">
					{!!popoverTitle && (
						<div
							css={css`
								padding: 1em 1em 0 1em;
							`}
						>
							{popoverTitle}
						</div>
					)}
					<DateTimePicker
						headerTitle={'test'}
						currentDate={date}
						onChange={onChangeDate}
						{...rest}
					/>
					<div
						css={css`
							padding: 0 1em 1em 1em;
							display: flex;
							align-items: center;
							gap: 1em;
						`}
					>
						<CeButton
							type="primary"
							onClick={() => {
								onChooseDate();
								toggleVisible();
							}}
						>
							{__('Choose', 'surecart')}
						</CeButton>
						<CeButton onClick={toggleVisible}>
							{__('Cancel', 'surecart')}
						</CeButton>
					</div>
				</Popover>
			)}
		</div>
	);
};
