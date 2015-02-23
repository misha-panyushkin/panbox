! function (c, window) {

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var args = Array.prototype.slice.call(arguments, 1);
        var func = this;
        return function () {
            var add_args = Array.prototype.slice.call(arguments);
            return func.apply(context, args.concat(add_args));
        }
    }
    
    function getScrollbarWidth () {
        var outer;
        var widthNoScroll;
        var inner;
        var widthWithScroll;
        
        outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar";
    
        document.body.appendChild(outer);
    
        widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";
    
        inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);        
    
        widthWithScroll = inner.offsetWidth;
    
        outer.parentNode.removeChild(outer);
    
        return widthNoScroll - widthWithScroll;
    }
    
    function appendPanboxCss () {
        var core_css, no_width_scrollbar_css, scrollbar_thumb;
        var $panbox_css = $('[data-panbox-css]');
    
        if ($panbox_css.length) {
            return;
        }
    
        core_css = '/* panbox core css */' + 
        '\n[data-panbox-contentbox]{width: 100%; height: 100%; overflow-y: scroll;}' + 
        '\n[data-panbox-coverbox]{overflow: hidden; display: inline-block; position: relative;}' + 
        '\n[data-panbox-scrollbar-track]{position: absolute; top: 0; right: 1px; bottom: 0; width: 7px;}' + 
        '\n[data-panbox-scrollbar-thumb]{position: absolute; top: 0; right: 0; width: 100%;}';
    
        scrollbar_thumb = '/* panbox core css */' + 
        '\n[data-panbox-scrollbar-thumb]{background-color:#8A8A8A; border-radius:150px;}';
    
        no_width_scrollbar_css = '/* panbox no width scrollbar css */' + 
        '\n[data-panbox-contentbox-nowidthscrollbar]::-webkit-scrollbar {-webkit-appearance: none;}' + 
        '\n[data-panbox-contentbox-nowidthscrollbar]::-webkit-scrollbar:vertical {display: none;}' + 
        '\n[data-panbox-contentbox-nowidthscrollbar]::-webkit-scrollbar-thumb {display: none;}' + 
        '\n[data-panbox-contentbox-nowidthscrollbar]::-webkit-scrollbar-track {display: none;}';
    
        $('<style>').attr('data-panbox-css', 1).html(core_css + '\n\n' + scrollbar_thumb + '\n\n' + no_width_scrollbar_css).prependTo('head');
    }


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

} (this, this);