/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { useRef, useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import Litepicker from 'litepicker';
import 'litepicker/dist/plugins/ranges';

export default ({ startDate, setStartDate, endDate, setEndDate }) => {
	const dateRef = useRef();
	const [inputSize, setInputSize] = useState(25);
	const [datePicker, setDatePicker] = useState();

	useEffect(() => {
		const picker = new Litepicker({
			element: dateRef?.current,
			singleMode: false,
			format: 'MMMM D YYYY',
			autoApply: false,
			plugins: ['ranges'],
			maxDate: new Date(),
			numberOfMonths: 2,
			lang: scData.get_locale,
			buttonText: {
				apply: __('Apply', 'surecart'),
				cancel: __('Cancel', 'surecart'),
			},
			dropdowns: {
				minYear: 1990,
				maxYear: null,
				months: true,
				years: true,
			},
			setup: (picker) => {
				picker.setDateRange(startDate, endDate);
				picker.on('button:apply', (start, end) => {
					setStartDate(start.dateInstance);
					setEndDate(end.dateInstance);
					setInputSize(dateRef.current.value.length);
				});
			},
		});
		setDatePicker(picker);
	}, [dateRef]);

	useEffect(() => {
		if (!datePicker) {
			return;
		}
		datePicker.setDateRange(startDate, endDate);
	}, [startDate, endDate]);

	return (
		<div>
			<Global
				styles={css`
					:root {
						--litepicker-day-color-hover: var(
							--sc-color-primary-500
						);
						--litepicker-is-start-color-bg: var(
							--sc-color-primary-500
						);
						--litepicker-is-end-color-bg: var(
							--sc-color-primary-500
						);
						--litepicker-is-in-range-color: var(
							--sc-color-brand-pastel-green
						);
					}
					.litepicker {
						font-size: 1em;
					}

					.litepicker .container__days > div,
					.litepicker .container__days > a {
						margin-bottom: 5px;
					}

					.litepicker .container__months,
					.litepicker .container__footer,
					.litepicker .container__main .container__predefined-ranges {
						border: 1px solid #e0e0e0;
						-webkit-box-shadow: none;
						box-shadow: none;
						border-radius: 0;
						margin: 0;
					}

					.litepicker .container__main .container__predefined-ranges {
						margin-right: -1px;
						padding: 16px;
						max-width: 125px;
						width: 125px;
						border-radius: 0;
					}

					.litepicker
						.container__main
						.container__predefined-ranges
						> div {
						color: var(--wp-admin-theme-color, #007cba);
					}

					.litepicker
						.container__months
						.month-item-header
						div
						> .month-item-year {
						padding: 0 24px 0 8px;
					}

					.litepicker .container__footer {
						margin-top: -1px;
						padding: 8px;
					}

					.litepicker .container__footer .button-cancel,
					.litepicker .container__footer .button-apply {
						display: -webkit-inline-box;
						display: -ms-inline-flexbox;
						display: inline-flex;
						text-decoration: none;
						font-size: 13px;
						margin: 0;
						border: 0;
						cursor: pointer;
						-webkit-appearance: none;
						background: none;
						-webkit-transition: -webkit-box-shadow 0.1s linear;
						transition: -webkit-box-shadow 0.1s linear;
						-o-transition: box-shadow 0.1s linear;
						transition: box-shadow 0.1s linear;
						transition: box-shadow 0.1s linear,
							-webkit-box-shadow 0.1s linear;
						height: 36px;
						-webkit-box-align: center;
						-ms-flex-align: center;
						align-items: center;
						-webkit-box-sizing: border-box;
						box-sizing: border-box;
						padding: 6px 12px;
						border-radius: 2px;
						color: #1e1e1e;
						white-space: nowrap;
					}

					.litepicker .container__footer .button-apply {
						background: #007cba;
						background: var(--sc-color-primary-500);
						color: #fff;
						text-decoration: none;
						text-shadow: none;
					}

					.surecart-settings__date-select {
						height: 42px;
						border: solid 1px #d3e7ec;
						border-radius: 3.5px;
						font-weight: 400;
						font-size: 16px;
						line-height: 28px;
						width: 250px;
					}
				`}
			/>
			<div className="component-base-control">
				<div className="components-base-control__field">
					<input
						className="components-text-control__input surecart-settings__date-select"
						ref={dateRef}
						size={inputSize}
					/>
				</div>
			</div>
		</div>
	);
};
