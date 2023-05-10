/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import ReactCanvasConfetti from 'react-canvas-confetti';
import apiFetch from '@wordpress/api-fetch';

import Layout from './components/Layout';
import InitialSetup from './components/InitialSetup';
import ConfirmBasicDetails from './components/ConfirmBasicDetails';
import SetupDone from './components/SetupDone';
import SetupProgress from './components/SetupProgress';
import StarterTemplates from './components/StarterTemplates';
import ConfirmExit from './components/ConfirmExit';
import ConnectStore from './components/ConnectStore';

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
	const [showConnect, setShowConnect] = useState(false);
	const [accountEmail, setAccountEmail] = useState('');
	const [accountCurrency, setAccountCurrency] = useState(null);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [currentStep, setCurrentStep] = useState(0);
	const refAnimationInstance = useRef(null);
	const [error, setError] = useState(null);
	const [storeInfo, setStoreInfo] = useState(null);
	const [confirmExit, setConfirmExit] = useState(true);

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
		if (dir === 'forward' && currentStep < 4)
			setCurrentStep((step) => step + 1);
		if (dir === 'backward' && currentStep > 0)
			setCurrentStep((step) => step - 1);
	}

	async function createProvisionalAccount() {
		try {
			const res = await apiFetch({
				method: 'POST',
				path: 'surecart/v1/public/provisional_accounts/',
				data: {
					account_currency: 'eur',
					// account_name: "Ben's Mercantile",
					// account_url: 'https://bartling.io',
					email: accountEmail,
					source_account_id: selectedTemplate,
				},
			});
			setStoreInfo(res);
			handleStepChange('forward');
		} catch (error) {
			setError(error);
		}
	}

	function renderContent(step) {
		switch (step) {
			case 0:
				return (
					<InitialSetup
						handleStepChange={handleStepChange}
						setShowConnect={setShowConnect}
					/>
				);
			case 1:
				return showConnect ? (
					<ConnectStore
						currentStep={currentStep}
						handleStepChange={handleStepChange}
						setConfirmExit={setConfirmExit}
					/>
				) : (
					<ConfirmBasicDetails
						currentStep={currentStep}
						handleStepChange={handleStepChange}
						email={accountEmail}
						onSubmitEmail={setAccountEmail}
					/>
				);
			case 2:
				return (
					<StarterTemplates
						currentStep={currentStep}
						handleStepChange={handleStepChange}
						selectedTemplate={selectedTemplate}
						onSelectTemplate={setSelectedTemplate}
						createAccount={createProvisionalAccount}
					/>
				);
			case 3:
				return <SetupProgress />;
			case 4:
				return <SetupDone claimUrl={storeInfo?.claim_url} />;
			default:
				break;
		}
	}

	useEffect(() => {
		if (currentStep !== 4) return;
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
			<Layout>{renderContent(currentStep)}</Layout>
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
			{confirmExit && <ConfirmExit />}
		</>
	);
};
