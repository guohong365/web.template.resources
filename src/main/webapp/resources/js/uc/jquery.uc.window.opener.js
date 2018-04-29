/**
 * 
 */
(function($){
	if(!$){
		return;
	}	
	var WindowOpener=function(element, options){
		this.OPENING_EVENT_NAME='win.opening';		
		this.DOCUMENT_READY='win.ready';
		this.OPENED_EVENT_NAME='win.opend';
		this.CLOSING_EVENT_NAME='win.closing';
		this.CLOSED_EVENT_NAME='win.closed';
		
		this.NOTIFY_EVENT_NAME='win.notify';
		this.MIN_WIDTH = 100;
		this.MIN_HIEGHT= 100;
		this.DEFAULT_WIN_NAME='interactWindow';
		this.DEFAULT_FEATURES={
			width : 1024,
			height : 800,
			left : NaN,
			top : NaN,
			titlebar : true,
			resizable : true,
			scrollbars : true,
			location : false,
			menubar: false,
			status :false,
			toolbar:false,
			directories: false
		};
		this.featureString='';
		this._o={
			url : '',
			name : this.DEFAULT_WIN_NAME,
			features : {
				width : 1024,
				height : 800,
				left : NaN,
				top : NaN,
				titlebar : true,
				resizable : true,
				scrollbars : true,
				location : false,
				menubar: false,
				status :false,
				toolbar:false,
				directories: false				
			},
			parent : null,
			onChildNotify : null, // function(message){},
			onParentNotify : null, //function(message, selector){},			
			onChildOpening : null, //function(){},
			onChildOpened : null, //function(){},
			onChildClosing : null, //function(){},
			onChildClosed : null, //function(message){}	
			onDocReady : null //function(document){}
		};		
		this.child=null;
		this.$child=null;
		this.$reciever=$(element);
		this.$parent=$;
		this.setOptions(options);	
		this.parent;
		this.$reciever.on('win.opening', $proxy(this.onOpening, this));
	};
	
	WindowOpener.prototype={
		constructor : WindowSelectionReciver,
		calcCenter : function (win){
			if(win){
				var x = win.avaliWidth/2;
				var y = win.avaliHeight / 2;
				console.log('calc center:(' + x +',' + y);
				return {'x' : x, 'y': y};
			}
			return null;
		},
		getInt : function(obj, minValue, maxValue){			
			var i= intParse('' + obj);
			if(minValue && (isNaN(i) || i < minValue)){
				i=minValue;
			}
			if(maxValue && (isNaN(i) || i > maxValue)){
				i=maxValue;
			}			
			return i;
		},
		getFeatureString : function(features, win){
			if(typeof features==='string')
				return features;
			if(typeof features==='object'){
				var retStr='';
				var width;
				var height;
				if(features.width){
					width= this.getInt(features.width, this.MIN_WIDTH);
				}
				else {
					width= this._o.features.width;
				}
				retStr +='width=' + width +',';				
				if(features.height){
					height= this.getInt(features.hight, this.MIN_HEIGHT);
				}
				retStr +='height=' + height + ',';
				
				var loc=this.calcCenter(this.parent);
				var top;
				var left;
				if(features.left){
					left= this.getInt(features.left, 0);					
				} else if(!isNaN(this._o.features.left)){
					left = this._o.features.left;
				} else if(loc){
					left=loc.x - width/2;
					if(left<0)left=0;
				}
				if(!isNaN(left)){
					retStr +='left=' + left + ',';
				}				
				if(features.top){
					top= this.getInt(features.top)
				} else if(!isNaN(this._o.features.top)){
					top = this._o.features.top;
				} else if(loc){
					top = loc.y - height/ 2;
					if(top<0)top=0;
				}
				if(!isNaN(top)){
					retStr +='top=' + top + ',';
				}
				var on;
				on =(typeof features.location !='undefine') ? features.location: this._o.features.location;
				retStr +='location=' + (on?'yes,':'no,');

				on=(typeof features.menubar!='undefine') ? features.menubar: this._o.features.menubar;
				retStr +='menubar=' + (on?'yes,':'no,');
				
				on=(typeof features.status!='undefine')?features.staturs : this._o.features.status;
				retStr += 'status=' + (on? 'yes,':'no,');
				
				on=(typeof features.toolbar!='undefine') ? features.toolbar : this._o.features.toolbar;
				retStr += 'toolbar=' +(on?'yes,':'no,');
				
				on=(typeof features.directories!='undefine')? features.directories: this._o.features.directories;
				retStr += 'directories=' + (on?'yes':'no');
				
				on=(typeof features.titlebar != 'undefine')? features.titlebar : this._o.features.titlebar;
				retStr += 'titlebar=' + (on?'yes,':'no,');
				
				on=(typeof features.resizable != 'undefine')? features.resizable : this._o.features.resizable;
				retStr += 'resizable=' + (on?'yes,':'no,');
				
				on=(typeof features.scrollbars != 'undefine')? features.scrollbars : this._o.features.scrollbars;
				retStr += 'scrollbars=' + (on?'yes,':'no,');
				if(typeof options.onParentNotify ==='function'){
					this._o.onParentNotify = options.onParentNotify;
				}
				if(typeof options.onChildNotify === 'function'){
					this._o.onChildNotify = options.onChildNotify;
				}
				if(typeof options.onChildClosing === 'function'){
					this._o.onChildClosing= options.onChildClosing;
				}
				if(typeof options.onChildClosed === 'function'){
					this._o.onChildClosed = options.onChildClosed;
				}
				if(typeof options.onChildOpening ==='function'){
					this._o.onChildOpening = options.onChildOpening;
				}
				if(typeof options.onChildOpened ==='function'){
					this._o.onChildOpened = options.onChildOpened;
				}
				if(typeof options.onDocReady ==='function'){
					this._o.onDocReady = options.onDocReady;
				}
				this.featureString=retStr;
			}
			return this.featureString;
		},
		setOptions : function(options){
			this._o.features.width=this.DEFAULT_FEATURES.width;
			this._o.features.height=this.DEFAULT_FEATURES.height;
			this._o.features.left=this.DEFAULT_FEATURES.left;
			this._o.features.top = this.DEFAULT_FEATURES.top;
			this._o.features.location = this.DEFAULT_FEATURES.location;
			this._o.features.menubar=this.DEFAULT_FEATURES.menubar;
			this._o.features.status=this.DEFAULT_FEATURES.status;
			this._o.features.directories=this.DEFAULT_FEATURES.directories;
			this._o.features.toolbar=this.DEFAULT_FEATURES.toolbar;
			this._o.features.titlebar=this.DEFAULT_FEATURES.titleaar;
			this._o.features.resizable=this.DEFAULT_FEATURES.resizable;
			this._o.features.scrollbars=this.DEFAULT_FEATURES.scrollbars;
			
			if(!options || (typeof options!='object')){
				return;
			}
			if(typeof options.url=== 'string'){
				this._o.url = options.url;
			} else if(typeof options.url ==='function'){
				this._o.url = options.url();
			} else if(typeof options.url ==='undefine') {
				this._o.url = '';
			} else {
				this._o.url ='' + options.url;
			}
			if(typeof options.name=== 'string'){
				this._o.name = options.name;
			} else if(typeof options.name==='function'){
				this._o.name = options.name();
			} else if(typeof options.name === 'undefine'){
				this._o.name = '';
			} else {
				this._o.name = '' + options.name;
			}
			
			if($.isWindow(options.parent)){
				this._o.parent = options.parent;
				this.parent = options.parent;
			}
			if(typeof options.onNotify==='function'){
				this._o.noNotify = options.onNotify;
			}			
		},
		
		open : function(url, name, features){
			if(typeof name==='string'){
				this._o.name=name;
			}
			if(typeof name==='function'){
				this._o.name=name();
			}
			if(features){
				this._o.features= features;
			}
			if(this.$reciever.triggerHandler(this.OPENING_EVENT_NAME)==false){
				return null;
			}
			if($.isWindow(this.parent)){
				this.parent=window;
			}
			this.child=this.parent.open(url, name, this.getFeatureString(this._o.features));
			$.data(this.child,'windowOpener', this);			
			$(this.child).on('unload', $.proxy(this.onClosed, this));
			$(this.child).on('beforeunload', $.proxy(this.onClosing, this));	
			$(this.child).on('ready', $.proxy(this.onReady, this));
			this.$reciever.triggerHandler(this.OPENED_EVENT_NAME);
			return this.child;
		},
		onReady : function(event){
			this.$reciever.triggerHandler(this.DOCUMENT_READY, this.child.document);
		},
		onClosing : function(){
			this.$reciever.triggerHandler(this.CLOSING_EVENT_NAME);
		},
		onClosed : function(){
			this.child =null;
			this.$reciever.triggerHandler(this.CLOSED_EVENT_NAME);			
		},
		close : function(){
			onClosing();
			this.child.close();
			onClosed();
		},
		onNotify : function(event){
			this._o.onNotify(event.data);
		},
		notify : function (message, target){
			if(target){
				$(target).triggerHandler(this.NOTIFY_EVENT_NAME, message);
			} else {
				this.$reciever.triggerHandler(this.NOTIFY_EVENT_NAME, message);
			}
		}
	};
	
	$.fn.bindWindowOpener=function(options){
		this.each(function(){
			var el=$(this);
			if(el.data('windowOpener')){
				el.removeData('windowOpener');
			}
			el.data('windowOpener', new WindowOpener(el, options));
		});
	}
	$.fn.getWindowOpener=function(win){
		if(win){
			return $(win).data('windowOpener');
		}
		return $(window).data('windowOpener');
	}
	
}(window.jQuery));