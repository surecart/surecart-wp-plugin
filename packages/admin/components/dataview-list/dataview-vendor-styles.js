/**
 * Dedicated entry for @wordpress/dataviews vendor CSS.
 *
 * Imports via SCSS so webpack's splitChunks extracts it into:
 *   dist/admin/style-dataview-vendor.css
 *
 * All DataView list page controllers enqueue this single file
 * instead of each entity trying to produce its own vendor CSS.
 */
import './dataview-vendor.scss';
