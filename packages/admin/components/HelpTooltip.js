/** @jsx jsx */
import { Popover } from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';
import { css, jsx } from '@emotion/react';
/**
 * Help tooltip component that shows help text in a popover.
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Trigger element
 * @param {React.ReactNode} props.content Content to show in popover
 * @param {string} [props.position='bottom right'] Position of the popover
 * @return {React.ReactElement} Help tooltip component
 */
const HelpTooltip = ({
	children,
	content,
	position = 'bottom right',
	slot,
	style = {},
	width = '300px',
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [anchorRef, setAnchorRef] = useState(null);
	const closeTimeout = useRef(null);

	const handleMouseLeave = () => {
		closeTimeout.current = setTimeout(() => {
			setIsVisible(false);
		}, 300);
	};

	const handleMouseEnter = () => {
		if (closeTimeout.current) {
			clearTimeout(closeTimeout.current);
		}
		setIsVisible(true);
	};

	return (
		<>
			<div
				ref={setAnchorRef}
				onClick={() => setIsVisible(!isVisible)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				css={css`
					cursor: pointer;
					padding: 10px;
					margin: -10px;
				`}
				slot={slot}
				style={style}
			>
				{children}
			</div>
			{isVisible && anchorRef && (
				<div
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<Popover
						noArrow={false}
						position={position}
						anchor={anchorRef}
						onClose={() => setIsVisible(false)}
						focusOnMount={false}
						animate={false}
					>
						<div
							css={css`
								min-width: ${width};
								padding: var(--sc-spacing-x-large);
								*:last-child {
									margin-bottom: 0;
								}
							`}
						>
							{content}
						</div>
					</Popover>
				</div>
			)}
		</>
	);
};

export default HelpTooltip;
