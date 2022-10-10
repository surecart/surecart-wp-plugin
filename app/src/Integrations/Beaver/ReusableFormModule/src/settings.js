window.surecartBBDropdown = ({ nonce }) => {
  return {
    show: false,
    loading: false,
    focus: false,
    search: "",
    form: {
      name: jQuery("#fl-field-form_name").find("input").val() || "",
      id: jQuery("#fl-field-form_id").find("input").val() || "",
      editLink: "",
    },
    items: [],

    async init() {
      this.$watch("show", (val) => {
        val && this.fetchForms();
        this.$nextTick(() => {
          this.$refs.searchbox.focus();
        });
      });
      this.$watch("search", (val) => {
        val && this.show && this.fetchForms();
      });
      this.$watch("form.id", (val) => {
        jQuery("#fl-field-form_id").find("input").val(val).trigger("change");
        this.form.editLink = "/wp-admin/post.php?post=" + val + "&action=edit";
      });
      this.$watch("form.name", (val) => {
        jQuery("#fl-field-form_name").find("input").val(val).trigger("change");
      });

      const val = jQuery("#fl-field-form_id").find("input").val();
      if (val) {
        this.form.editLink = "/wp-admin/post.php?post=" + val + "&action=edit";
      }
    },

    setForm(item) {
      this.form.id = item.id;
      this.form.name = item.form_title;
      this.close();
      FLBuilder.preview.preview();
    },

    fetchForms() {
      this.loading = true;
      jQuery.ajax({
        type: "POST",
        url: ajaxurl,
        dataType: "json",
        cache: false,
        data: {
          action: "surecart_fetch_forms",
          _wpnonce: nonce,
          search: this.search,
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('Error....');
        },
        success: ({ data }) => {
          this.items = data;
        },
        complete: () => {
          this.loading = false;
        },
      });
    },

    open() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    isOpen() {
      return this.show === true;
    },
  };
};

jQuery("window").on("focus", function () {
  jQuery("select[name='sc_form_select']").trigger("change");
});
