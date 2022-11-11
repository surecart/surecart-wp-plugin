/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScCard,
	ScFormControl,
	ScIcon,
	ScSelect,
	ScStackedList,
	ScSwitch,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import MediaLibrary from '../../components/MediaLibrary';
import Box from '../../ui/Box';
import SingleDownload from './SingleDownload';

export default ({ id, product, updateProduct, loading }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [showArchived, setShowArchived] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);

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
			createSuccessNotice(__('Download added.', 'surecart'), {
				type: 'snackbar',
			});
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
		<Box
      title={__('Downloads', 'surecart')}
      loading={loading}
      footer={
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
                  <ScButton onClick={() => setOpen(true)}>
                    <ScIcon name="plus" slot="prefix"></ScIcon>
                    {__('Add Downloads', 'surecart')}
                  </ScButton>
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
      }
    >
			{(() => {
				if (!downloads?.length) return null;
				return (
					<>
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
										.sort(
											(a, b) =>
												a.created_at - b.created_at
										)
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
					</>
				);
			})()}

			{fetching && <ScBlockUi spinner />}
		</Box>
	);
};
