import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import learnSections from '../data/learnSections';

/**
 * Auto-detect completion checks based on scData.
 */
const autoDetectChecks = {
	hasApiToken: () => !! window.scData?.account_id,
	hasBrandColor: () => !! window.scData?.brand_color,
	hasProcessor: () => {
		const processors = window.scData?.processors;
		if ( ! Array.isArray( processors ) ) {
			return false;
		}
		return processors.filter( ( p ) => p.processor_type !== 'mock' ).length > 0;
	},
	hasProducts: () => !! window.scData?.has_products,
};

/**
 * Get all auto-detected step IDs.
 */
function getAutoDetectedSteps() {
	const detected = [];
	learnSections.forEach( ( section ) => {
		section.steps.forEach( ( step ) => {
			if ( step.autoDetect && autoDetectChecks[ step.autoDetect ] ) {
				if ( autoDetectChecks[ step.autoDetect ]() ) {
					detected.push( step.id );
				}
			}
		} );
	} );
	return detected;
}

/**
 * Custom hook for managing learn progress state.
 *
 * Combines auto-detection (checking scData) with manual checkbox tracking
 * persisted via REST endpoint to WordPress user meta.
 */
export default function useLearnProgress() {
	const [ manualSteps, setManualSteps ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	const autoDetectedSteps = useMemo( () => getAutoDetectedSteps(), [] );

	// Merge auto-detected and manual steps.
	const completedSteps = useMemo(
		() => [ ...new Set( [ ...autoDetectedSteps, ...manualSteps ] ) ],
		[ autoDetectedSteps, manualSteps ]
	);

	// Load persisted progress on mount.
	useEffect( () => {
		apiFetch( { path: '/surecart/v1/learn-progress' } )
			.then( ( response ) => {
				if ( response?.completed_steps ) {
					setManualSteps( response.completed_steps );
				}
			} )
			.catch( () => {
				// Silently fail - progress just won't be loaded.
			} )
			.finally( () => {
				setIsLoading( false );
			} );
	}, [] );

	// Toggle a step's completion state.
	const toggleStep = useCallback(
		( stepId ) => {
			// Don't allow toggling auto-detected steps.
			if ( autoDetectedSteps.includes( stepId ) ) {
				return;
			}

			const isCurrentlyManual = manualSteps.includes( stepId );
			const newManualSteps = isCurrentlyManual
				? manualSteps.filter( ( id ) => id !== stepId )
				: [ ...manualSteps, stepId ];

			// Capture snapshot before the optimistic update for safe revert.
			const previousManualSteps = manualSteps;
			setManualSteps( newManualSteps );

			// Persist to server.
			apiFetch( {
				path: '/surecart/v1/learn-progress',
				method: 'PUT',
				data: { completed_steps: newManualSteps },
			} ).catch( () => {
				// Revert on failure.
				setManualSteps( previousManualSteps );
			} );
		},
		[ manualSteps, autoDetectedSteps ]
	);

	// Check if a specific step is completed.
	const isStepCompleted = useCallback(
		( stepId ) => completedSteps.includes( stepId ),
		[ completedSteps ]
	);

	// Check if a step is auto-detected (read-only).
	const isAutoDetected = useCallback(
		( stepId ) => autoDetectedSteps.includes( stepId ),
		[ autoDetectedSteps ]
	);

	// Get progress for a section.
	const getSectionProgress = useCallback(
		( sectionId ) => {
			const section = learnSections.find( ( s ) => s.id === sectionId );
			if ( ! section ) {
				return { completed: 0, total: 0 };
			}
			const total = section.steps.length;
			const completed = section.steps.filter( ( step ) =>
				completedSteps.includes( step.id )
			).length;
			return { completed, total };
		},
		[ completedSteps ]
	);

	return {
		completedSteps,
		toggleStep,
		isStepCompleted,
		isAutoDetected,
		getSectionProgress,
		isLoading,
	};
}
