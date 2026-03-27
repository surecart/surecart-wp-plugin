/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import Layout from './components/Layout';
import InitialSetup from './components/InitialSetup';
import ConfirmStoreDetails from './components/ConfirmStoreDetails';
import SetupDone from './components/SetupDone';
import SetupProgress from './components/SetupProgress';
import StarterTemplates from './components/StarterTemplates';
import ConfirmExit from './components/ConfirmExit';
import ConfirmStoreEmail from './components/ConfirmStoreEmail';
import { ScIcon, ScButton } from '@surecart/components-react';
import Connect from './components/Connect';
import ConnectDone from './components/ConnectDone';

let confettiIntervalId;
let confettiTimerId;
const CONFETTI_DURATION = 3000;

function randomInRange(min, max) {
	return Math.random() * (max - min) + min;
}

function getAnimationSettings(originXA, originXB) {
	return {
		startVelocity: 30,
		spread: 360,
		ticks: 60,
		zIndex: 0,
		particleCount: 150,
		origin: {
			x: randomInRange(originXA, originXB),
			y: Math.random() - 0.3,
		},
		colors: ['#054b2e', '#01673d', '#01824c', '#08ba4f', '#1fe26d'],
	};
}

export default () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [accountEmail, setAccountEmail] = useState(scData?.user_email);
	const [accountCurrency, setAccountCurrency] = useState('usd');
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const refAnimationInstance = useRef(null);
	const [brandColor, setBrandColor] = useState('1e40af');
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice } = useDispatch(noticesStore);

	const getInstance = useCallback((instance) => {
		refAnimationInstance.current = instance;
	}, []);

	const nextTickAnimation = useCallback(() => {
		if (refAnimationInstance.current) {
			refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
			setTimeout(() => {
				refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
			}, 300);
		}
	}, []);

	const startAnimation = useCallback(() => {
		confettiIntervalId = setInterval(nextTickAnimation, 500);
	}, [nextTickAnimation]);

	function handleStepChange(dir) {
		if (dir === 'forward' && currentStep < 5)
			setCurrentStep((step) => step + 1);
		if (dir === 'backward' && currentStep > 0)
			setCurrentStep((step) => step - 1);
	}

	const createProvisionalAccount = async (email) => {
		try {
			await saveEntityRecord(
				'surecart',
				'provisional_account',
				{
					account_currency: accountCurrency,
					email,
					seed: !!selectedTemplate,
				},
				{
					throwOnError: true,
				}
			);

			await saveEntityRecord('surecart', 'store', {
				object: 'brand',
				color: brandColor,
			});

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'store'
			);

			if (!selectedTemplate) {
				handleStepChange('forward');
				return;
			}

			// check seed status for up to 1 minute.
			let hasSeeded = false;
			let attempts = 0;
			const maxAttempts = 12; // Example: max 1 minute wait if seeded_at is not set.
			while (!hasSeeded && attempts < maxAttempts) {
				try {
					const { seeded_at } = await apiFetch({
						path: baseURL + '/account',
					});

					if (seeded_at) {
						hasSeeded = true;
					} else {
						// wait 5 seconds.
						await new Promise((resolve) =>
							setTimeout(resolve, 3000)
						);
						attempts++;
					}
				} catch (error) {
					console.error('Error fetching API:', error);
					// Optionally, wait before retrying or break out of the loop
					await new Promise((resolve) => setTimeout(resolve, 3000));
					attempts++;
				}
			}

			if (!hasSeeded) {
				createErrorNotice(
					error?.message ||
						__(
							'Store was created, but seeding of new products failed.',
							'surecart'
						),
					{ type: 'snackbar' }
				);
			}

			handleStepChange('forward');
		} catch (error) {
			createErrorNotice(
				error?.message ||
					__('Failed to create store. Please try again.', 'surecart'),
				{ type: 'snackbar' }
			);
			setCurrentStep(0);
		}
	};

	function renderContent(step) {
		switch (step) {
			case 0:
				return (
					<InitialSetup
						handleStepChange={handleStepChange}
						setCurrentStep={setCurrentStep}
					/>
				);
			case 1:
				return (
					<ConfirmStoreDetails
						currentStep={currentStep}
						handleStepChange={handleStepChange}
						currency={accountCurrency}
						onSelectCurrency={setAccountCurrency}
						brandColor={brandColor}
						onBrandColorChange={setBrandColor}
					/>
				);
			case 2:
				return (
					<StarterTemplates
						currentStep={currentStep}
						handleStepChange={handleStepChange}
						selectedTemplate={selectedTemplate}
						onSelectTemplate={setSelectedTemplate}
					/>
				);
			case 3:
				return (
					<ConfirmStoreEmail
						currentStep={currentStep}
						handleStepChange={handleStepChange}
						email={accountEmail}
						setUserEmail={setAccountEmail}
						onSubmitEmail={createProvisionalAccount}
					/>
				);
			case 4:
				return <SetupProgress />;
			case 5:
				return (
					<SetupDone
						button={
							selectedTemplate === null ? (
								<ScButton
									type="primary"
									size="large"
									href={addQueryArgs('admin.php', {
										page: 'sc-products',
										action: 'edit',
									})}
									css={css`
										min-width: 225px;
									`}
								>
									<ScIcon
										name="shopping-bag"
										slot="prefix"
										style={{ fontSize: '18px' }}
									/>
									{__('Add A Product', 'surecart')}
								</ScButton>
							) : (
								<ScButton
									type="primary"
									size="large"
									href={scData.success_url}
									css={css`
										min-width: 225px;
									`}
								>
									<ScIcon
										name="shopping-bag"
										slot="prefix"
										style={{ fontSize: '18px' }}
									/>
									{__('View My Products', 'surecart')}
								</ScButton>
							)
						}
					/>
				);
			case 6:
				return <Connect setCurrentStep={setCurrentStep} />;
			case 7:
				return (
					<ConnectDone
						button={
							<ScButton
								type="primary"
								size="large"
								href={scData.success_url}
								css={css`
									min-width: 225px;
								`}
							>
								<ScIcon
									name="shopping-bag"
									slot="prefix"
									style={{ fontSize: '18px' }}
								/>
								{__('View My Products', 'surecart')}
							</ScButton>
						}
					/>
				);
			default:
				break;
		}
	}

	useEffect(() => {
		if (![5, 7].includes(currentStep)) return;
		startAnimation();

		confettiTimerId = setTimeout(
			() => clearInterval(confettiIntervalId),
			CONFETTI_DURATION
		);

		() => {
			clearInterval(confettiIntervalId);
			clearTimeout(confettiTimerId);
		};
	}, [currentStep]);

	return (
		<>
			<Layout currentStep={currentStep}>
				{renderContent(currentStep)}
			</Layout>
			<ReactCanvasConfetti
				refConfetti={getInstance}
				style={{
					position: 'fixed',
					pointerEvents: 'none',
					width: '100%',
					height: '100%',
					top: 0,
					left: 0,
				}}
			/>
			{![0, 5, 7].includes(currentStep) && <ConfirmExit />}
		</>
	);
};
