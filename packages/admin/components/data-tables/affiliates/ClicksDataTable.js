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
import { ScIcon, ScText, ScButton } from '@surecart/components-react';

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
				.map(({ created_at_date, url, referrer }) => {
					const urlRef = useCopyToClipboard(url, () => {
						createSuccessNotice(
							__('Copied to clipboard.', 'surecart'),
							{
								type: 'snackbar',
							}
						);
					});

					const referrerRef = useCopyToClipboard(referrer, () => {
						createSuccessNotice(
							__('Copied to clipboard.', 'surecart'),
							{
								type: 'snackbar',
							}
						);
					});

					return {
						url: (
							<div
								css={css`
									display: flex;
									gap: 0.5em;
								`}
							>
								{!!url && (
									<ScButton
										type="text"
										circle
										size="small"
										ref={urlRef}
										css={css`
											flex: 1 0 18px;
											opacity: 0.6;
										`}
									>
										<ScIcon
											css={css`
												font-size: 16px;
											`}
											name="copy"
										/>
									</ScButton>
								)}{' '}
								<ScText
									css={css`
										word-break: break-word;
										line-break: anywhere;
									`}
								>
									{url}
								</ScText>
							</div>
						),
						referrer: (
							<div
								css={css`
									display: flex;
									gap: 0.5em;
								`}
							>
								{!!referrer && (
									<ScButton
										type="text"
										circle
										size="small"
										ref={referrerRef}
										css={css`
											flex: 1 0 18px;
											opacity: 0.6;
										`}
									>
										<ScIcon
											css={css`
												font-size: 16px;
											`}
											name="copy"
										/>
									</ScButton>
								)}{' '}
								<ScText
									css={css`
										word-break: break-word;
										line-break: anywhere;
									`}
								>
									{referrer}
								</ScText>
							</div>
						),
						date: created_at_date,
					};
				})}
			loading={isLoading}
			updating={isFetching}
			footer={!!footer && footer}
			{...props}
		/>
	);
};
