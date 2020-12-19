var baseUrl = 'http://127.0.0.1:3000'
var utils = {
	ajax: function (options) {
        options.url = baseUrl + options.url
		$.ajax(options)
    },
    //是否在可视区
    isVisibility: function($elem) {
        let $win = $(window)
        return ($elem.offset().top < $win.scrollTop() + $win.height() && $elem.offset().top + $elem.height() > $win.scrollTop())
    },
    //防抖
    debounce: function (fn, delay){
        var timer = 0;
        //返回一个函数
        return function () {
            if (timer) {
                //每次事件被触发时,清除之前的旧定时器
                clearTimeout(timer);
            }
            //开启一个新的定时器从新开始等待
            timer = setTimeout(fn, delay)
        }
    },
    loadImage: function(imageSrc,success) {
        var image = new Image()
        image.onload = function () {
            typeof success == 'function' ? success():null
        }
        image.src = imageSrc
    }

}
