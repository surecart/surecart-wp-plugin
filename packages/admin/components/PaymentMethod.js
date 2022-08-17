import { ScCcLogo, ScFlex } from '@surecart/components-react';

export default ({ paymentMethod, showExpiration = true, children }) => {
	if (!paymentMethod) return;
	return (
		<ScFlex
			alignItems="center"
			justifyContent="flex-start"
			style={{ gap: '0.5em' }}
		>
			<ScCcLogo
				style={{ fontSize: '36px' }}
				brand={paymentMethod?.card?.brand}
			></ScCcLogo>
			<div>**** {paymentMethod?.card?.last4}</div>
			{showExpiration && (
				<div>
					{paymentMethod?.card?.exp_month}/
					{paymentMethod?.card?.exp_year}
				</div>
			)}
			{children}
		</ScFlex>
	);
};
