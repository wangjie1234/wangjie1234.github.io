var tabPlug=(function($, window, document) {
    var scrollSetp = 500,
    operationWidth = 90,
    leftOperationWidth = 30,
    animatSpeed = 150,
    linkframe = function(url, value) {
        $("#menu-list a.active").removeClass("active");
        $("#menu-list a[data-url='" + url + "'][data-value='" + value + "']").addClass("active");
        $("#page-content iframe.active").removeClass("active");
        $("#page-content .iframe-content[data-url='" + url + "'][data-value='" + value + "']").addClass("active");
        $("#menu-all-ul li.active").removeClass("active");
        $("#menu-all-ul li[data-url='" + url + "'][data-value='" + value + "']").addClass("active");
    },
    move = function(selDom) {
        var nav = $("#menu-list");
        var releft = selDom.offset().left;
        var wwidth = parseInt($("#page-tab").width());
        var left = parseInt(nav.css("margin-left"));
        if (releft < 0 && releft <= wwidth) {
            nav.animate({
                "margin-left": (left - releft + leftOperationWidth) + "px"
            },
            animatSpeed);
        } else {
            if (releft + selDom.width() > wwidth - operationWidth) {
                nav.animate({
                    "margin-left": (left - releft + wwidth - selDom.width() - operationWidth) + "px"
                },
                animatSpeed);
            }
        }
    },
    createmove = function() {
        var nav = $("#menu-list");
        var wwidth = parseInt($("#page-tab").width());
        var navwidth = parseInt(nav.width());
        if (wwidth - operationWidth < navwidth) {
            nav.animate({
                "margin-left": "-" + (navwidth - wwidth + operationWidth) + "px"
            },
            animatSpeed)
        }
    },
    closemenu = function() {
        $(this.parentElement).animate({
            "width": "0",
            "padding": "0"
        },
        0,
        function() {
            var jthis = $(this);
            if (jthis.hasClass("active")) {
                var linext = jthis.next();
                if (linext.length > 0) {
                    linext.click();
                    move(linext)
                } else {
                    var liprev = jthis.prev();
                    if (liprev.length > 0) {
                        liprev.click();
                        move(liprev)
                    }
                }
            }
            //删除导航标签
            this.remove();
            //删除对应的iframe标签
            $("#page-content .iframe-content[data-url='" + jthis.data("url") + "'][data-value='" + jthis.data("value") + "']").remove()
        	//删除右边快捷导航对应的标签
			$("#menu-all-ul [data-url='" + jthis.data("url")+"']").remove();
        });
        event.stopPropagation();
    },
    init = function() {
        $("#page-prev").bind("click",
        function() {
            var nav = $("#menu-list");
            var left = parseInt(nav.css("margin-left"));
            if (left !== 0) {
                nav.animate({
                    "margin-left": (left + scrollSetp > 0 ? 0 : (left + scrollSetp)) + "px"
                },
                animatSpeed);
            }
        });
        $("#page-next").bind("click",
        function() {
            var nav = $("#menu-list");
            var left = parseInt(nav.css("margin-left"));
            var wwidth = parseInt($("#page-tab").width());
            var navwidth = parseInt(nav.width());
            var allshowleft = -(navwidth - wwidth + operationWidth);
            if (allshowleft !== left && navwidth > wwidth - operationWidth) {
                var temp = (left - scrollSetp);
                nav.animate({
                    "margin-left": (temp < allshowleft ? allshowleft: temp) + "px"
                },
                animatSpeed);
            }
        });
        $("#page-operation").bind("click",
        function() {
            var menuall = $("#menu-all");
            if (menuall.is(":visible")){
                menuall.hide();
            } else {
                menuall.show();
            }
        });
        $("body").bind("mousedown",function(event) {
            if (! (event.target.id === "menu-all" || event.target.id === "menu-all-ul" || event.target.id === "page-operation" || event.target.id === "page-operation" || event.target.parentElement.id === "menu-all-ul")) {
                $("#menu-all").hide()
            }
            event.stopPropagation();
        })
    };
    $.fn.tab = function(){
        init();
        this.bind("click",
        function(){
            var linkUrl = this.href;
            var linkHtml = this.text.trim();
            var selDom = $("#menu-list a[data-url='" + linkUrl + "'][data-value='" + linkHtml + "']");
            if (selDom.length === 0) {
                var iel = $("<i>", {
                    "class": "menu-close"
                }).bind("click", closemenu);
                $("<a>", {
                    "html": linkHtml,
                    "href": "javascript:void(0);",
                    "data-url": linkUrl,
                    "data-value": linkHtml
                }).bind("click",
                function() {
                    var jthis = $(this);
                    linkframe(jthis.data("url"), jthis.data("value"))
                }).append(iel).appendTo("#menu-list");
                $("<iframe>", {
                    "class": "iframe-content",
                    "data-url": linkUrl,
                    "data-value": linkHtml,
                    src: linkUrl
                }).appendTo("#page-content");
                $("<li>", {
                    "html": linkHtml,
                    "data-url": linkUrl,
                    "data-value": linkHtml
                }).bind("click",
                function() {
                    var jthis = $(this);
                    linkframe(jthis.data("url"), jthis.data("value"));
                    move($("#menu-list a[data-url='" + linkUrl + "'][data-value='" + linkHtml + "']"));
                    $("#menu-all").hide();
                    event.stopPropagation();
                }).appendTo("#menu-all-ul");
                createmove();
            } else {
                move(selDom);
            }
            linkframe(linkUrl, linkHtml);
            return false;
        });
        return this;
    }
    /***
     * 将内部函数作为返回值返回，形成闭包。
     * 在函数外部可以调用。
     * */
    return {
    	closemenu:closemenu
        ,linkframe:linkframe
    }
})(jQuery, window, document);
  /**
     * 右击事件
     * */
    //取消右键（有待优化）
	$('html').on('contextmenu', function (){return false;}).click(function(){  
	    $('.popup_menu').hide();  
	});  
	//注册右击事件
	$('html').on('contextmenu','a',function(e){
	var that= this;
	    var popupmenu = kyoPopupMenu.initContextmenu(that);  
	    l = ($(document).width() - e.clientX) < popupmenu.width() ? (e.clientX - popupmenu.width()) : e.clientX;  
	    t = ($(document).height() - e.clientY) < popupmenu.height() ? (e.clientY - popupmenu.height()) : e.clientY;  
		popupmenu.css({left: l,top: t}).show();  
	    return false;  
	});  
	//生成右击事件菜单
	var kyoPopupMenu={};  
	kyoPopupMenu = (function(){ 
	return {  
	    initContextmenu: function (obj) {
	        $('.popup_menu').remove(); 
	        var html='<div class="popup_menu">';
	        		html+='<ul style="list-style:none;margin:0;	padding:0;font-size:12px;">';
	        		html+='<li><a menu="updateTab">刷新</a></li>';
	        		html+='<li><a menu="closeTab">关闭</a></li>';
	        		html+='<li><a menu="closeOther">关闭其他</a></li>';
	    			html+='<li><a menu="closeAll">关闭所有</a></li>';
	        		html+='</ul>';
	        		html+='</div>';
	        popupMenuApp = $(html).find('a').attr('href','javascript:;').end().appendTo('body');  
	        //绑定事件  
	        $('.popup_menu a[menu="updateTab"]').on('click', function (){  
	        	//刷新当前的
	        	tabPlug.linkframe($(obj).attr('data-url'),$(obj).attr('data-value'));
	        });  
	        $('.popup_menu a[menu="closeTab"]').on('click', function (){  
	        	//关闭当前选中的
	        	tabPlug.closemenu.call($(obj).find('.menu-close')[0]);
	        });  
	        $('.popup_menu a[menu="closeOther"]').on('click', function (){  
				//关闭除了选中的其他tab
	        	$.each($(obj).siblings(), function() {
	        		tabPlug.closemenu.call($(this).find('.menu-close')[0]);
	        	});
	        	$('.popup_menu').hide();  
	        });  
	        $('.popup_menu a[menu="closeAll"]').on('click', function (){  
	        	$('#menu-list a').each(function(){
	        		//关闭所有
        			tabPlug.closemenu.call($(this).find('.menu-close')[0]);
	        	});
	        	$('.popup_menu').hide();  
	        }); 
	        return popupMenuApp;  
	    }  
	}})(); 
