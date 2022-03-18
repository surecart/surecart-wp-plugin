/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';
import Thumbnail from './Thumbnail';
import { CeButton } from '@checkout-engine/components-react';

export default ({ template, setTemplate }) => {
	return (
		<div
			css={css`
				box-sizing: border-box;
				position: relative;
				min-height: 200px;
				width: 100%;
				text-align: left;
				margin: 0;
				color: #1e1e1e;
				-moz-font-smoothing: subpixel-antialiased;
				-webkit-font-smoothing: subpixel-antialiased;
				border-radius: 2px;
				background-color: #fff;
				border: 1px solid #ddd;
				outline: 1px solid transparent;
			`}
			style={{
				'--ce-color-primary-500': 'var(--wp-admin-theme-color)',
				'--ce-focus-ring-color-primary': 'var(--wp-admin-theme-color)',
				'--ce-input-border-color-focus': 'var(--wp-admin-theme-color)',
			}}
		>
			<div
				css={css`
					width: 100%;
					position: relative;
				`}
			>
				<div
					css={css`
						position: relative;
						min-height: 32rem;
						display: flex;
						max-height: 400px;
					`}
				>
					<div
						css={css`
							display: flex;
							flex-direction: column;
							gap: 2px;
							width: 280px;
							position: absolute;
							top: 32px;
							bottom: 0;
							left: 32px;
							padding: 5px 32px 5px 5px;
							overflow-x: visible;
							overflow-y: scroll;
						`}
					>
						<ce-tab active>Featured</ce-tab>
						<ce-tab>Donation</ce-tab>
					</div>
					<div
						css={css`
							display: grid;
							padding: 32px;
							padding-left: 312px;
							flex: 1 1 0%;
							grid-gap: 32px;
							grid-template-columns: repeat(2, 1fr);
							overflow-y: scroll;
							overflow-x: visible;
						`}
					>
						<Thumbnail label={'Default'} />
						<Thumbnail label={'Simple'} />
						<Thumbnail label={'Sections'} />
						<Thumbnail label={'Two Columns'} />
					</div>
				</div>
				<div
					css={css`
						position: sticky;
						bottom: 0;
						left: 0;
						right: 0;
						border-top: 1px solid #ddd;
						padding: 0 16px;
						display: flex;
						flex-direction: row;
						justify-content: flex-end;
						align-items: center;
						height: 60px;
					`}
				>
					<CeButton type="primary" disabled>
						<ce-icon name="arrow-right" slot="suffix"></ce-icon>
						{__('Next', 'checkout_engine')}
					</CeButton>
				</div>
			</div>
		</div>
	);
};
