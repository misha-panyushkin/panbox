function Panbox (selector, params) {
	appendPanboxCss();
	this.$contentbox = $(selector);
	this.$contentbox.get(0).panbox = this;
	this.wrap(params);	
}

Panbox.prototype.defaults = {
	thumb_height: 20,
	update: function (event) {
		var box = this.$contentbox.get(0);
		
		this.scroll_top = box.scrollTop;
		this.scroll_height = box.scrollHeight;
		this.client_height = box.clientHeight;

		if (this.scroll_height != this.client_height) {
			this.thumb_height = Math.pow(this.client_height, 2)/this.scroll_height;
			if (this.thumb_height < this.defaults.thumb_height) {
				this.thumb_height = this.defaults.thumb_height;
			}
		} else {
			this.thumb_height = 0;
		}

		this.thumb_offset = this.client_height*this.scroll_top/this.scroll_height;

		this.$scrollthumb.css({
			'height': this.thumb_height,
			'top': this.thumb_offset
		});


		if (!this.locked) {
			// no fire the handlers!
		}
	},

	mousedown: function (event) {
		if (this._mousemove) {
			$(window).off('mousemove.panbox', this._mousemove);
		}
		this._mousemove = this.defaults.mousemove.bind(this, this.scroll_top, event.pageY);
		$(window).on('mousemove.panbox', this._mousemove);

		if (this._mouseup) {
			$(window).off('mouseup.panbox', this._mouseup);
		}
		this._mouseup = this.defaults.mouseup.bind(this);
		$(window).on('mouseup.panbox', this._mouseup);
	},

	mousemove: function (start_scroll_top, startY, event) {
		var box = this.$contentbox.get(0);
		var thumb_offset = event.pageY - startY;
		var scroll_offset = thumb_offset*this.scroll_height/this.client_height + start_scroll_top;
		if (scroll_offset < 0) {
			scroll_offset = 0;
		} else if (scroll_offset > this.scroll_height - this.client_height) {
			scroll_offset = this.scroll_height - this.client_height;
		}
		box.scrollTop = scroll_offset;
		event.preventDefault();
	},

	mouseup: function () {
		$(window).off('mousemove.panbox', this._mousemove);
		$(window).off('mouseup.panbox', this._mouseup);
	}
};

Panbox.prototype.wrap = function (params) {
	var native_scroll_bar_width;

	this.params = params || this.params || {};
	this.params.scrollthumb = this.params.scrollthumb || {};

	this.$contentbox.attr('data-panbox-contentbox', 1);

	if (native_scroll_bar_width = getScrollbarWidth() === 0) {
		this.$contentbox.attr('data-panbox-contentbox-nowidthscrollbar', 1);
	} else {
		this.$contentbox.css('margin-right', -native_scroll_bar_width);
	}

	this.$coverbox = this.$coverbox || this.$contentbox.wrap('<div/>').parent()
	.attr('data-panbox-coverbox', 1);

	this.$coverbox.css({
		'width': this.params.width || '100%',
		'height': this.params.height || '100%',
	});

	this.$scrollbar = this.$scrollbar || $('<div/>')
	.attr('data-panbox-scrollbar-track', 1)
	.appendTo(this.$coverbox);

	this.$scrollthumb = this.$scrollthumb || $('<div/>')
	.attr('data-panbox-scrollbar-thumb', 1)
	.appendTo(this.$scrollbar);

	if (this.params.scrollthumb.class_name) {
		this.$scrollthumb.addClass(this.params.scrollthumb.class_name);
	}

	this._update = this.defaults.update.bind(this);
	this._update();
	this._mousedown = this.defaults.mousedown.bind(this);

	return this;
};

Panbox.prototype.unwrap = function () {
	// todo: return styles before wrapping.
	this.off();
	this.$coverbox.replaceWith(this.$contentbox);
	this.$coverbox = null;
	this.$scrollbar = null;
	this.$scrollthumb = null;
	return this;
};


Panbox.prototype.on = function () {
	this.$contentbox.off('scroll.panbox', this._update).on('scroll.panbox', this._update);
	this.$scrollthumb.off('mousedown.panbox', this._mousedown).on('mousedown.panbox', this._mousedown);
	return this;
};

Panbox.prototype.off = function () {
	this.$contentbox.off('scroll.panbox', this._update);
	this.$scrollthumb.off('mousedown.panbox', this._mousedown);
	if (this._mousemove) {
		$(window).off('mousemove.panbox', this._mousemove);
	}
	if (this._mouseup) {
		$(window).off('mouseup.panbox', this._mouseup);
	}
	return this;
};


Panbox.prototype.lock = function () {
	this.locked = 1;
	return this;
};

Panbox.prototype.unlock = function () {
	delete this.locked;
	return this;
};


Panbox.prototype.scroll = function (position) {
	var box = this.$contentbox.get(0);
	switch (position) {
		case 'top':
			box.scrollTop = 0;
			break;
		case 'bottom':
			box.scrollTop = box.scrollHeight;
			break;
		default:
			box.scrollTop = parseInt(position) || box.scrollTop;
			break;
	}
	return this;
};


c.panbox = function (selector, params) {
	var box = $(selector).get(0);
	if (box && box.panbox) {
		return box.panbox;
	}
	return new Panbox(selector, params);
};