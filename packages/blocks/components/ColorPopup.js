import {
	ColorPicker,
	ColorIndicator,
	Popover,
	Button,
} from '@wordpress/components';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ color, setColor, onFocus }) => {
	const [open, setOpen] = useState(false);
	const [original, setOriginal] = useState(color);

	useEffect(() => {
		if (open && color) {
			setOriginal(color);
		}
	}, [open]);

	return (
		<Fragment>
			<ColorIndicator
				style={{
					width: '25px',
					height: '25px',
					borderRadius: '9999px',
				}}
				colorValue={color}
				onClick={() => {
					setOpen(!open);
					onFocus && onFocus();
				}}
			/>
			{!!open && (
				<Popover
					position="overlay"
					focusOnMount
					onFocusOutside={(e) => {
						setOpen(false);
					}}
				>
					<ColorPicker
						color={color || ''}
						onChangeComplete={(value) =>
							value?.hex && setColor(value)
						}
						disableAlpha
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '10px',
						}}
					>
						<Button
							style={{ margin: '0 5px' }}
							isTertiary
							onClick={() => {
								setColor({ hex: null });
								setOpen(false);
							}}
						>
							{__('Reset', 'surecart')}
						</Button>
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
								padding: '10px',
							}}
						>
							<Button
								style={{ margin: '0 5px' }}
								isTertiary
								onClick={() => {
									setColor({ hex: original });
									setOpen(false);
								}}
							>
								{__('Cancel', 'surecart')}
							</Button>
							<Button isPrimary onClick={() => setOpen(false)}>
								{__('Apply', 'surecart')}
							</Button>
						</div>
					</div>
				</Popover>
			)}
		</Fragment>
	);
};
