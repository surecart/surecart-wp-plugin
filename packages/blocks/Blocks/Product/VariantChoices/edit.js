/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	useBlockProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	useSetting,
} from '@wordpress/block-editor';
import {
	ScFormControl,
	ScSelect,
	ScPillOption,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	PanelBody,
} from '@wordpress/components';
import useProductPageWarning from '../../../hooks/useProductPageWarning';
import { useRef, useEffect } from '@wordpress/element';

export default ({ attributes, setAttributes }) => {
	const selectColor = useRef();
	const selectSize = useRef();
	const { gap, type } = attributes;
	const blockProps = useBlockProps();
	const spacingProps = useSpacingProps(attributes);
	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || ['%', 'px', 'em', 'rem'],
	});

	const warning = useProductPageWarning();
	if (warning) {
		return <div {...blockProps}>{warning}</div>;
	}

	useEffect(() => {
		if (selectColor.current) {
			selectColor.current.value = 'green';
			selectColor.current.choices = [
				{
					value: 'green',
					label: __('Green', 'surecart'),
				},
				{
					value: 'white',
					label: __('White', 'surecart'),
				},
				{
					value: 'black',
					label: __('Black', 'surecart'),
				},
			];
		}
		if (selectSize.current) {
			selectSize.current.value = 'small';
			selectSize.current.choices = [
				{
					value: 'small',
					label: __('Small', 'surecart'),
				},
				{
					value: 'medium',
					label: __('Medium', 'surecart'),
				},
				{
					value: 'large',
					label: __('Large', 'surecart'),
				},
			];
		}
	}, [selectColor, selectSize, type]);

	return (
		<>
			<div
				{...blockProps}
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap,
					...spacingProps.style,
				}}
			>
				{type === 'dropdown' && (
					<>
						<ScSelect
							ref={selectColor}
							label={__('Color', 'surecart')}
							style={{
								marginBottom:
									'var(--sc-form-row-spacing, 0.75em)',
							}}
						/>
						<ScSelect
							ref={selectSize}
							label={__('Size', 'surecart')}
							style={{
								marginBottom:
									'var(--sc-form-row-spacing, 0.75em)',
							}}
						/>
					</>
				)}
				{type === 'pills' && (
					<>
						<ScFormControl
							label={__('Color', 'surecart')}
							style={{
								marginBottom:
									'var(--sc-form-row-spacing, 0.75em)',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: 'var(--sc-spacing-x-small)',
								}}
							>
								<ScPillOption isSelected>
									{__('Green', 'surecart')}
								</ScPillOption>
								<ScPillOption>
									{__('White', 'surecart')}
								</ScPillOption>
								<ScPillOption>
									{__('Black', 'surecart')}
								</ScPillOption>
							</div>
						</ScFormControl>
						<ScFormControl
							label={__('Size', 'surecart')}
							style={{
								marginBottom:
									'var(--sc-form-row-spacing, 0.75em)',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: 'var(--sc-spacing-x-small)',
								}}
							>
								<ScPillOption isSelected>
									{__('Small', 'surecart')}
								</ScPillOption>
								<ScPillOption>
									{__('Medium', 'surecart')}
								</ScPillOption>
								<ScPillOption>
									{__('Large', 'surecart')}
								</ScPillOption>
							</div>
						</ScFormControl>
					</>
				)}
			</div>
		</>
	);
};
