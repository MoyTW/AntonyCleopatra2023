(function () {
  Macro.add('idspan', {
    skipArgs: false,
    tags: null,
		handler() {
			if (this.args.length !== 1) {
				return this.error(`idspan id (current=${this.args[0]})`);
			}

      const span = jQuery(document.createElement('span'))
        .attr('id', this.args[0])
        .appendTo(this.output);

      if (this.payload[0].contents !== '') {
        span.append(Wikifier.wikifyEval(this.payload[0].contents.trim()));
      }
		}
	});
})()
