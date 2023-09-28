(function () {
  Macro.add('iddiv', {
    skipArgs: false,
    tags: null,
		handler() {
      const span = jQuery(document.createElement('div'))
        .attr('id', this.args[0])
      
      if (this.args.length > 1) {
        span.attr('class', this.args[1])
      }
      
      span.appendTo(this.output);

      if (this.payload[0].contents !== '') {
        span.append(Wikifier.wikifyEval(this.payload[0].contents.trim()));
      }
		}
	});
})()
