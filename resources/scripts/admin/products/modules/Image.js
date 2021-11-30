/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { CeInput, CeFormControl } from '@checkout-engine/react';
import { useState, Fragment } from '@wordpress/element';
import {
	FormFileUpload,
	DropZone,
	Button,
	Spinner,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import Box from '../../ui/Box';

import useProductData from '../hooks/useProductData';
import useValidationErrors from '../../hooks/useValidationErrors';
import { DirectUpload } from '@rails/activestorage';

export default () => {
	const { product, updateProduct, loading } = useProductData();
	const { errors, getValidation } = useValidationErrors( 'products' );
	const [ uploadId, setUploadId ] = useState( null );
	const [ uploading, setUpLoading ] = useState( false );

	const uploadImage = async ( e ) => {
		const file = e.currentTarget.files[ 0 ];
		if ( ! file ) return;
		try {
			setUpLoading( true );

			// first get the unique upload id.
			const { id } = await apiFetch( {
				method: 'POST',
				path: '/checkout-engine/v1/uploads',
			} );

			// then upload the file.
			const directUpload = new DirectUpload(
				file,
				`${ ceData.app_url }uploads/${ id }/presign`
			);

			directUpload.create( ( error, blob ) => {
				if ( error ) {
					// The file failed to upload.
					console.log( error );
				} else {
					// The file has been uploaded, now you can set the upload_id on the corresponding object.
					console.log( blob );
				}
			} );
		} finally {
			setUpLoading( false );
		}
	};

	const renderContent = () => {
		if ( uploading ) {
			return (
				<div
					css={ css`
						display: flex;
						align-items: center;
						justify-content: center;
					` }
				>
					<Spinner />
				</div>
			);
		}

		return (
			<Fragment>
				{ __(
					'Drag and drop an image here or click to select a file.',
					'checkout_engine'
				) }
				<FormFileUpload accept="image/*" onChange={ uploadImage }>
					<Button isPrimary>
						{ __( 'Upload File', 'checkout_engine' ) }
					</Button>
				</FormFileUpload>
				<DropZone onFilesDrop={ uploadImage } />
			</Fragment>
		);
	};

	return (
		<Box
			title={ __( 'Product Image', 'checkout_engine' ) }
			loading={ loading }
		>
			<CeFormControl
				label={ __( 'Product Image', 'checkout_engine' ) }
				showLabel={ false }
			>
				<div
					css={ css`
						position: relative;
						border: 2px dashed var( --ce-color-gray-200 );
						border-radius: var( --ce-border-radius-small );
						padding: 2em;
						display: grid;
						gap: 1em;
						text-align: center;
					` }
				>
					{ renderContent() }
				</div>
			</CeFormControl>
		</Box>
	);
};
