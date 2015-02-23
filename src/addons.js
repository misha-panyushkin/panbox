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