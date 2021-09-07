import { CeAlert } from '@checkout-engine/react';

export default ( { error: errorObject, onClose, onShow, scrollIntoView } ) => {
	return (
		<CeAlert
			type="danger"
			closable
			open={ errorObject?.error?.message }
			onCeShow={ ( e ) => {
				if ( scrollIntoView ) {
					e.target.scrollIntoView( {
						behavior: 'smooth',
						block: 'start',
						inline: 'nearest',
					} );
				}
				onShow( e );
			} }
			onCeHide={ onClose }
		>
			<span slot="title">{ errorObject?.error?.message }</span>
			{ errorObject?.error?.additional_errors?.length && (
				<ul>
					{ ( errorObject?.error?.additional_errors || [] ).map(
						( error, index ) => (
							<ul key={ index }>{ error?.message }</ul>
						)
					) }
				</ul>
			) }
		</CeAlert>
	);
};
