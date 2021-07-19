<div class="wrap">
    <h1 class="wp-heading-inline">{{ __('Edit Product', 'checkout_engine') }}</h1>
    <hr class="wp-header-end" />

    <div id="poststuff">
        <div id="postbody"
            class="metabox-holder columns-2">
            <div id="post-body-content">
                <div id="titlediv">
                    <div id="titlewrap">
                        <label class="screen-reader-text"
                            id="title-prompt-text"
                            for="title">{{ __('Add a name', 'checkout_engine') }}</label>
                        <input type="text"
                            name="name"
                            size="30"
                            value="{{ $product->name }}"
                            id="title"
                            spellcheck="true"
                            autocomplete="off">
                    </div>
                </div>
            </div>
            <div id="postbox-container-1"
                class="postbox-container">
                <div id="side-sortables"
                    class="meta-box-sortables">
                </div>
            </div>
        </div>
    </div>

    <?php do_meta_boxes('product', 'normal', $product); ?>

    <h2>Prices:</h2>
    @forelse ($product->prices as $price)
        <p>{{ $price->name }}</p>
    @empty
        <p>No Prices</p>
    @endforelse

    <?php do_meta_boxes('product', 'advanced', $product); ?>
</div>
