Mmenu.wrappers.jqueryMobile=function(){var t=this;this.opts.onClick.close=!1,this.conf.offCanvas.page.selector="div.ui-page-active",Mmenu.$("body").on("pagecontainerchange",function(e,n){t.opts.offCanvas&&("function"==typeof t.close&&t.close(),"function"==typeof t.close&&t.setPage(n.toPage))}),this.bind("initAnchors:after",function(){Mmenu.$("body").on("click",".mm-listview a",function(e){e.isDefaultPrevented()||(e.preventDefault(),Mmenu.$("body").pagecontainer("change",e.currentTarget.getAttribute("href")))})})};