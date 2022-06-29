/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScFormatBytes,
	ScFormatDate,
	ScStackedListRow,
	ScTag,
} from '@surecart/components-react';

export default ({ media, onClick, selected }) => {
	return (
		<ScStackedListRow
			href="#"
			onClick={(e) => onClick && onClick(e)}
			style={{
				'--columns': '3',
				zIndex: selected ? '2' : '1',
				outline: selected
					? '2px solid var(--sc-color-primary-500)'
					: 'none',
			}}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 0.75em;
					overflow: hidden;
					min-width: 0;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 1em;
						background: var(--sc-color-gray-200);
						border-radius: var(--sc-border-radius-small);
					`}
				>
					{media?.filename?.split?.('.')?.pop?.()}
				</div>
				<div
					css={css`
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					`}
				>
					<div
						css={css`
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							font-weight: bold;
						`}
					>
						{media.filename}
					</div>
					<div
						css={css`
							display: flex;
							gap: 0.5em;
						`}
					>
						<ScFormatBytes value={media?.byte_size}></ScFormatBytes>
					</div>
				</div>
			</div>

			<div>
				{media.public_access ? (
					<ScTag type="success">{__('Public', 'surecart')}</ScTag>
				) : (
					<ScTag type="warning">{__('Private', 'surecart')}</ScTag>
				)}
			</div>
			<div>
				<ScFormatDate
					date={media?.created_at}
					month="short"
					day="numeric"
					year="numeric"
					type="timestamp"
				></ScFormatDate>
			</div>
		</ScStackedListRow>
	);
};
