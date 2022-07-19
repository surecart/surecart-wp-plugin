/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScFormatBytes,
	ScFormatDate,
	ScStackedListRow,
	ScTableCell,
	ScTableRow,
	ScTag,
} from '@surecart/components-react';

export default ({ media, onClick, selected }) => {
	return (
		<ScTableRow
			onClick={(e) => onClick && onClick(e)}
			style={{
				'--columns': '3',
				cursor: 'pointer',
				zIndex: selected ? '2' : '1',
				outline: selected
					? '2px solid var(--sc-color-primary-500)'
					: 'none',
			}}
		>
			<ScTableCell
				css={css`
					display: flex;
					align-items: flex-start;
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
							align-items: center;
							gap: 0.5em;
						`}
					>
						<ScFormatBytes value={media?.byte_size}></ScFormatBytes>
						{!!media?.release_json?.version && (
							<ScTag
								size="small"
								type="primary"
								style={{
									'--sc-tag-primary-background-color':
										'#f3e8ff',
									'--sc-tag-primary-color': '#6b21a8',
								}}
							>
								v{media?.release_json?.version}
							</ScTag>
						)}
					</div>
				</div>
			</ScTableCell>

			<ScTableCell>
				{media.public_access ? (
					<ScTag type="success">{__('Public', 'surecart')}</ScTag>
				) : (
					<ScTag type="warning">{__('Private', 'surecart')}</ScTag>
				)}
			</ScTableCell>
			<ScTableCell>
				<ScFormatDate
					date={media?.created_at}
					month="short"
					day="numeric"
					year="numeric"
					type="timestamp"
				></ScFormatDate>
			</ScTableCell>
		</ScTableRow>
	);
};
