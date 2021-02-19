/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../base","./Panel"],function(t,i){"use strict";var e=i.inherit({klassName:"DualContainer",_construct:function(t){i.prototype._construct.call(this,t);var s=this.getSkin();this._elm.style.overflow="hidden",this._elm.style.backgroundColor=s.panelColor,this._elmA=null,this._elmB=null,this.resizeTab=document.createElement("div"),this.resizeTab.style.position="absolute",this.resizeTab.style.cursor="e-resize",this.resizeTab.style.backgroundColor=s.resizeTabColor,this._elm.appendChild(this.resizeTab),this.tabPosition=.5,this.tabPositionMax=.95,this.tabPositionMin=.05,this.tabSize=5,this.orientation=e.HORIZONTAL;var n=this;function o(t){n.orientation===e.HORIZONTAL?n.tabPosition+=t.movementX/n.size.x:n.orientation===e.VERTICAL&&(n.tabPosition+=t.movementY/n.size.y),n.tabPosition>n.tabPositionMax?n.tabPosition=n.tabPositionMax:n.tabPosition<n.tabPositionMin&&(n.tabPosition=n.tabPositionMin),n.updateInterface()}this.resizeTab.onmousedown=function(t){n.$(window).on("mousemove",o),n.$(window).one("mouseup",function(){n.$(window).off("mousemove",o)})}},attach:function(t){null!==this._elmA?null!==this._elmB?console.warn("nunuStudio: Cannot attach more elements."):this.attachB(t):this.attachA(t)},attachA:function(t){this._elmA=t,this._elmA.setParent(this)},attachB:function(t){this._elmB=t,this._elmB.setParent(this)},updateSize:function(){if(i.prototype.updateSize.call(this),null!==this._elmA&&null!==this._elmB){if(this.orientation===e.HORIZONTAL){var t=this.tabPosition*this.size.x;this._elmA.position.set(0,0),this._elmA.size.set(t,this.size.y),this._elmA.updateInterface(),this._elmB.size.set(this.size.x-t-this.tabSize,this.size.y),this._elmB.position.set(this._elmA.size.x+this.tabSize,0),this._elmB.updateInterface(),this.resizeTab.style.cursor="e-resize",this.resizeTab.style.top="0px",this.resizeTab.style.left=this._elmA.size.x+"px",this.resizeTab.style.width=this.tabSize+"px",this.resizeTab.style.height=this.size.y+"px"}else if(this.orientation===e.VERTICAL){t=this.tabPosition*this.size.y;this._elmA.position.set(0,0),this._elmA.size.set(this.size.x,t),this._elmA.updateInterface(),this._elmB.size.set(this.size.x,this.size.y-t-this.tabSize),this._elmB.position.set(0,this._elmA.size.y+this.tabSize),this._elmB.updateInterface(),this.resizeTab.style.cursor="n-resize",this.resizeTab.style.top=this._elmA.size.y+"px",this.resizeTab.style.left="0px",this.resizeTab.style.width=this.size.x+"px",this.resizeTab.style.height=this.tabSize+"px"}}else console.log("nunuStudio: Dual container elements are null",this,this._elmA,this._elmB)},elementA:{get:function(){return this._elmA}},elementB:{get:function(){return this._elmB}}});return e.HORIZONTAL=0,e.VERTICAL=1,t.panels.DualContainer=e});
//# sourceMappingURL=../sourcemaps/panels/DualContainer.js.map
