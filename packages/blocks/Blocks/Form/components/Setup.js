/** @jsx jsx */
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';

import {
	CeRadioGroup,
	CeRadio,
	CeButton,
} from '@checkout-engine/components-react';
import PriceChoices from '@scripts/blocks/components/PriceChoices';
import { useEffect, useState } from 'react';
import ChooseDesign from './ChooseDesign';
import PlaceholderTemplate from './PlaceholderTemplate';
import SelectPrices from './SelectPrices';

export default ({ onCreate }) => {
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
		return <ChooseDesign template={template} setTemplate={setTemplate} />;
	}

	return (
		<PlaceholderTemplate
			header={__('Products & Behavior', 'checkout-engine')}
			footerRight={
				<CeButton
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
					<ce-icon name="arrow-right" slot="suffix"></ce-icon>
					{__('Create', 'checkout_engine')}
				</CeButton>
			}
			footerLeft={
				<CeButton
					type="default"
					onClick={() => {
						setChoices([]);
						setTemplate('');
					}}
				>
					{__('Back', 'checkout_engine')}
				</CeButton>
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

				<ce-dashboard-module
					heading={__('Thank You Page', 'checkout_engine')}
				>
					<ToggleControl
						label={__('Custom Thank You Page', 'checkout_engine')}
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
				</ce-dashboard-module>
			</div>
		</PlaceholderTemplate>
	);
};
