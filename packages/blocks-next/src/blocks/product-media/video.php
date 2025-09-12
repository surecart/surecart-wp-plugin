<?php
// get the video and poster attributes.
$video = $media->video_attributes( 'large' );

// render the video html.
$html = SureCart::view( 'media/video' )->with(
	[
		'poster' => $video->poster,
		'src'    => $video->src,
		'alt'    => $video->alt,
		'title'  => $video->title ?? get_the_title(),
		'style'  => ! empty( $media->getMetadata( 'aspect_ratio' ) ) ? 'aspect-ratio: ' . esc_attr( $media->getMetadata( 'aspect_ratio' ) ) . ';' : '',
	]
)->toString();

// filter the video html.
echo wp_kses( apply_filters( 'surecart_video_html', $html, $video->src, $video->poster ), sc_allowed_svg_html() );
