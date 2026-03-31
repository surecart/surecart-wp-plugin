import { ColorPicker, Popover, Button } from '@wordpress/components';
import { useState, useEffect, Fragment, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ color, setColor, onFocus }) => {
	const [open, setOpen] = useState(false);
	const [original, setOriginal] = useState(color);
	const swatchRef = useRef();

	useEffect(() => {
		if (open && color) {
			setOriginal(color);
		}
	}, [open]);

	return (
		<Fragment>
			<button
				ref={swatchRef}
				type="button"
				aria-label={__('Select color', 'surecart')}
				style={{
					width: '25px',
					height: '25px',
					borderRadius: '9999px',
					background: color || 'transparent',
					border: '1px solid rgba(0, 0, 0, 0.2)',
					cursor: 'pointer',
					padding: 0,
				}}
				onClick={() => {
					setOpen(!open);
					onFocus && onFocus();
				}}
			/>
			{!!open && (
				<Popover
					anchor={swatchRef.current}
					placement="bottom-start"
					focusOnMount
					onFocusOutside={() => {
						setOpen(false);
					}}
				>
					<ColorPicker
						color={color || ''}
						onChange={(value) => value && setColor({ hex: value })}
						enableAlpha={false}
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
							variant="tertiary"
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
								variant="tertiary"
								onClick={() => {
									setColor({ hex: original });
									setOpen(false);
								}}
							>
								{__('Cancel', 'surecart')}
							</Button>
							<Button
								variant="primary"
								onClick={() => setOpen(false)}
							>
								{__('Apply', 'surecart')}
							</Button>
						</div>
					</div>
				</Popover>
			)}
		</Fragment>
	);
};
