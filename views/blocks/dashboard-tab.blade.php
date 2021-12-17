<ce-tab href="{{ esc_url($href) }}" active={{ esc_attr($active) }}>
    @if ($icon) <ce-icon style="font-size: 18px;" name={{ $icon }} slot="prefix"></ce-icon> @endif
    {{ $title ?? 'tab' }}
</ce-tab>
