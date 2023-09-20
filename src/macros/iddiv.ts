(function () {
  Macro.add('iddiv', {
    skipArgs: false,
    tags: null,
		handler() {
			if (this.args.length !== 1) {
				return this.error(`iddiv id (current=${this.args[0]})`);
			}

      const span = jQuery(document.createElement('div'))
        .attr('id', this.args[0])
        .appendTo(this.output);

      if (this.payload[0].contents !== '') {
        span.append(Wikifier.wikifyEval(this.payload[0].contents.trim()));
      }
		}
	});
})()
