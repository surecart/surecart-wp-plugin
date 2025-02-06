/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScEmpty,
	ScMenuItem,
} from '@surecart/components-react';
import Box from '../../../ui/Box';
import Definition from '../../../ui/Definition';
import CommissionForm from '../../../components/affiliates/commission/CommissionForm';
import Confirm from '../../confirm';

export default function ({
	headerTitle,
	formTitle,
	submitButtonTitle,
	onSubmitMessage,
	emptyCommissionMessage,
	loading,
	commissionStructure,
	modal,
	setModal,
	error,
	onDelete,
	onChange,
	onSubmit,
	...props
}) {
	return (
		<>
			<Box
				title={headerTitle}
				loading={loading}
				header_action={
					commissionStructure?.id ? (
						<ScDropdown
							placement="bottom-end"
							css={css`
								margin: -12px 0px;
							`}
						>
							<ScButton slot="trigger" type="text" circle>
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
								<ScMenuItem onClick={() => setModal('edit')}>
									<ScIcon name="edit" slot="prefix" />
									{__('Edit', 'surecart')}
								</ScMenuItem>
								<ScMenuItem onClick={() => setModal('delete')}>
									<ScIcon name="trash" slot="prefix" />
									{__('Remove', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					) : null
				}
				footer={
					!commissionStructure?.id && (
						<ScButton onClick={() => setModal('create')}>
							<ScIcon name="plus" slot="prefix" />
							{__('Add Commission', 'surecart')}
						</ScButton>
					)
				}
				{...props}
			>
				{commissionStructure?.id ? (
					<>
						<Definition title={__('Commission', 'surecart')}>
							{commissionStructure.commission_amount}
						</Definition>
						<Definition
							title={__(
								'Subscription Commission Duration',
								'surecart'
							)}
						>
							{commissionStructure.subscription_commission || (
								<ScIcon name="x" />
							)}
						</Definition>
						<Definition
							title={__(
								'Lifetime Commission Duration',
								'surecart'
							)}
						>
							{commissionStructure.lifetime_commission || (
								<ScIcon name="x" />
							)}
						</Definition>
					</>
				) : (
					!!emptyCommissionMessage && (
						<ScEmpty icon="percent">
							{emptyCommissionMessage}
						</ScEmpty>
					)
				)}
			</Box>

			<CommissionForm
				title={formTitle}
				submitButtonTitle={submitButtonTitle}
				error={error}
				open={modal === 'create' || modal === 'edit'}
				onRequestClose={() => setModal(false)}
				onSubmit={(e) =>
					onSubmit(e, commissionStructure, onSubmitMessage)
				}
				onChange={onChange}
				affiliationItem={{
					commission_structure: commissionStructure,
				}}
				loading={loading}
			/>

			<Confirm
				open={modal === 'delete'}
				onRequestClose={() => setModal(false)}
				onConfirm={onDelete}
				loading={loading}
				error={error}
			>
				{__('Are you sure? This cannot be undone.', 'surecart')}
			</Confirm>
		</>
	);
}
