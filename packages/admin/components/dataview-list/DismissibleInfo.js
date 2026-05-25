/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';
import { Button } from '@wordpress/components';
import { Icon, close } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { PREFERENCES_SCOPE } from './useDataViewState';

// Per-user dismissal — once a user closes the notice it stays closed for them
// across sessions (preferences sync to user meta server-side). Other admins
// still see it on their first visit.
const useDismissed = (id) => {
	const dismissed = useSelect(
		(sel) => !!sel(preferencesStore).get(PREFERENCES_SCOPE, `dismissed:${id}`),
		[id]
	);
	const { set } = useDispatch(preferencesStore);
	const dismiss = () => set(PREFERENCES_SCOPE, `dismissed:${id}`, true);
	return [dismissed, dismiss];
};

export default ({ id, title, children }) => {
	const [dismissed, dismiss] = useDismissed(id);
	if (dismissed) return null;

	return (
		<div
			role="status"
			css={css`
				position: relative;
				margin: 0 0 16px;
				padding: 12px 40px 12px 16px;
				background: #fff;
				border-left: 4px solid var(--wp-admin-theme-color, #3858e9);
				box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
			`}
		>
			{title ? (
				<p
					css={css`
						margin: 0 0 4px;
						font-weight: 600;
					`}
				>
					{title}
				</p>
			) : null}
			<div
				css={css`
					margin: 0;
					color: #50575e;
					font-size: 13px;
				`}
			>
				{children}
			</div>
			<Button
				label={__('Dismiss this notice', 'surecart')}
				onClick={dismiss}
				css={css`
					position: absolute;
					top: 4px;
					right: 4px;
				`}
			>
				<Icon icon={close} size={20} />
			</Button>
		</div>
	);
};
