/**
 * skylark-widgets-base - The skylark widget base library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-widgets-base/base',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("widgets.base",{});
});
Acdefine([
	"skylark-langx/Evented",
	"./base"
], function(Evented,base){

	var ActionManager = Evented.inherit({
		"klassName"		:	"Manager",


		addAction : function(category,name,fn,options) {

		},

		executeAction : function() {

		},

		removeAction : function(category,name) {

		}

	});

	return base.ActionManager = ActionManager;

});


define("skylark-widgets-base/ActionManager", function(){});

define('skylark-widgets-base/Action',[
	"skylark-langx/Evented",
	"skylark-data-collection/HashMap",
	"./base",
	"./ActionManager"
], function(Evented, HashMap, base, ActiionManager){

	var Action = Evented.inherit({
		"klassName" : "Action",

		"category" : {
			//desc : "Group or category where the action belongs.",
			//type : String
			get : function() {
				return this._options.category;
			}
		},

		"state"  : {
			get : function() {
				return  this._state || (this._state = new HashMap({
					checked : false,
					disabled : false
				}));
			}
		},

		"checked" : {
			//desc : "Indicates whether client controls and menu items appear checked.",
			//type : Boolean
			get : function() {
				return this._options.checked;
			}
		},

		"icon" : {
			//desc : "Represents the icon class of the action.",
			//type : String
			get : function() {
				return this._options.icon;
			}
		},

		"text" : {
			//desc : "Represents the caption of the action.",
			//type : String
			get : function() {
				return this._options.text;
			},
			set : function(value) {
				if (this._options.text !== value) {
					this._options.text = value;
					this.trigger("checkingDisabled");
					if (this._setDisabled) {
						this._setDisabled();
					}
				}				
			}
		},

		"name" : {
			//desc : "Represents the caption of the action.",
			//type : String
			get : function() {
				return this._name;
			}
		},

		"shortcut" : {
			//desc : "Shortcut that triggers the action.",
			//type : String
			get : function() {
				return this._options.shortCut;
			}
		},
		
		"tooltip" : {
			//desc : "Stores the Help hint text.",
			//type : String
			get : function() {
				return this._options.tooltip;
			}
		},

		"disabled" : {
			//type : Boolean
			get : function() {
				return this._options.disabled;
			},

			set : function(value) {
				if (this._options.disabled !== value) {
					this._options.disabled = value;
					if (this._setDisabled) {
						this._setDisabled();
					}
				}				
			}
		},


	    /**
	     * Executes the command. Additional arguments are passed to the executing function
	     *
	     * @return {$.Promise} a  promise that will be resolved when the command completes.
	     */
		execute: function(){
			if (this._execute) {
				this._execute();
			}
			this.trigger("executed");
		},

        disabled: function(context) {
        	var e = this.trigger("checkingDisabled");
        	if (e && e.result) {
        		return false;
        	} else {
            	return true;
        	}
        },

        shouldShow: function(context) {
        	var e = this.trigger("checkingHidden");
        	if (e && e.result) {
        		return false;
        	} else {
            	return true;
        	}
		},

		option : function(key) {
			return this._options[key];
		},

		"init":	 function(name,options){
			this._name = name;
			this._options = options || {};
		}
	
	});
	
	return base.Action = Action;
});



