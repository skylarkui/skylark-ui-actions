/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns","skylark-langx-types","skylark-langx-objects","skylark-langx-events","skylark-langx-numerics/Vector2","skylark-domx-browser","skylark-domx-data","skylark-domx-eventer","skylark-domx-noder","skylark-domx-files","skylark-domx-geom","skylark-domx-velm","skylark-domx-query","skylark-domx-fx","skylark-domx-plugins-base","skylark-data-collection/HashMap","./base","./skins/SkinManager"],function(skylark,types,objects,events,Vector2,browser,datax,eventer,noder,files,geom,elmx,$,fx,plugins,HashMap,base,SkinManager){const NativeEvents={drag:2,dragend:2,dragenter:2,dragexit:2,dragleave:2,dragover:2,dragstart:2,drop:2,abort:3,change:3,selectionchange:3,submit:3,reset:3,fullscreenchange:3,fullscreenerror:3,focus:4,blur:4,focusin:4,focusout:4,keydown:5,keypress:5,keyup:5,message:6,click:7,contextmenu:7,dblclick:7,mousedown:7,mouseup:7,mousemove:7,mouseover:7,mouseout:7,mouseenter:7,mouseleave:7,progress:11,textInput:12,tap:13,touchstart:13,touchmove:13,touchend:13,load:14,resize:14,select:14,scroll:14,unload:14,wheel:15},Plugin=plugins.Plugin;var Widget=Plugin.inherit({klassName:"Widget",_construct:function(t,e,i){t&&!(t instanceof Widget||t.element)&&(i=e,e=t,t=null),types.isHtmlNode(e)?i=this._parse(e,i):(i=e,e=null),types.isString(i)&&(i={tagName:i}),this.overrided(e,i),e?this._velm=this.elmx(this._elm):(this._velm=this._create(),this._elm=this._velm.elm()),Object.defineProperty(this,"state",{value:this.options.state||new HashMap}),this.visible=!0,this.size=new Vector2(0,0),this.location=new Vector2(0,0),this._mode=Widget.TOP_LEFT,t&&this.setParent(t),this._init();var n=this.options.addons;if(n){var s=this.constructor.addons;for(var o in n)for(var r=0;r<n[o].length;r++){var a=n[o][r];if(types.isString(a)){var l=a,h=s[o][l],u=h.ctor?h.ctor:h;this.addon(u,h.options)}}}},_parse:function(elm,options){var optionsAttr=datax.data(elm,"options");if(optionsAttr){var options1=eval("({"+optionsAttr+"})");options=objects.mixin(options1,options)}return options||{}},_create:function(){var t=this.options.template;if(t)return this.elmx(t);var e=this.options.tagName;if(e)return this.elmx(noder.createElement(e,{style:{position:"absolute",overflow:"hidden"}}));throw new Error("The template or tagName is not existed in options!")},_init:function(){var t=this;this.widgetClass&&this._velm.addClass(this.widgetClass),this.state.on("changed",function(e,i){t._refresh(i.data)})},_startup:function(){},isNativeEvent:function(t){if(types.isString(t))return!!NativeEvents[t];if(types.isArray(t)){for(var e=0;e<t.length;e++)if(NativeEvents[t[e]])return!0;return!1}},on:function(t,e,i,n,s,o){this.el_&&this.isNativeEvent(t)?eventer.on(this.el_,t,e,i,n,s,o):Plugin.prototype.on.call(this,t,e,i,n,s,o)},off:function(t,e){this.el_&&this.isNativeEvent(t)?eventer.off(this.el_,t,e):Plugin.prototype.off.call(this,t,e)},listenTo:function(t,e,i,n){types.isString(t)||types.isArray(t)?(n=i,i=e,e=t,this.el_&&this.isNativeEvent(e)?eventer.on(this.el_,e,i,this,n):this.on(e,i,this,n)):t.nodeType?eventer.on(t,e,i,this,n):Plugin.prototype.listenTo.call(this,t,e,i,n)},unlistenTo:function(t,e,i){types.isString(t)||types.isArray(t)?(i=e,e=t,this.el_&&this.isNativeEvent(e)?eventer.off(this.el_,e,i):this.off(e,i)):t.nodeType?eventer.off(t,e,i):Plugin.prototype.unlistenTo.call(this,t,e,i)},updateLocation:function(t){void 0!==t&&(this._mode=t),this._mode===Widget.TOP_LEFT||this._mode===Widget.TOP_RIGHT?this._elm.style.top=this.location.y+"px":this._elm.style.bottom=this.location.y+"px",this._mode===Widget.TOP_LEFT||this._mode===Widget.BOTTOM_LEFT?this._elm.style.left=this.location.x+"px":this._elm.style.right=this.location.x+"px"},updateSize:function(){this._elm.style.width=this.size.x+"px",this._elm.style.height=this.size.y+"px"},setVisibility:function(t){this.visible=t,this.updateVisibility()},updateVisibility:function(){this._elm.style.display=this.visible?"block":"none"},_refresh:function(t){},mapping:{events:{},attributs:{},properties:{},styles:{}},addon:function(t,e){var i=t.categoryName,n=t.addonName;return this._addons=this.addons||{},(this._addons[i]=this._addons[i]||{})[n]=new t(this,e),this},addons:function(t,e){this._addons=this.addons||{};var i=this._addons[t]=this._addons[t]||{};if(void 0==e)return objects.clone(i||null);objects.mixin(i,e)},render:function(){return this._elm},getEnclosing:function(t){return null},getEnclosed:function(){return children=new ArrayList,children},getSkin:function(){return SkinManager.get()},show:function(){this._velm.show()},hide:function(){this._velm.hide()},focus:function(){try{this._velm.focus()}catch(t){}return this},blur:function(){return this._velm.blur(),this},enable:function(){return this.state.set("disabled",!1),this},disable:function(){return this.state.set("disabled",!0),this},addClass:function(t){return this._velm.addClass(t),this},hasClass:function(t){return this._velm.hasClass(t)},offset:function(){return this._velm.pagePosition()},outerWidth:function(){return this._velm.marginSize().width},outerHeight:function(){return this._velm.marginSize().height},removeClass:function(t){return this._velm.removeClass(t),this},toggleClass:function(t){return this._velm.toggleClass(t),this},aria:function(t,e){const i=this,n=i.getEl(i.ariaTarget);return void 0===e?i._aria[t]:(i._aria[t]=e,i.state.get("rendered")&&n.setAttribute("role"===t?t:"aria-"+t,e),i)},attr:function(t,e){var i=this._velm,n=i.attr(t,e);return n==i?this:n},getAttr:function(t){return this._velm.attr(t)},setAttr:function(t,e){return this._velm.attr(t,e),this},removeAttr:function(t){return this._velm.removeAttr(t),this},center:function(){this.location.set((this.parent.size.x-this.size.x)/2,(this.parent.size.y-this.size.y)/2)},css:function(t,e){var i=this._velm,n=i.css(t,e);return n==i?this:n},getStyle:function(t){return this._velm.css(t)},setStyle:function(t,e){return this._velm.css(t,e),this},data:function(t,e){var i=this._velm,n=i.data(t,e);return n==i?this:n},getData:function(t){return this._velm.data(t)},setData:function(t,e){return this._velm.data(t,e),this},parent:{get:function(){return this.getParent()},set:function(t){this.setParent(t)}},getParent:function(){return this._parent},setParent:function(t){var e=this._parent;return this._parent=t,t?(this.mount(t._elm||t.element),t._setupChild&&t._setupChild(this)):e&&this.unmount(),this},prop:function(t,e){var i=this._velm,n=i.prop(t,e);return n==i?this:n},getProp:function(t){return this._velm.prop(t)},setProp:function(t,e){return this._velm.prop(t,e),this},throb:function(t){return this.options.throbber&&(t=objects.defaults(t,this.options.throbber)),noder.throb(this._elm,t)},update:function(){this.updateVisibility(),this.visible&&(this.updateSize(),this.updateLocation())},mount:function(t,e){var i=t.element||t,n=this._elm;e&&"child"!=e?"before"==e?noder.before(i,n):"after"==e?noder.after(i,n):"prepend"==e&&noder.prepend(i,n):noder.append(i,n),this._startup()},unmount:function(){this._velm.remove()},preventDragEvents:function(){this.element.ondrop=Widget.preventDefault,this.element.ondragover=Widget.preventDefault},element:{get:function(){return this._elm},set:function(t){this._elm=t}},position:{get:function(){return this.location},set:function(t){this.location=t}},setAltText:function(t){var e=document.createElement("div");e.style.position="absolute",e.style.display="none",e.style.alignItems="center",e.style.zIndex="10000",e.style.border="3px solid",e.style.borderRadius="5px",e.style.color=Editor.theme.textColor,e.style.backgroundColor=Editor.theme.barColor,e.style.borderColor=Editor.theme.barColor,e.style.height="fit-content",document.body.appendChild(e);var i=document.createTextNode(t);e.appendChild(i);var n=this.destroy;return this.destroy=function(){n.call(this),document.body.contains(e)&&document.body.removeChild(e)},this._elm.style.pointerEvents="auto",this._elm.onmousemove=function(t){e.style.display="flex",e.style.left=t.clientX+8+"px",e.style.top=t.clientY-20+"px"},this._elm.onmouseout=function(){e.style.display="none"},e},setOnClick:function(t){this._elm.onclick=t},removeAllChildren:function(){for(;this._elm.firstChild;)this._elm.removeChild(this._elm.firstChild)},setMode:function(t){this._mode=t,this._elm.style.bottom=null,this._elm.style.right=null,this._elm.style.left=null},destroy:function(){this._parent&&(this._parent.element?this._parent.element.contains(this.element)&&(this._parent.element.removeChild(this.element),this._parent=null):(console.warn("nunuStudio: Parent is not a Element.",this),this._parent.contains(this.element)&&(this._parent.removeChild(this.element),this._parent=null)))}});return Widget.prototype.updateInterface=Widget.prototype.update,Widget.prototype.updatePosition=Widget.prototype.updateLocation,Widget.prototype.attachTo=Widget.prototype.setParent,Widget.prototype._attachTo=Widget.prototype.mount,Widget.prototype.detach=Widget.prototype.unmount,Widget.TOP_LEFT=0,Widget.TOP_RIGHT=1,Widget.BOTTOM_LEFT=2,Widget.BOTTOM_RIGHT=3,Widget.inherit=function(t){var e=plugins.Plugin.inherit.apply(this,arguments);function i(t){e.prototype[t]=function(e){return void 0!==e?(this.state.set(t,e),this):this.state.get(t)}}if(t.state)for(var n in t.state)i(n);return t.pluginName&&plugins.register(e,t.pluginName),e},Widget.register=function(t,e){var i=t.prototype,n=e||i.pluginName;function s(e){t.prototype[e]=function(t){return void 0!==t?(this.state.set(e,t),this):this.state.get(e)}}if(i.state)for(var o in i.state)s(o);return n&&plugins.register(t,n),t},Widget.preventDefault=function(t){t.preventDefault()},base.Widget=Widget});
//# sourceMappingURL=sourcemaps/Widget.js.map
