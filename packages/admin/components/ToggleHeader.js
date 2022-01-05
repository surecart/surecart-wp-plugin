/** @jsx jsx */
import { css, jsx } from '@emotion/core';
const { __ } = wp.i18n;
import { CeButton } from '@checkout-engine/components-react';

export default ( { isOpen, setIsOpen, children, buttons, type } ) => {
	return (
		<div
			className="ce-toggle-header"
			css={ css`
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px 16px;
				border-radius: 8px;
				border: 1px solid transparent;
				${ type === 'warning'
					? `background-color: var(--ce-color-warning-50);
        border-color: var(--ce-color-warning-200);
        color: var(--ce-color-warning-700);`
					: `background: var( --ce-color-gray-100, #f9fafb )` }
			` }
		>
			<div
				onClick={ () => setIsOpen( ! isOpen ) }
				css={ css`
					cursor: pointer;
					flex: 1;
					user-select: none;
					display: inline-block;
					color: var( --ce-input-label-color );
					font-weight: var( --ce-input-label-font-weight );
					text-transform: var(
						--ce-input-label-text-transform,
						none
					);
					letter-spacing: var( --ce-input-label-letter-spacing, 0 );
				` }
			>
				{ children }
			</div>
			<div
				css={ css`
					display: flex;
					align-items: center;
				` }
			>
				<div
					css={ css`
						display: flex;
						align-items: center;
					` }
				>
					{ buttons }
				</div>
				<CeButton
					type="text"
					circle
					onClick={ () => setIsOpen( ! isOpen ) }
				>
					<svg
						css={ css`
							transition: transform 250ms ease;
							transform: rotate( ${ isOpen ? '180deg' : '0' } );
						` }
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</CeButton>
			</div>
		</div>
	);
};
