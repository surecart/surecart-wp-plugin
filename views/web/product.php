<?php get_header(); ?>
<?php
echo get_the_block_template_html(); // phpcs:ignore WordPress.Security.EscapeOutput
?>
<?php
get_footer();
