<?php
$logo_url = \SureCart::account()->brand->logo_url;
?>

<?php if ( $logo_url ) : ?>
	<img src="<?php echo esc_url( $logo_url ); ?>"
		style="max-width: <?php echo esc_attr( $logo_width ?? '130px' ); ?>; width: 100%; height: auto;"
		alt="<?php echo esc_attr( get_bloginfo() ); ?>"
	/>
<?php else : ?>
	<sc-text style="--font-size: var(--sc-font-size-xx-large); --font-weight: var(--sc-font-weight-bold)"><?php echo esc_html( get_bloginfo() ); ?></sc-text>
<?php endif; ?>
