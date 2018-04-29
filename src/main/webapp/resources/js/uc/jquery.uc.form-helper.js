/**
 * 
 */
(function($){
	var KeyMoveFocusFormBinder=function(element, options, selector){
		this.KEYS={
			RIGHT_ARROW : 39,
			LEFT_ARROW : 37,
			UP_ARROW : 38,
			DOWN_ARROW : 40,
			ENTER : 13
		};
		this.LEFT_RIGHT_KEY="LEFT_RIGHT_KEY";
		this.UP_DOWN_KEY="UP_DOWN_KEY";
		this.ENTER_KEY="ENTER_KEY";
		this._o={
			keys: this.LEFT_RIGHT_KEY,	
			nextKey : this.KEYS.RIGHT_ARROW,
			prevKey : this.KEYS.LEFT_ARROW,	
			loop : false,
			useEnter: true
		};
		this._selector=':input';
		this.setOptions(options);
		if(typeof selector==='string'){
			this._selector=selector;
		}		
		if(this._selector){
			$(element).on('keydown', this._selector, $.proxy(this.onKeyDown, this));
		}
	};
	
	KeyMoveFocusFormBinder.prototype={
		constructor: KeyMoveFocusFormBinder,
		setOptions : function(options){
			if(typeof options==='object') {				
				if(typeof options.nextKey ==='integer' &&
					typeof options.prevKey==='integer') {
					this._o.nextKey=options.nextKey;					
					this._o.prevKey=options.prevKey;					
				} else if(typeof options.keys ==='string'){
					if(options.keys === this.UP_DOWN_KEY){
						this._o.nextKey=this.KEYS.DOWN_ARROW;
						this._o.prevKey=this.KEYS.UP_ARROW;
					}
				}
				
				if(typeof options.loop ==='boolean'){
					this._o.loop=options.loop;
				}
				if(typeof options.loop ==='string'){ 
					if(options.loop==='true'){
						this._o.loop=true;
					} else {
						this._o.loop=false;
					}
				}
				if(typeof options.useEnter==='boolean'){
					this._o.useEnter=options.useEnter;
				} else if(typeof options.useEnter==='string'){
					if(options.useEnter==='false'){
					this._o.useEnter=false;
					} else {
						this._o.useEnter=true;
					}
				}
			}
		},
		onKeyDown : function(event){
			console.log('key down:' + event.which);
			if(event.which==this._o.nextKey){
				if(this.moveNext(event.target)){
					return false;
				};
			} else if(event.which==this._o.prevKey){
				if(this.movePrev(event.target)){
					return false;
				}
			} else if(event.which==this.KEYS.ENTER){
				if($(event.target).is('button, input [type="button"]')){
					return true;
				}
				this.moveNext(event.target);
				return false;
			}			
			return true;
		},
		onKeyUp : function (event){
			if(event.which==this._o.nextKey ||
				event.which==this._o.prevKey ||
				event.which==this.KEYS.ENTER){
				return false;
			}
		},
		_needMoveNext : function (current, isEnter){
			if($(current).is(':text')){
				if(document.selection){ //ie before ie 11
				} else if(current.selectionEnd){ //ie 9 or firefox
					var end=current.selectionEnd;
					if( current.value.length > 0 && end < current.value.length){
						return false;						
					}
				} 
			}			
			return true;
		},
		_needMovePrev : function(current){
			if($(current).is(':text')){
				if(document.selection){
					
				} else if(current.selectionStart){
					return false;
				}
			}
			return true;
		},
		moveNext : function(currentElement){
			if(this._needMoveNext(currentElement)){
				var elements=$(this._selector).not(':hidden').not(':disabled');
				var index=elements.index(currentElement);
				var nextIndex=index + 1;
				if(index< elements.length -1 ){
					elements.eq(nextIndex).focus();
					return true;
				} else if(this._o.loop){
					elements.eq(0).focus();
					return true;
				}
			}
			return false;
		},
		movePrev : function(currentElement){
			if(this._needMovePrev(currentElement)){
				var elements=$(this._selector).not(':hidden').not(':disabled');
				var index=elements.index(currentElement);
				var nextIndex=index - 1;
				if(nextIndex >= 0){
					elements.eq(nextIndex).focus();
					return true;
				} else if(this._o.loop){
					elements.eq(elements.length-1).focus();
					return true;
				}
			}
			return false;
		}		
	};
	
	$.fn.bindKeyMoveForm=function(selector, options){
		this.each(function(){
			var el=$(this);
			if(el.data('keyMoveForm')){
				el.removeData('keyMoveForm');
			}
			el.data('keyMoveForm', new KeyMoveFocusFormBinder(el, options, selector));
		});
	};
}(window.jQuery));