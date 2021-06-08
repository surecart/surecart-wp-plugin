<ce-choices>

    @foreach ($prices as $price)
        <ce-choice name="{{ $price['name'] }}"
            {{ !empty($price['default']) ? 'checked' : '' }}
            required>

            @isset($price['title'])
                <?php echo wp_kses_post($price['title']); ?>
            @endisset

            @isset($price['description'])
                <span slot="description"><?php echo wp_kses_post($price['description']); ?></span>
            @endisset
        </ce-choice>
    @endforeach

</ce-choices>
