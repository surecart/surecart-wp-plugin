import { CeAlert } from '@checkout-engine/react';

export default ( { error: errorObject, onClose, onShow } ) => {
	return (
		<CeAlert
			type="danger"
			closable
			open={ errorObject?.error?.message }
			onCeShow={ onShow }
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
