/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import {
	ScBlockUi,
	ScCard,
	ScFormControl,
	ScStackedList,
	ScSwitch,
} from '@surecart/components-react';

import SingleDownload from './SingleDownload';
import Box from '../../ui/Box';
import MediaLibrary from '../../components/MediaLibrary';
import useSnackbar from '../../hooks/useSnackbar';

export default ({ id, product, updateProduct, loading }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [showArchived, setShowArchived] = useState(false);
	const { addSnackbarNotice } = useSnackbar();
	const { downloads, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'download',
				{ context: 'edit', product_ids: [id], per_page: 100 },
			];
			return {
				downloads: select(coreStore).getEntityRecords(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[id]
	);

	const addDownload = async (media) => {
		try {
			await saveEntityRecord(
				'surecart',
				'download',
				{
					media: media?.id,
					product: product?.id,
					enabled: true,
				},
				{ throwOnError: true }
			);
			addSnackbarNotice({ content: __('Download added.', 'surecart') });
		} catch (e) {
			console.error(e);
		}
	};

	// sort and group.
	const sorted = (downloads || []).sort(
		(a, b) => a.created_at - b.created_at
	);
	const unArchived = (sorted || []).filter((download) => !download.archived);
	const archived = (sorted || []).filter((download) => !!download.archived);

	return (
		<Box title={__('Downloads', 'surecart')} loading={loading}>
			{(() => {
				if (!downloads?.length) return null;
				return (
					<ScCard noPadding>
						<ScStackedList>
							{(unArchived || [])
								.sort((a, b) => a.created_at - b.created_at)
								.map((download) => (
									<SingleDownload
										download={download}
										key={download.id}
										product={product}
										updateProduct={updateProduct}
									/>
								))}

							{showArchived &&
								(archived || [])
									.sort((a, b) => a.created_at - b.created_at)
									.map((download) => (
										<SingleDownload
											css={css`
												--sc-list-row-background-color: var(
													--sc-color-warning-50
												);
											`}
											download={download}
											key={download.id}
										/>
									))}
						</ScStackedList>
					</ScCard>
				);
			})()}

			<div
				css={css`
					display: flex;
					justify-content: space-between;
					align-items: center;
				`}
			>
				<ScFormControl label={__('File', 'surecart')} showLabel={false}>
					<MediaLibrary
						onSelect={addDownload}
						multiple={true}
						render={({ setOpen }) => {
							return (
								<Button isPrimary onClick={() => setOpen(true)}>
									{__('Add Downloads', 'surecart')}
								</Button>
							);
						}}
					></MediaLibrary>
				</ScFormControl>

				{!!archived?.length && (
					<ScSwitch
						class="sc-show-archived"
						checked={showArchived}
						onScChange={(e) => setShowArchived(e.target.checked)}
					>
						{__('Show Archived', 'surecart')}{' '}
						<sc-tag size="small">{archived?.length}</sc-tag>
					</ScSwitch>
				)}
			</div>

			{fetching && <ScBlockUi spinner />}
		</Box>
	);
};
