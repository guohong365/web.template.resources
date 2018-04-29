/**
 * 
 */
(function($) {
	var Loader = function(options) {
		this._o = {
				css : 'ajax-loading-overlay',
				icon : 'fa-spinner fa-2x orange',
				text : '<h1 class="red">加载中,请稍候...</h1>',
				anchor : 'body'
			};		
		if (typeof options === 'string') { // means container and use default options
			this._o.anchor = options;
		} else if (typeof options === 'object') {
			if (typeof options.css === 'string') {
				this._o.css = options.css;
			}
			if (typeof options.css === 'function') {
				this._o.css = options.css(optoins);
			}
			if (typeof options.icon === 'string') {
				this._o.icon = options.icon;
			}
			if (typeof options.icon === 'function') {
				this._o.icon = options.icon(options);
			}
			if (typeof options.text === 'string') {
				this._o.text = options.text;
			}
			if (typeof options.text === 'function') {
				this._o.text = options.text(options);
			}
			if (typeof options.anchor === 'string') {
				this._o.anchor = options.anchor;
			}
			if (typeof options.anchor === 'function') {
				this._o.anchor = options.anchor(options);
			}
		}

		this.$anchor = null;
	};
	Loader.prototype = {
		constructor : Loader,
		show : function(anchor) {
			var $anchor = null;
			if (anchor && typeof anchor === 'string') {
				$anchor = $(anchor);
			} else if (this._o.anchor && typeof this._o.anchor === 'string') {
				$anchor = $(this._o.anchor);
			}
			if ($anchor) {
				$anchor.css('opacity', 0.25);
				var $loader = $('<div style="position: fixed; z-index: 2000;" class="ajax-loading-overlay"><i class="ajax-loading-icon fa fa-spin '
						+ this._o.icon + '"></i> ' + this._o.text + '</div>');
				$loader.insertBefore($anchor);
				var offset = $anchor.offset();
				$loader.css({
					top : offset.top,
					left : offset.left
				});
			}
			this.$anchor = $anchor;
		},
		hide : function() {
			if (this.$anchor) {
				this.$anchor.css('opacity', 1);
				this.$anchor.prev('.' + this._o.css).remove();
			}
			this.$anchor = null;
		}
	};
	
	$.loader = {};
	$.loader.loader=function(options){
		return new Loader(optoins);
	};
	$.loader.small=function(anchor){return new Loader({anchor : anchor,	text : ''})};  

	var HtmlLoader = function(options, element) {
		this._o = {
			container : '',
			// ajax 参数
			async : true,
			url : '',
			type : 'get',
			dataType : 'html',
			data : '',

			onLoaded : null, // 成功回调
			onFailed : null, // 失败回调
			onCompleted : null,
			loadOk : function(){ return true; },
			
			noLoader : false,
			anchor : 'body',

			// gritter
			notationOnSuccess : false,
			successTitle : '成功',
			successText : '操作成功。',
			successClass : 'gritter-success',
			notationOnFailed : true,
			failedTitle : '操作失败',
			failedText : '系统错误，请联系系统管理员！',
			failedClass : 'gritter-error',
			// customize
			loader : null
		// 加载中
		};
		this.$container = null;

		var dumpOptions = function(options) {
			if (!options) {
				console.error('option is null or undefined.....');
			}
			if (typeof options === 'string') {
				constole.warn('options is string, as url');
			} else if (typeof options === 'object') {
				console.log('options is object');
				console.log('container : ' + options.container);
				console.log('----ajax options-----');
				console.log('  url : ' + options.url);
				console.log('  data : ' + options.data);
				console.log('  async : ' + options.async);
				console.log('  type : ' + options.type);
				console.log('  dataType : ' + options.dataType);
				console.log('----------------------');

				console.log('----call back------');
				console.log('  onLoaded : ' + options.onLoaded);
				console.log('  onFailed : ' + options.onFailed);
				console.log('  onCompleted : ' + options.onCompleted);
				console.log('--------------------');
				
				console.log('user load : ' + options.noLoader);
				console.log('loader container : ' + options.loaderContainer);

				console.log('----gritter-------');
				console.log('  notation on success : '
						+ options.notationOnSuccess);
				console.log('  successTitle : ' + options.successTitle);
				console.log('  successText : ' + options.successText);
				console.log('  successClass : ' + options.successClass);
				console.log('  notation on failed : '
						+ options.notationOnFailed);
				console.log('  failedTitle : ' + options.failedTitle);
				console.log('  failedText : ' + options.failedText);
				console.log('  failedClass : ' + options.failedClass);
				console.log('-------------------');
				console.log('loader : ' + options.loader);
			} else {
				console.log('unknown options type : ' + typeof options);
			}
		};

		console.log('set up html loader......')
		//console.log('input options:');
		//dumpOptions(options);
		if (typeof options === 'string') { // means url
			this._o.url = options;
		} else if (typeof options === 'object') {
			console.log('options is ' + typeof options);
			if (typeof options.container === 'string') {
				console.log('input container is string :' + options.container);
				this._o.container = options.container;
			} else if (typeof options.container === 'function') {
				this._o.container = options.container(options);
			} else{
				console.log('unknown container type :' + typeof options.container);
				
			} 
				

			if (typeof options.async === 'function')
				this._o.async = true;
			else if (options.async)
				this._o.async = true;
			else
				this._o.async = false;

			if (options.url) {
				this._o.url = options.url;
			}

			if (typeof options.type === 'string') {
				this._o.type = options.type;
			} else if (typeof options.type === 'function') {
				this._o.type = options.type(options);
			}

			if (typeof options.dataType === 'string') {
				this._o.dataType = options.dataType;
			} else if (typeof options.dataType === 'function') {
				this._o.dataType = options.dataType(options);
			}

			if (options.data) {
				this._o.data = options.data;
			}
			
			if(options.noLoader){
				this._o.noLoader=true;
			}
			if(options.anchor){
				this._o.anchor = options.anchor;
				console.log('loader container was assigned');
			} else {
				this._o.anchor = options.container;
				console.log('loader container not set, user container');
			}
			
			
			if(typeof options.onLoaded === 'function'){
				this._o.onLoaded = options.onLoaded;
			}
			if(typeof options.onFailed === 'function'){
				this._o.onFailed = options.onFailed;
			}
			if(typeof options.onCompleted === 'function'){
				this._o.onCompleted = options.onCompleted;
			}
			if(typeof options.loadOk === 'function'){
				this._o.loadOk = options.loadOk;
			}			
			
			if (typeof options.notationOnSuccess === 'function')
				this._o.notationOnSuccess = options.notationOnSuccess(options);
			else if (options.notationSuccess)
				this._o.notationSuccess = true;
			else
				this._o.notationSuccess = false;

			if (typeof options.successTitle === 'string')
				this._o.successTitle = options.successTitle;
			else if (typeof options.successTitle === 'function')
				this._o.successTitle = options.successTitle(options);
			if (typeof options.successText === 'string')
				this._o.successText = options.successTitle;
			else if (typeof options.successText === 'function')
				this._o.successText = options.successText(optons);
			if (typeof options.successClass === 'string')
				this._o.successClass = options.successClass;
			else if (typeof options.successClass === 'function')
				this._o.successClass = options.successClass(options);

			if (typeof options.notationOnFailed === 'function')
				this._o.notationOnFailed = options.notationOnFailed(options);
			else if (typeof options.notationOnFailed)
				this._o.notationOnFailed = true;
			else
				this.options.notationOnFailed = false;

			if (typeof options.failedTitle === 'string')
				this._o.failedTitle = options.failedTitle;
			else if (typeof options.failedTitle === 'function')
				this._o.failedTitle = options.failedTitle(optinos);
			if (typeof options.failedText === 'string')
				this._o.failedText = options.failedText;
			else if (typeof options.failedText === 'function')
				this._o.failedText = options.failedText(options);
			if (typeof options.failedClass === 'string')
				this._o.failedClass = options.failedClass;
			else if (typeof options.failedClass === 'function')
				this._o.failedClass = options.failedClass(options);

			if (typeof options.loader === 'object'
					&& typeof options.loader.show === 'function'
					&& typeof options.loader.hide === 'function') {
				this._o.loader = options.loader;
			} else {
				this._o.loader = new Loader(this._o);
			} 
			if (element instanceof jQuery) {
				this.$container = element;
			} else if (typeof element === 'string') {
				this.$container = $(element);
			} else {
				this.$container = $(this._o.container);
			}
		}
		console.log('final options:');
		dumpOptions(this._o);
	};
	
	HtmlLoader.prototype = {
		constructor : HtmlLoader,
		loadHtml : function(options, data, container) {			
			var opt = null;
			if (typeof options === 'string') {
				console.log('options is string, assigned to url : ' + options);
				opt = {	url : options};
			}
			if (container) {
				console.log('container set by parameter : ' + container);
				if (opt)opt.container = container;
				else opt = { container : container}
			}
			if (data) {
				console.log('data set by parameter : ' + data);
				if (opt) opt.data = '' + data;
				else opt = {data : (typeof data === 'function' ? data() : data)};
			}
			if (opt) {
				console.log('create new instance for parameter options....');
				var htmlLoader = new HtmlLoader(opt);
				htmlLoader.loadHtml();
			} else {
				console.log('loader start.......');
				var $this= this;
				if(!$this._o.noLoader){
					$this._o.loader.show();
				}
				console.log('loader shown....');
				$.ajax({
					url : (typeof $this._o.url === 'function' ? $this._o.url($this._o):$this._o.url),
					type : $this._o.type, 
					data : (typeof $this._o.data === 'function' ? $this._o.data($this._o): $this._o.data),
					dataType : $this._o.dataType
				})
				.done(function(html) {
					console.log('ajax call done....');
					
					if ($this.$container){
						$this.$container.html(html);
						console.log('load to container : ' + $this.$container.eq(0).innerHTML);
					}
					if ($this._o.loadOk() && $this._o.notationOnSuccess) {
						$.gritter.add({
							title : $this._o.successTitle,
							text : $this._o.successText,
							class_name : $this._o.successClass
							});
					}
					if ($this._o.onLoaded && typeof $this._o.onLoaded === 'function') onLoaded(html, $this._o);
				})
				.fail(function() {
					console.log('ajax call failed.....');
					if ($this._o.notationOnFailed) {
						$.gritter.add({
							title : $this._o.failedTitle,
							text : $this._o.failedText,
							class_name : $this._o.failedClass
						});
					}
					if ($this._o.onFailed && typeof $this._o.onFailed === 'function') onFailed(this._o);
				})
				.complete(function() {
					console.log('ajax call completed....');
					if(!$this._o.noLoader){
						$this._o.loader.hide();
						console.log('loader hidden....');
					}
				});
			}
		},
	};

	$.fn.loadHtml = function(options, data) {	
		console.log('load to : ' + this.eq(0).nodeName);
		var loader = new HtmlLoader(options, data);
		loader.loadHtml();
	}

}(window.jQuery));