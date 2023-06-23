/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import {
	ScButton,
	ScCard,
	ScDropdown,
	ScFlex,
	ScForm,
	ScFormControl,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuDivider,
	ScMenuItem,
	ScSkeleton,
} from '@surecart/components-react';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import ModelSelector from '../../components/ModelSelector';
import useAvatar from '../../hooks/useAvatar';
import { store as uiStore } from '../../store/ui';
import { store as coreStore } from '@wordpress/core-data';

export default () => {
	
	const customer = useSelect((select) => select(uiStore).getCustomerForCreateOrder())?.customerForCreateOrder;
	const { setCustomerForCreateOrder } = useDispatch(uiStore);
	const avatarUrl = useAvatar({ email: customer?.email });
	
	return (
		<>
			<ScFormControl
				label={__('Select a Customer', 'surecart')}
				style={{ display: 'block' }}
			>
				{customer?.id ? (
					<ScCard>
						<ScFlex
							alignItems="center"
							justifyContent="space-between"
						>
							<ScFlex
								alignItems="center"
								justifyContent="flex-start"
							>
								<div>
									<img
										src={avatarUrl}
										css={css`
											width: 36px;
											height: 36px;
											border-radius: var(
												--sc-border-radius-medium
											);
										`}
									/>
								</div>
								<div>
									<div>{customer?.name}</div>
									<div>{customer?.email}</div>
								</div>
							</ScFlex>

							<ScDropdown placement="bottom-end">
								<ScButton type="text" slot="trigger" circle>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() => {
											setCustomerForCreateOrder({});
										}}
									>
										<ScIcon
											slot="prefix"
											name="trash"
											style={{
												opacity: 0.5,
											}}
										/>
										{__('Remove', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
						</ScFlex>
					</ScCard>
				) : (
					<ModelSelector
						name="customer"
						placeholder={__('Any Customer', 'surecart')}
						display={(item) =>
							`${!!item?.name ? `${item?.name} - ` : ''}${
								item.email
							}`
						}
						value={customer?.id || customer}
						onSelect={(customer) => {
							const queryArgs = [
								'surecart',
								'customer',
								customer,
								{ expand: ['shipping_address', 'billing_address', 'tax_identifier'] }
							];
							const customerData = select(coreStore).getEntityRecord(...queryArgs);
							console.log(customerData);
							setCustomerForCreateOrder(customerData);
						}}
					/>
				)}
			</ScFormControl>
		</>
	);
};
