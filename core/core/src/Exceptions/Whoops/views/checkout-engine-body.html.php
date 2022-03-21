<?php
/**
 * @package   SureCartCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com/
 */

/**
 * @noinspection ALL
 */
?>
<div class="surecart-whoops">
	<style><?php echo $stylesheet; ?></style>

	<div class="Whoops container">
		<div class="stack-container">

			<?php $tpl->render( $panel_left_outer ); ?>

			<?php $tpl->render( $panel_details_outer ); ?>

		</div>
	</div>

	<script><?php echo $zepto; ?></script>
	<script><?php echo $clipboard; ?></script>
	<script><?php echo $javascript; ?></script>
</div>
