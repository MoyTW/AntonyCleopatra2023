(function () {
  Macro.add('linkdisable', {
    skipArgs: false,
    tags: null,
		handler() {
			if (this.args.length !== 2) {
				return this.error(`linkdisable requires text (current=${this.args[0]}) and id (current=${this.args[1]})`);
			}

			const $link = jQuery(document.createElement('a'));

			$link
				.wiki(this.args[0])
        .attr('id', `linkdisable-${this.args[1]}`)
				.addClass(`link-internal macro-linkdisable`)
				.ariaClick({
					namespace : '.macros',
					one       : true
				}, this.createShadowWrapper(
					() => {
						$link.attr('disabled', 'true')

						if (this.payload[0].contents !== '') {
              this.createShadowWrapper(() => Wikifier.wikifyEval(this.payload[0].contents.trim()))();
            }
					}
				))
				.appendTo(this.output);
		}
	});
})()
