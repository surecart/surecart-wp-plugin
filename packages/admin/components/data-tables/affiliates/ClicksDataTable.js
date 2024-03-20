/** @jsx jsx   */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { useCopyToClipboard } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies.
 */
import DataTable from '../../DataTable';
import { ScFormatDate, ScIcon, ScText } from '@surecart/components-react';

export default ({
	data,
	isLoading,
	title,
	error,
	isFetching,
	page,
	setPage,
	pagination,
	columns,
	footer,
	empty,
	...props
}) => {
	const { createSuccessNotice } = useDispatch(noticesStore);

	return (
		<DataTable
			title={title || __('Clicks', 'surecart')}
			columns={columns}
			empty={empty || __('None found.', 'surecart')}
			items={(data || [])
				.sort((a, b) => b.created_at - a.created_at)
				.map(({ created_at, url, referrer }) => {
					const urlRef = useCopyToClipboard(url, () => {
						createSuccessNotice(__('Landing URL Copied to clipboard.', 'surecart'), {
							type: 'snackbar',
						})
					});

					const referrerRef = useCopyToClipboard(referrer, () => {
						createSuccessNotice(__('Referring URL Copied to clipboard.', 'surecart'), {
							type: 'snackbar',
						})
					});

					return {
						url: (
							<ScText
								css={css`
									cursor: pointer;
									word-break: break-word;
									line-break: anywhere;
								`}
								ref={urlRef}
							>
								{!!url && <ScIcon name="copy" />}
								{' '} {url}
							</ScText>
						),
						referrer: (
							<ScText
								css={css`
									cursor: pointer;
									word-break: break-word;
									line-break: anywhere;
								`}
								ref={referrerRef}
							>
								{!!referrer && <ScIcon name="copy" />}
								{' '}{referrer}
							</ScText>
						),
						date: (
							<ScFormatDate
								type="timestamp"
								month="short"
								day="numeric"
								year="numeric"
								date={created_at}
							></ScFormatDate>
						),
					};
				})}
			loading={isLoading}
			updating={isFetching}
			footer={!!footer && footer}
			{...props}
		/>
	);
};