define('skylark-widgets-base/Widget',[
  "skylark-langx/skylark",
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-data",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-velm",
  "skylark-domx-query",
  "skylark-domx-plugins",
  "skylark-data-collection/HashMap",
  "./base"
],function(skylark,langx,browser,datax,eventer,noder,geom,elmx,$,plugins,HashMap,base){

/*---------------------------------------------------------------------------------*/

	var Widget = plugins.Plugin.inherit({
    klassName: "Widget",

    _elmx : elmx,

    _construct : function(elm,options) {
        if (langx.isHtmlNode(elm)) {
          options = this._parse(elm,options);
        } else {
          options = elm;
          elm = null;
        }
        this.overrided(elm,options);

        if (!elm) {
          this._velm = this._create();
          this._elm = this._velm.elm();
        } else {
          this._velm = elmx(this._elm);
        }
        
        Object.defineProperty(this,"state",{
          value :this.options.state || new HashMap()
        });

        //this.state = this.options.state || new Map();
        this._init();

        var addonCategoryOptions = this.options.addons;
        if (addonCategoryOptions) {
          var widgetCtor = this.constructor,
              addons = widgetCtor.addons;
          for (var categoryName in addonCategoryOptions) {
              for (var i =0;i < addonCategoryOptions[categoryName].length; i++ ) {
                var addonOption = addonCategoryOptions[categoryName][i];
                if (langx.isString(addonOption)) {
                  var addonName = addonOption,
                      addonCtor = addons[categoryName][addonName];

                  this.addon(addonCtor);

                }

              }
          }


        }


     },

    /**
     * Parses widget options from attached element.
     * This is a callback method called by constructor when attached element is specified.
     * @method _parse
     * @return {Object} options.
     */
    _parse : function(elm,options) {
      var optionsAttr = datax.data(elm,"options");
      if (optionsAttr) {
         var options1 = JSON.parse("{" + optionsAttr + "}");
         options = langx.mixin(options1,options); 
      }
      return options || {};
    },


    /**
     * Create html element for this widget.
     * This is a callback method called by constructor when attached element is not specified.
     * @method _create
     */
    _create : function() {
        var template = this.options.template;
        if (template) {
          return this._elmx(template);
        } else {
          throw new Error("The template is not existed in options!");
        }
    },


    /**
     * Init widget.
     * This is a callback method called by constructor.
     * @method _init
     */
    _init : function() {
      var self = this;
      if (this.widgetClass) {
        this._velm.addClass(this.widgetClass);
      }
      this.state.on("changed",function(e,args) {
        self._refresh(args.data);
      });
    },


    /**
     * Startup widget.
     * This is a callback method called when widget element is added into dom.
     * @method _post
     */
    _startup : function() {

    },


    /**
     * Refresh widget.
     * This is a callback method called when widget state is changed.
     * @method _refresh
     */
    _refresh : function(updates) {
      /*
      var _ = this._,
          model = _.model,
          dom = _.dom,
          props = {

          };
      updates = updates || {};
      for (var attrName in updates){
          var v = updates[attrName].value;
          if (v && v.toCss) {
              v.toCss(props);
              updates[attrName].processed = true;
          }

      };

      this.css(props);

      if (updates["disabled"]) {
          var v = updates["disabled"].value;
          dom.aria('disabled', v);
          self.classes.toggle('disabled', v);
      }
      */
    },                

    mapping : {
      "events" : {
  //       'mousedown .title':  'edit',
  //       'click .button':     'save',
  //       'click .open':       function(e) { ... }            
      },

      "attributs" : {

      },

      "properties" : {

      },

      "styles" : {

      }
    },

    addon : function(ctor,setting) {
      var categoryName = ctor.categoryName,
          addonName = ctor.addonName;

      this._addons = this.addons || {};
      var category = this._addons[categoryName] = this._addons[categoryName] || {};
      category[addonName] = new ctor(this,setting);
      return this;
    },

    addons : function(categoryName,settings) {
      this._addons = this.addons || {};
      var category = this._addons[categoryName] = this._addons[categoryName] || {};

      if (settings == undefined) {
        return langx.clone(category || null);
      } else {
        langx.mixin(category,settings);
      }
    },


    /**
     * Returns a html element representing the widget.
     *
     * @method render
     * @return {HtmlElement} HTML element representing the widget.
     */
    render: function() {
      return this._elm;
    },


    /**
     * Returns a parent widget  enclosing this widgets, or null if not exist.
     *
     * @method getEnclosing
     * @return {Widget} The enclosing parent widget, or null if not exist.
     */
    getEnclosing : function(selector) {
      return null;
    },

    /**
     * Returns a widget collection with all enclosed child widgets.
     *
     * @method getEnclosed
     * @return {List} Collection with all enclosed child widgets..
     */
    getEnclosed : function() {
      var self = this;
          children = new ArrayList();
      return children;
    },

    /**
     * Sets the visible state to true.
     *
     * @method show
     * @return {Widget} Current widget instance.
     */

    show : function() {
      this._velm.show();
    },

    /**
     * Sets the visible state to false.
     *
     * @method hide
     * @return {Widget} Current widget instance.
     */
    hide : function() {
      this._velm.hide();
    },

    /**
     * Focuses the current widget.
     *
     * @method focus
     * @return {Widget} Current widget instance.
     */
    focus :function() {
      try {
        this._velm.focus();
      } catch (ex) {
        // Ignore IE error
      }

      return this;
    },

    /**
     * Blurs the current widget.
     *
     * @method blur
     * @return {Widget} Current widget instance.
     */
    blur : function() {
      this._velm.blur();

      return this;
    },

    enable: function () {
      this.state.set('disabled',false);
      return this;
    },

    disable: function () {
      this.state.set('disabled',true);
      return this;
    },

    /**
     * Sets the specified aria property.
     *
     * @method aria
     * @param {String} name Name of the aria property to set.
     * @param {String} value Value of the aria property.
     * @return {Widget} Current widget instance.
     */
    aria : function(name, value) {
      const self = this, elm = self.getEl(self.ariaTarget);

      if (typeof value === 'undefined') {
        return self._aria[name];
      }

      self._aria[name] = value;

      if (self.state.get('rendered')) {
        elm.setAttribute(name === 'role' ? name : 'aria-' + name, value);
      }

      return self;
    },

    attr: function (name,value) {
        var velm = this._velm,
            ret = velm.attr(name,value);
        return ret == velm ? this : ret;
    },

    css: function (name, value) {
        var velm = this._velm,
            ret = velm.css(name, value);
        return ret == velm ? this : ret;
    },

    data: function (name, value) {
        var velm = this._velm,
            ret = velm.data(name,value);
        return ret == velm ? this : ret;
    },

    prop: function (name,value) {
        var velm = this._velm,
            ret = velm.prop(name,value);
        return ret == velm ? this : ret;
    },

    throb: function(params) {
      return noder.throb(this._elm,params);
    },


    /**
     *  Attach the current widget element to dom document.
     *
     * @method attach
     * @return {Widget} This Widget.
     */
    attach : function(target,position){
        var elm = target;
        if (!position || position=="child") {
            noder.append(elm,this._elm);
        } else  if (position == "before") {
            noder.before(elm,this._elm);
        } else if (position == "after") {
            noder.after(elm,this._elm);
        }
        this._startup();
    },

    /**
     *  Detach the current widget element from dom document.
     *
     * @method html
     * @return {HtmlElement} HTML element representing the widget.
     */
    detach : function() {
      this._velm.remove();
    }
  });

  Widget.inherit = function(meta) {
    var ctor = plugins.Plugin.inherit.apply(this,arguments);

    function addStatePropMethod(name) {
        ctor.prototype[name] = function(value) {
          if (value !== undefined) {
            this.state.set(name,value);
            return this;
          } else {
            return this.state.get(name);
          }
        };
    }
    if (meta.state) {
      for (var name in meta.state) {
          addStatePropMethod(name);
      }
    }

    if (meta.pluginName) {
      plugins.register(ctor,meta.pluginName);
    }
    return ctor;
  };

  Widget.register = function(ctor,widgetName) {
    var meta = ctor.prototype,
        pluginName = widgetName || meta.pluginName;

    function addStatePropMethod(name) {
        ctor.prototype[name] = function(value) {
          if (value !== undefined) {
            this.state.set(name,value);
            return this;
          } else {
            return this.state.get(name);
          }
        };
    }
    if (meta.state) {
      for (var name in meta.state) {
          addStatePropMethod(name);
      }
    }

    if (pluginName) {
      plugins.register(ctor,pluginName);
    }
    return ctor;
  };

	return base.Widget = Widget;
});

define('skylark-widgets-base/main',[
	"./base",
	"./Action",
	"./ActionManager",
	"./Widget"
],function(base){
	return base;
});
define('skylark-widgets-base', ['skylark-widgets-base/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-base.js.map
