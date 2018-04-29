/**
 * 
 */
function AreaSelect(areas){
	var _areas=areas;
	this.initCtrl=function(sel, code){
		if(!sel){
			return;
		}
		var opt='<option value="" >---------</optoin>';
		if(_areas && _areas.length){
			for(var i=0; i< _areas.length; i++){
				var item=_areas[i];
			  	opt= opt + '<option value="'+ item.code +'">' + item.name +"</option>";
			}
		}	
		$(sel).html(opt);
	};
	
	this.findSubArea=function(parentCode){
		var index=0;
		if(_areas && _areas.length){
			for(var i=0; i< _areas.length; i++){
				if(_areas[i].code && _areas[i].code===parentCode){
					return _areas[i].subArea;
				}
			}	
		}
		return null;
	};		
}