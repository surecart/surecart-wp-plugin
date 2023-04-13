/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import Confetti from 'react-confetti';
import Layout from './components/Layout';
import ProgressIndicator from './components/ProgressIndicator';
import InitialSetup from './components/InitialSetup';
import ConfirmEmail from './components/ConfirmEmail';
import SetupDone from './components/SetupDone';
import SetupProgress from './components/SetupProgress';
import StarterTemplates from './components/StarterTemplates';

export default () => {
	const [currentStep, setCurrentStep] = useState(0);

	function handleStepChange(dir) {
		if (dir === 'forward' && currentStep < 4) {
			setCurrentStep((step) => step + 1);
		}
		if (dir === 'backward' && currentStep > 0) {
			setCurrentStep((step) => step - 1);
		}
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

	return (
		<div>
			<Confetti
				run={currentStep === 4}
				numberOfPieces={160}
				colors={['#01824c', '#08BA4F']}
			/>
			<Layout>{renderContent(currentStep)}</Layout>
			{currentStep !== 4 && (
				<ProgressIndicator
					totalSteps={4}
					currentStep={currentStep}
					onStepChange={handleStepChange}
				/>
			)}
		</div>
	);
};
