<?php
$video  = $media->video_attributes( 'large' );
$poster = $media->attributes( 'large' );

\SureCart::render(
	'media/video',
	[
		'poster'  => $poster->src,
		'src'     => $video->src,
		'alt'     => $video->alt,
		'title'   => $video->title,
		'style'   => ! empty( $media->getMetadata( 'aspect_ratio' ) ) ? 'aspect-ratio: ' . esc_attr( $media->getMetadata( 'aspect_ratio' ) ) . ';' : '',
		'loading' => $loading ?? 'eager',
	]
);
