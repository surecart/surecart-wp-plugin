/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import ReactCanvasConfetti from 'react-canvas-confetti';

import Layout from './components/Layout';
import ProgressIndicator from './components/ProgressIndicator';
import InitialSetup from './components/InitialSetup';
import ConfirmEmail from './components/ConfirmEmail';
import SetupDone from './components/SetupDone';
import SetupProgress from './components/SetupProgress';
import StarterTemplates from './components/StarterTemplates';

let confettiIntervalId;
let confettiTimerId;
const CONFETTI_DURATION = 5000;

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
	const refAnimationInstance = useRef(null);

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

	function renderContent(step) {
		switch (step) {
			case 0:
				return <InitialSetup handleStepChange={handleStepChange} />;
			case 1:
				return <ConfirmEmail />;
			case 2:
				return <StarterTemplates />;
			case 3:
				return <SetupProgress />;
			case 4:
				return <SetupDone />;
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
			{currentStep !== 4 && (
				<ProgressIndicator
					totalSteps={4}
					currentStep={currentStep}
					onStepChange={handleStepChange}
				/>
			)}
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
		</>
	);
};
