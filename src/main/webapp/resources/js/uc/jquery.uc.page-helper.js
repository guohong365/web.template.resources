/**
 * 
 */
(function($) {
	var ListPageOperatorBinder = function(options, element) {
		this._o = {
			bindSorter : true,   
			bindAction : true,
			bindPagation : true,
			bindExport : true,
			bindColumnSelect : true,
			bindDetailInput :true,
			actionAttr : 'data-action',
			actionItem : 'data-item',	
			
			anchor : '.page-content-area',			
			baseUrl : '',
			detailUrl : '',
			refreshUrl : '',
			listUrl : '',
			exportUrl : '',
			selectColumnUrl :'',	
			beforeClickAction: null,
			afterClickAction:null,
			beforeSave : function(){
				return true;
			},
			afterSave : function() {
				$('[id="pageCtrl.total"').val('-1');	
				$('[id="pageCtrl.offset"').val('-1');
				return true;
			},
			closeAfterSave: true,
			reset : function() {
				// $('#queryInput').reset(); 
			},
			getDetailData : null
		};
		console.info('set up options....');
		this.setOption(options);
		
		$('[data-rel="tooltip"]').tooltip();
		var binder=this;
		$(element).on('click', '#btnReset', $.proxy(this.onClickReset, binder));
		console.info('search from reset button is binded...... ');
		$(element).on('click', '#btnSearch', $.proxy(this.onClickSearch,binder));
		console.info('search form search button is binded......');
		if(this._o.bindAction){
			$(element).on('click', '[' + this._o.actionAttr +']', $.proxy(this.onClickAction, binder));
			console.info('action with ['+ this._o.actionAttr +'] buttons are binded ......');
		} else {
			console.warn('action buttons are not binded......');
		}
		if(this._o.bindSorter){
			$(element).on('click', '[data-column]', $.proxy(this.onClickSortingColumn,binder));
			console.info('sort columns are binded......');
		} else {
			console.warn('sort columns are not binded.....')
		}
		if(this._o.bindDetailInput){
			$(element).on('submit','#detailInput', $.proxy(this.onSubmitDetail, binder));
			console.info('detail input form is binded.......');
		} else {
			console.warn('detail input form is not binded......')
		}
		if(this._o.bindPagation){
			$(element).on('click', '[data-page]', $.proxy(this.onPagationClicked, binder));
			console.info('pagation buttons are binded.....');
		} else {
			console.warn('pagation buttons are not binded.......');
		}
		
		if(this._o.bindExport){
			$(element).on('click', '[data-export]', $.proxy(this.onClickExport, binder));
			console.info('export button is binded.....');
		} else {
			console.warn('exprot button is not binded.....');
		}
		if(this._o.bindColumnSelect){
			$(element).on('click', '[data-column-select]', $.proxy(this.onClickSelectColumn, binder));
			$(element).on('submit', '#columns-form', $.proxy(this.onSubmitColumnSelection, binder));
			console.info('column select button is binded......');			
		} else {
			console.warn('column select button is not binded.......');
		}
		//TODO 添加自定义事件，完成内部功能的调用
		
		//page.binder.refresh
		$(element).on('page.binder.refresh', function(){
			$(this).data('pageBinder').onRefresh();
		});
		
	};

	ListPageOperatorBinder.prototype = {
		constructor : ListPageOperatorBinder,
		
		setOption : function(options) {
			console.log('optoins type is :' + typeof options);			
			if (typeof options === 'object') {
				if (typeof options.bindSorter === 'boolean') {
					console.info('options set sorter:' + options.bindSorter);
					this._o.bindSorter = options.bindSorter;
				}
				if (typeof options.bindAction === 'boolean') {
					console.info('options set bind to action: ' + options.bindAction);
					this._o.bindAction = options.bindAction;
				}
				if (typeof options.bindPagation === 'boolean') {
					console.debug('options set bind to pagatoin : ' + options.bindPagation);
					this._o.bindPagation = options.bindPagation;
				}
				if (typeof options.bindExport==='boolean'){
					console.debug('options set bind to export :' + options.bindExport);
					this._o.bindExport=ontions.bindExport;
				}
				if(typeof options.bindDetailInput === 'boolean'){
					console.debug('options set bind to detailInput:' + options.bindDetailInput);
					this._o.bindDetailInput=options.bindDetailInput;
				}
				if(typeof options.bindColumnSelect === 'boolean'){
					console.debug('options set bint to columnSelect' +  options.bindColumnSelect);
					this._o.bindColumnSelect=options.bindColumnSelect;
				}
				
				if(typeof options.actionAttr === 'string'){
					console.debug('options set action attr : ' + options.actionAttr );
					this._o.actionAttr=options.actionAttr;
				}
				if(typeof options.actionItem === 'string'){
					console.debug('options set action item : ' + options.actionItem );
					this._o.actionItem=options.actionItem;
				}
				
				if(typeof options.baseUrl === 'string'){
					this._o.baseUrl = options.baseUrl;
					this._o.detailUrl = this._o.baseUrl + '/detail';
					this._o.listUrl = this._o.baseUrl + '/list';
					this._o.refreshUrl = this._o.baseUrl + '/table';
					this._o.exportUrl = this._o.baseUrl + '/export';
					this._o.selectColumnUrl = this._o.baseUrl + '/columns';					
				}
				
				if (typeof options.detailUrl === 'string') {
					console.info('options set detail url :' + options.detailUrl);
					this._o.detailUrl = options.detailUrl;
				}
				if (typeof options.refreshUrl === 'string') {
					console.info('optoins set refresh url : '+ options.refreshUrl);
					this._o.refreshUrl = options.refreshUrl;
				}
				if(typeof options.listUrl === 'string'){
					console.info('options set list url: ' + options.listUrl);
					this._o.listUrl=options.listUrl;
				}
				if(typeof options.exportUrl==='string'){
					console.info('options set export url:' + options.exportUrl);
					this._o.exportUrl = options.exportUrl;
				}
				if(typeof options.selectColumnUrl === 'string'){
					console.info('options set column selection url:' + options.selectColumnUrl);
					this._o.selectColumnUrl = options.selectColumnUrl;
				}
				
				if(typeof options.closeAfterSave ==='boolean') {
					console.info('options set close after save as :' + options.closeAfterSave);
					this._o.closeAfterSave=options.closeAfterSave;
				}
				if (typeof options.afterSave === 'function') {
					console.info('afterSave overrided....');
					this._o.afterSave = options.afterSave;
				}
				if (typeof options.beforeSave === 'function'){
					console.info('beforeSave overrided...');
					this._o.beforeSave= options.beforeSave;
				}
				if (typeof options.reset == 'function') {
					console.info('reset overried...')
					this._o.reset = options.reset;
				}
				if(typeof options.afterClickAction =='function'){
					
					this._o.afterClickAction=options.afterClickAction;
				}
				if(typeof options.beforeClickAction=='function'){
					this._o.beforeClickAction=options.beforeClickAction;
				}
				this.dumpOptions(this._o);
				return;
			} else if (typeof options === 'function') {
				console.info('set options by callback....');
				optoins(this._o);
				this.dumpOptions(this._o);
				return;
			}
			alert('default optioins is not allowed!');
		},
		
		dumpOptions: function(o){
			console.info('options: ');
			console.info('  bindSorter=[' + o.bindSorter +']');			
			console.info('  bindAction=[' + o.bindAction + ']');
			console.info('  bindPagation=[' + o.bindPagation + ']');
			console.info('  bindExport=[' + o.bindExport +']');
			console.info('  bindColumnSelect=[' + o.bindColumnSelect + ']');
			console.info('  bindDetailInput=[' + o.bindDetailInput +']');
			
			console.info('  actionAttr=['+ o.actionAttr +']');
			console.info('  actionItem=['+ o.actionItem +']');
				
			console.info('  baseUrl=[' + o.baseUrl +']');
			console.info('  detailUrl=[' + o.detailUrl + ']');
			console.info('  refreshUrl=[' + o.refreshUrl +']');
			console.info('  listUrl=[' + o.listUrl + ']');
			console.info('  exportUrl=[' + o.exportUrl + ']');
			console.info('  selectColumnUrl=[' + o.selectColumnUrl + ']');
			console.info('  closeAfterSave=['+ o.closeAfterSave +']');
		},
		

		onClickSearch : function(event) {
			var loading_icon = 'fa-spinner fa-2x orange';
			var loading_text = '<h1 class="red">加载中,请稍候...</h1>';
			var contentArea = $('.page-content-area');
			//alert(contentArea.html());
			contentArea.css('opacity', 0.25)
			
			var loader = $('<div style="position: fixed; z-index: 2000;" class="ajax-loading-overlay"><i class="ajax-loading-icon fa fa-spin '+loading_icon+'"></i> '+loading_text+'</div>').insertBefore(contentArea);
			var offset = contentArea.offset();
			loader.css({top: offset.top, left: offset.left})
			event.preventDefault();
			$.ajax({
				type : 'POST',
				url : this._o.listUrl,
				data : $('#queryInput').serialize(),
				dataType : 'html'
			})
			.done(function(data) {
			  $('#listResult').html(data);
			})
			.fail(function() {
			  $.utils.notice('查询','系统错误，查询失败!','gritter-error');				
			  console.error('search error');
			})
			.always(function(){
				contentArea.css('opacity', 1);
				contentArea.prevAll('.ajax-loading-overlay').remove();
			});
		},
		onClickReset : function(event) {
			if (typeof this._o.reset === 'function') {
				this._o.reset();
			} else {
				// $('#queryInput').reset();
			}
			return false;
		},
		onRefresh : function() {
			$('#listResult').loadHtml({
				container : '#listResult',
				anchor : this._o.anchor,
				url : this._o.refreshUrl,
				data : $('#FORM_TABLE_FUNCTION').serialize(),
				type : 'post',
				notationOnSuccess : false,
				notationOnFailed : true,
				failedTitle : '查询',
				failedText : '系统错误，查询失败!'
			});			
		},

		onClickAction : function( event ) {			
			console.log('action clicked : actionAttr[' + this._o.actionAttr + ']')
			var actionName = $(event.target).attr(this._o.actionAttr);
			
			console.log('action button clicked: ' + actionName);
			var action = $('#action');
			action.val(actionName);
			console.log('action value=' + action.val());
			var selectedId =$(event.target).attr(this._o.actionItem);			
			$('#selectedId').val(selectedId);			
			console.log('event.taget: ' + event.target);			
			if(this._o.beforeClickAction && typeof this._o.befroeClickAction == 'function'){
				this._o.beforeClickAction(actionName);
			}
			$this=this;
			$.ajax({
				async: true,
				type : "GET",
				url : this._o.detailUrl,
				data : $('#FORM_TABLE_FUNCTION').serialize(),
				dataType : "html"
			}).done(function(data) {
				console.log('detail dialog loaded....');
				$('#dialogPanel').html(data);
				$('#detail-dialog').modal('show');
			}).fail(function(xhr, code, exp) {
				$.gritter.add({
					title:'加载',
					text:'系统错误，加载页面失败，请联系系统管理员',
					class_name:'gritter-error'
				});
			}).complete(function(){
				if($this._o.afterClickAction && typeof $this._o.afterClickAction=='function'){
					$this._o.afterClickAction(actionName, selectedId);
				}
			});
			return false;
		},
		onClickSortingColumn : function(event) {
			var columnName = $(event.target).attr('data-column');
			console.log('column [' + columnName + '] clicked for sorting');			
			if ($(event.target).attr('data-active')==='true') {
				console.log('same column clicked, just toggle');
				this.toggleOrder($('[id="queryInput.queryOrder"]'));
			} else {
				$('[id="queryInput.queryOrder"]').val('asc');
				$('[id="queryInput.queryOrderBy"]').val(columnName);
			}
			console.log('order =' + $('[id="queryInput.queryOrder"]').val());
			console.log('orderby=' + $('[id="queryInput.queryOrderBy"]').val());			
			this.onRefresh();
		},
		toggleOrder : function(target) {
			console.log('---toggle order----');
			var order = target.val();
			console.log('-- old order=' + order);
			if (!order || order === 'desc') {
				target.val('asc');
			} else {
				target.val('desc');
			}
			console.log('current order=' + target.val());
		},
		
		onPagationClicked : function(event) {		
			var pageAction = $(event.target).attr('data-page');
			console.log('page to' + pageAction);
			console.log("total " +$('input[id="pageCtrl.total"').val());
			console.log("offset " + $('input[id="pageCtrl.offset"').val());
			console.log("page size " + $('input[id="pageCtrl.pageSize"').val());
			
			var offset = parseInt($('input[id="pageCtrl.offset"]').val());
			var size= parseInt($('input[id="pageCtrl.pageSize"]').val());
			var total=parseInt($('input[id="pageCtrl.total"]').val());
			console.log("total=" + total + ", offset=" + offset + ", size=" + size);
			switch (pageAction) {
			case "first":				
				offset = 0;
				break;
			case "prior":
				if(offset >= size) offset = offset - size;
				else offset = 0;				
				break;
			case "next":
				if(total - offset > size) offset = offset + size;
				break;
			case "last":
				offset = total % size && total >= size ? (total/size - 1) * size : total/size;
				break;
			default:
				break;
			}
			$('input[id="pageCtrl.offset"]').val(offset);
			this.onRefresh();
			return false;
		},
		onSubmitDetail : function( event ) {
			event.preventDefault();
			$("#btnSave").attr("disabled", true);
			if (!$("#detailInput").valid()) {
				$("#btnSave").attr("disabled", false);
				return false;
			}
			if (this._o.beforeSave && typeof this._o.beforeSave ==='function'){
				console.log('have beforeSave function。。。。')
				if(!this._o.beforeSave()){
					$("#btnSave").attr("disabled", false);
					return false;
				}
			}
			console.log('this :' + this._o.detailUrl);
			
			var saveData='';
			if(this._o.getDetailData && typeof this._o.getDetailData==='function'){
				saveData=this._o.getDetailData();
			} else {
				saveData = $("#detailInput").serialize();
			}
			$this=this;
			console.log('saveData:' + saveData);
			$.ajax({
				type : "POST",
				url : this._o.detailUrl,
				data : saveData,
				dataType : "text"
			}).done(function(data) {
				if(data==='OK'){
				  $.gritter.add({
					  title:'保存',
					  text:'保存成功！',
					  class_name:'gritter-success'
				  });
				} else{
				  $.gritter.add({
					  title:'保存',
					  text:'保存失败！',
					  class_name:'gritter-error'
				  });	
				}
			}).fail(function(xhr, data, exp) {
				$.gritter.add({
					title:'保存',
					text:'系统错误，请联系系统管理员！',
					class_name:'gritter-error'
				});
			})
			.complete(function(){
				console.log('saved......')
				if($this._o.closeAfterSave){		
					console.log('close input dialog.....');
					$("#detail-dialog").modal('hide');
				}
				if (typeof $this._o.afterSave === 'function') {
				if($this._o.afterSave()){
					$this.onRefresh();
					console.log('table refreshed.');
				};
			}
			});
			return false;
		},
		onClickSelectColumn : function(event){
			console.info('column select button clicked......');
			var mode=$(event.target).attr("data-column-select");
			console.info('mode=[' + mode +']');
			if(this._o.selectColumnUrl && mode ){
				event.preventDefault();
				$.ajax({
					type : 'GET',
					url : this._o.selectColumnUrl,
					data : 'module=' + $(event.target).attr("data-column-select"),
					  dataType : 'html'
				}).done(function(data){
					$('#page-dialog').html(data);
					$('#column-dialog').modal();
				})
				.fail(function(xhr, code, exp){
				});
				return false;
			}
			console.error('url or mode not be set.......');
			return true;
			
		},
		onSubmitColumnSelection : function(event){
			if(this._o.selectColumnUrl){
				event.preventDefault();
				$("#btnSaveColumns").attr("disabled", true);
				var dataStr="";
				var $this=this;
				$('#columns-form [data-column-name]').each(function(){
					if($(this).prop('checked')){
						dataStr +='1';
					} else {
						dataStr +='0';
					}
				});
				dataStr= "columns=" + dataStr;
				$.ajax({
					type : 'POST',
					url : this._o.selectColumnUrl,
					data : dataStr + '&module=' + $('#columns-form #module').val(),
					dataType : 'text'
				})
				.done(function(data){					
					$this.onRefresh();
				})
				.fail(function(xhr, error, exp){
					//alert("系统错误，设置失败！")
				});					
				$('#column-dialog').modal('hide');
				return false;
			}
			console.error('column selection post url may not be set propertly.....');
			return true;
		},
		
		onClickExport : function(event){
			console.info('export button was clicked.....');
			if(this._o.exportUrl){
				event.preventDefault();
				console.info('to export from ['+ this._o.exportUrl +'].......');
				$('#FORM_TABLE_FUNCTION').attr('action', this._o.exportUrl);
				$('#FORM_TABLE_FUNCTION').attr('method', 'post');
				$('#FORM_TABLE_FUNCTION').submit();
				return false;
			} 
			console.error('export url may not be set propertly......');
		}
	};
	$.fn.bindPage = function(options) {		
		this.each(function(){
			var el = $(this);
			if (el.data('pageBinder')) {
				el.data('pageBinder').remove();
			}			
			console.log('bind to page....');
			el.data('pageBinder', new ListPageOperatorBinder(options, el));
		});
	};
	console.error('page binder loaded!');
}(window.jQuery));

