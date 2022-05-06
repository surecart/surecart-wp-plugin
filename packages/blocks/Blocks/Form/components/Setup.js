/** @jsx jsx */
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';

import { ScButton } from '@surecart/components-react';
import { useEffect, useState } from '@wordpress/element';
import ChooseDesign from './ChooseDesign';
import PlaceholderTemplate from './PlaceholderTemplate';
import SelectPrices from './SelectPrices';

export default ({ onCreate, templates }) => {
	const [choices, setChoices] = useState([]);
	const [choice_type, setChoiceType] = useState('all');
	const [template, setTemplate] = useState('');
	const [custom_success_url, setCustomSuccessUrl] = useState(false);
	const [success_url, setSuccessUrl] = useState('');
	const [createDisabled, setCreateDisabled] = useState(false);

	useEffect(() => {
		setCreateDisabled(
			['donation', 'invoice'].includes(template) && !choices?.length
		);
	}, [choices, template]);

	if (!template) {
		return (
			<ChooseDesign
				templates={templates}
				template={template}
				setTemplate={setTemplate}
			/>
		);
	}

	return (
		<PlaceholderTemplate
			header={__('Products & Behavior', 'surecart')}
			footerRight={
				<ScButton
					type="primary"
					disabled={createDisabled}
					onClick={() =>
						onCreate({
							choices,
							choice_type,
							template,
							custom_success_url,
							success_url,
						})
					}
				>
					{__('Create', 'surecart')}
				</ScButton>
			}
			footerLeft={
				<ScButton
					type="default"
					onClick={() => {
						setChoices([]);
						setTemplate('');
					}}
				>
					<sc-icon name="arrow-left" slot="prefix"></sc-icon>
					{__('Back', 'surecart')}
				</ScButton>
			}
		>
			<div
				css={css`
					display: grid;
					padding: 32px;
					grid-gap: 32px;
				`}
			>
				<SelectPrices
					template={template}
					choices={choices}
					setChoices={setChoices}
					choice_type={choice_type}
					setChoiceType={setChoiceType}
				/>

				<sc-dashboard-module heading={__('Thank You Page', 'surecart')}>
					<ToggleControl
						label={__('Custom Thank You Page', 'surecart')}
						checked={custom_success_url}
						onChange={(custom_success_url) =>
							setCustomSuccessUrl(custom_success_url)
						}
					/>
					{custom_success_url && (
						<div
							css={css`
								border: 1px solid #ddd;
								box-sizing: border-box;
							`}
						>
							<LinkControl
								value={{ url: success_url }}
								settings={{}}
								shownUnlinkControl={true}
								noURLSuggestion
								showInitialSuggestions
								onChange={(nextValue) => {
									setSuccessUrl(nextValue.url);
								}}
							/>
						</div>
					)}
				</sc-dashboard-module>
			</div>
		</PlaceholderTemplate>
	);
};
