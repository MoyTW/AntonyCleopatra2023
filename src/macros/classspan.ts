(function () {
  Macro.add('classspan', {
    skipArgs: false,
    tags: null,
		handler() {
			if (this.args.length !== 1) {
				return this.error(`classspan class (current=${this.args[0]})`);
			}

      const span = jQuery(document.createElement('span'))
        .attr('class', this.args[0])
        .appendTo(this.output);

      if (this.payload[0].contents !== '') {
        span.append(Wikifier.wikifyEval(this.payload[0].contents.trim()));
      }
		}
	});
})()
