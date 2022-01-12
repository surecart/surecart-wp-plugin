/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';

import Template from '../templates/SingleModel';
import FlashError from '../components/FlashError';
import SaveButton from '../components/SaveButton';

// parts
import Sidebar from './Sidebar';

// hooks
import useSnackbar from '../hooks/useSnackbar';
import useCustomerData from './hooks/useCustomerData';

export default () => {
  const { snackbarNotices, removeSnackbarNotice } = useSnackbar();
  const { customer, error, loading, save } = useCustomerData();

  const onSubmit = async ( e ) => {
		e.preventDefault();
		save();
	};

	const onInvalid = () => {
		dispatch( uiStore ).setInvalid( true );
	};

  const title = () => {
		if ( loading ) {
			return (
				<ce-skeleton
					style={ {
						width: '120px',
						display: 'inline-block',
					} }
				></ce-skeleton>
			);
		}

		return customer?.id
			? sprintf(
					__( 'Edit %s', 'checkout_engine' ),
					customer?.name || __( 'Customer', 'checkout_engine' )
			  )
			: sprintf(
					__( 'Add %s', 'checkout_engine' ),
					customer?.name || __( 'Customer', 'checkout_engine' )
			  );
	};

  return (
		<Template
			pageModelName={ 'customers' }
			onSubmit={ onSubmit }
			onInvalid={ onInvalid }
			backUrl={ 'admin.php?page=ce-customers' }
			backText={ __( 'Back to All Customers', 'checkout_engine' ) }
			title={ title() }
			button={
				loading ? (
					<ce-skeleton
						style={ {
							width: '120px',
							height: '35px',
							display: 'inline-block',
						} }
					></ce-skeleton>
				) : (
					<div
						css={ css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						` }
					>
						{ /* <ProductActionsDropdown
							setConfirm={ setConfirm }
							product={ product }
							isSaving={ isSaving }
							toggleArchive={ toggleArchive }
						/> */ }
						<SaveButton>
							{ customer?.id
								? __( 'Update Customer', 'checkout_engine' )
								: __( 'Create Customer', 'checkout_engine' ) }
						</SaveButton>
					</div>
				)
			}
			notices={ snackbarNotices }
			removeNotice={ removeSnackbarNotice }
			sidebar={ <Sidebar /> }
		>
			<Fragment>
			 <FlashError path="customers" scrollIntoView />
				{/*<Name />
				<Codes />
				<Types />
				<Limits /> */}
			</Fragment>
		</Template>
	);
}
