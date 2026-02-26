import { useCallback, useMemo } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';
import learnSections from '../data/learnSections';

/**
 * Custom hook for managing learn progress state.
 *
 * Combines auto-detection (checking scData and async queries) with manual
 * checkbox tracking persisted via @wordpress/preferences.
 */
export default function useLearnProgress() {
	// Async product check — replaces synchronous PHP Product API call.
	const { records: products, isResolving: isResolvingProducts } =
		useEntityRecords( 'surecart', 'product', {
			archived: false,
			per_page: 1,
		} );

	// Persisted manual steps via @wordpress/preferences.
	const { set } = useDispatch( preferencesStore );
	const manualSteps = useSelect(
		( select ) =>
			select( preferencesStore ).get(
				'surecart/learn',
				'completedSteps'
			) ?? [],
		[]
	);

	// Auto-detect checks (reactive to async product query).
	const autoDetectChecks = useMemo(
		() => ( {
			hasApiToken: () => !! window.scData?.account_id,
			hasBrandColor: () => !! window.scData?.brand_color,
			hasProcessor: () => {
				const processors = window.scData?.processors;
				if ( ! Array.isArray( processors ) ) {
					return false;
				}
				return (
					processors.filter( ( p ) => p.processor_type !== 'mock' )
						.length > 0
				);
			},
			hasProducts: () =>
				Array.isArray( products ) && products.length > 0,
		} ),
		[ products ]
	);

	const autoDetectedSteps = useMemo( () => {
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
	}, [ autoDetectChecks ] );

	// Merge auto-detected and manual steps.
	const completedSteps = useMemo(
		() => [ ...new Set( [ ...autoDetectedSteps, ...manualSteps ] ) ],
		[ autoDetectedSteps, manualSteps ]
	);

	// Toggle a step's completion state.
	const toggleStep = useCallback(
		( stepId ) => {
			// Don't allow toggling auto-detected steps.
			if ( autoDetectedSteps.includes( stepId ) ) {
				return;
			}

			const newSteps = manualSteps.includes( stepId )
				? manualSteps.filter( ( id ) => id !== stepId )
				: [ ...manualSteps, stepId ];
			set( 'surecart/learn', 'completedSteps', newSteps );
		},
		[ manualSteps, autoDetectedSteps, set ]
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
		isLoading: isResolvingProducts,
	};
}
