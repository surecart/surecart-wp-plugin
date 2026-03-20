<?php
// get the video and poster attributes.
$video    = $media->video_attributes( apply_filters( 'surecart/product-video-poster/size', 'large' ) );
$metadata = $media->getMetadata();

// render the video html.
$html = SureCart::view( 'media/video' )->with(
	[
		'poster'   => $video->poster,
		'src'      => $video->src,
		'alt'      => ! empty( $video->alt ) ? $video->alt : sprintf( /* translators: %s is the video title. */ __( 'Video: %s', 'surecart' ), get_the_title() ),
		'title'    => ! empty( $video->title ) ? $video->title : get_the_title(),
		'style'    => ! empty( $metadata['aspect_ratio'] ) ? 'aspect-ratio: ' . esc_attr( $metadata['aspect_ratio'] ) . ';' : '',
		'controls' => isset( $metadata['controls'] ) ? (bool) $metadata['controls'] : true, // default to true.
		'autoplay' => isset( $metadata['autoplay'] ) ? (bool) $metadata['autoplay'] : false,
		'loop'     => isset( $metadata['loop'] ) ? (bool) $metadata['loop'] : false,
		'muted'    => isset( $metadata['muted'] ) ? (bool) $metadata['muted'] : false,
	]
)->toString();

// filter the video html.
echo wp_kses( apply_filters( 'surecart_video_html', $html, $video, $media, $metadata ), sc_allowed_svg_html() );
