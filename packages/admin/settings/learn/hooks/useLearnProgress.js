import { useCallback, useEffect, useMemo } from '@wordpress/element';
import { useEntityProp, useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';
import learnSections from '../data/learnSections';

/**
 * Custom hook for managing learn progress state.
 *
 * Combines auto-detection (checking scData and async queries) with manual
 * checkbox tracking persisted as a site option via useEntityProp.
 */
export default function useLearnProgress() {
	// Async product check.
	const { records: products, isResolving: isResolvingProducts } =
		useEntityRecords( 'surecart', 'product', {
			archived: false,
			per_page: 1,
		} );

	// Site-wide completed steps via useEntityProp.
	const [ siteSteps, setSiteSteps ] = useEntityProp(
		'root',
		'site',
		'surecart_learn_completed_steps'
	);
	const manualSteps = useMemo( () => siteSteps ?? [], [ siteSteps ] );

	// Site-wide total step count — synced from JS so PHP can compute remaining.
	const [ siteTotalSteps, setSiteTotalSteps ] = useEntityProp(
		'root',
		'site',
		'surecart_learn_total_steps'
	);

	const { saveEditedEntityRecord } = useDispatch( coreStore );

	// Wait until the site entity is loaded before attempting saves.
	const hasSiteLoaded = useSelect( ( select ) =>
		select( coreStore ).hasFinishedResolution( 'getEntityRecord', [
			'root',
			'site',
			undefined,
		] )
	);

	// Compute and sync total steps count so PHP always has the current value.
	const computedTotal = useMemo(
		() =>
			learnSections.reduce(
				( sum, section ) => sum + section.steps.length,
				0
			),
		[]
	);

	// Auto-detect checks (reactive to async product query).
	const autoDetectChecks = useMemo(
		() => ( {
			hasApiToken: () => !! window.scData?.account_id,
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
			hasBrandDetails: () => !! window.scData?.brand_logo_url,
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

	// Sync total steps and auto-detected steps to the site option in a single save.
	useEffect( () => {
		if ( ! hasSiteLoaded ) {
			return;
		}
		let dirty = false;

		// Sync total steps.
		if ( siteTotalSteps !== computedTotal ) {
			setSiteTotalSteps( computedTotal );
			dirty = true;
		}

		// Sync auto-detected steps.
		if ( autoDetectedSteps.length ) {
			const currentSet = new Set( manualSteps );
			let stepsChanged = false;
			for ( const stepId of autoDetectedSteps ) {
				if ( ! currentSet.has( stepId ) ) {
					currentSet.add( stepId );
					stepsChanged = true;
				}
			}
			if ( stepsChanged ) {
				setSiteSteps( [ ...currentSet ] );
				dirty = true;
			}
		}

		if ( dirty ) {
			saveEditedEntityRecord( 'root', 'site' );
		}
	}, [
		computedTotal,
		siteTotalSteps,
		autoDetectedSteps,
		manualSteps,
		setSiteTotalSteps,
		setSiteSteps,
		saveEditedEntityRecord,
		hasSiteLoaded,
	] );

	// Merge auto-detected and manual steps.
	const completedSteps = useMemo(
		() => [ ...new Set( [ ...autoDetectedSteps, ...manualSteps ] ) ],
		[ autoDetectedSteps, manualSteps ]
	);

	// Toggle a step's completion state.
	const toggleStep = useCallback(
		( stepId ) => {
			// Don't allow toggling auto-detected steps or saving before entity loads.
			if ( autoDetectedSteps.includes( stepId ) || ! hasSiteLoaded ) {
				return;
			}

			const newSteps = manualSteps.includes( stepId )
				? manualSteps.filter( ( id ) => id !== stepId )
				: [ ...manualSteps, stepId ];
			setSiteSteps( newSteps );
			saveEditedEntityRecord( 'root', 'site' );
		},
		[ manualSteps, autoDetectedSteps, setSiteSteps, saveEditedEntityRecord, hasSiteLoaded ]
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
		isLoading: isResolvingProducts || ! hasSiteLoaded,
	};
}
