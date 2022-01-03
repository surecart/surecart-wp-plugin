<ce-button
    href="{{ $href }}"
    type="{{ $type }}"
    size="{{ $size }}"
>
    @if ($show_icon)
        <ce-icon
            slot="log-out"
            name="{{ $show_icon }}"
        ></ce-icon>
    @endif

    {{ $label }}
</ce-button>
