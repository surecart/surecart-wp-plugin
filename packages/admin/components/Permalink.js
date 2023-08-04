/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useRef, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ScInput } from '@surecart/components-react';
import { useEffect } from 'react';

export default ({ baseUrl, name, value, onChange, onCustomized, ...props }) => {
	const [isEditing, seIsEditing] = useState(false);
	const [isEdited, setIsEdited] = useState(false);
	const [customSlug, setCustomSlug] = useState('');
	const input = useRef(null);

	const onStartEditing = () => {
		seIsEditing(true);
		setIsEdited(false);
	};

	useEffect(() => {
		if (isEditing) {
			setTimeout(() => input.current.triggerFocus(), 100);
		}
	}, [isEditing]);

	const onSlugChange = (e) => {
		if (!isEdited) {
			onChange(e.target.value);
		} else {
			changeOnCustomized(true);
			setCustomSlug(e.target.value);
		}
	};

	const changeOnCustomized = (value) => {
		if (typeof onCustomized === 'function') {
			onCustomized(value);
		}
	};

	const onOk = () => {
		try {
			seIsEditing(false);
			setIsEdited(true);
			changeOnCustomized(true);
			setCustomSlug(value);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<strong>{__('Permalink', 'surecart')}: </strong>
			{!isEditing && (
				<>
					<Button
						variant="link"
						isSmall
						onClick={onStartEditing}
						area-label={__('Edit', 'surecart')}
					>
						{baseUrl}/{customSlug || value}
					</Button>
					<Button
						variant="link"
						isSmall
						onClick={onStartEditing}
						area-label={__('Edit', 'surecart')}
					>
						<sc-icon name="edit" size="small" />
					</Button>
				</>
			)}

			{isEditing && (
				<ScInput
					ref={input}
					onInput={onSlugChange}
					value={customSlug || value}
					name={name}
					{...props}
				>
					<span
						slot="prefix"
						css={css`
							opacity: 0.75;
						`}
					>
						{baseUrl}/
					</span>

					<Button
						variant={'primary'}
						isSmall
						onClick={onOk}
						slot="suffix"
					>
						{__('Ok', 'surecart')}
					</Button>
				</ScInput>
			)}
		</div>
	);
};
