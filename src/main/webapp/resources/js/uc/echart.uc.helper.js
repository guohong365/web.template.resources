/**
 * 
 */
(function ($){
	//var mapManager:{maps:[], pendingQueue:[]};
	var uc={
		utils: {
			mapManager:{maps:[], pendingQueue:[]},
			loadMap2:function(cityCode, data, callback, container){
				var manager=$.utils.mapManager;
				if(manager.maps[cityCode]==null){
					if(manager.pendingQueue[cityCode]==null){
						manager.pendingQueue[cityCode]=[{callback:callback,data:data, cityCode:cityCode}];
						var $loader=null;
						if(typeof container == 'string'){
							$loader=$.loader.loader(container, '加载地图...');
							$loader.show();
						}						
						$.get('resources/js/echart/map/json/'+ cityCode +'.json', function (mapJson) {
							manager.maps[cityCode]=mapJson;
							echarts.registerMap(cityCode, mapJson);
							var pendingCalls=manager.pendingQueue[cityCode];
							for(var i=0; i< pendingCalls.length; i++){
								var func=pendingCalls[i];
								func.callback(func.cityCode, func.data);
							}
							manager.pendingQueue[cityCode]=[];
						})
						.always(function(){ if($loader) $loader.hide(); });
						
					} else {
						manager.pendingQueue[cityCode].push({callback:callback,data:data,cityCode:cityCode});
						return;
					}
				} else {
					if(typeof(callback)=='function'){
						callback(cityCode, data);
					}
				}
			},
			loadMap:function(cityCode, data, callback, maps, container){
				if(maps[cityCode]==null){
					var $loader=null;
					if(typeof container == 'string'){
						$loader=$.loader.loader(container, '加载地图...');
						$loader.show();
					}
					$.get('resources/js/echart/map/json/'+ cityCode +'.json', function (mapJson) {
						maps[cityCode]=mapJson;
						echarts.registerMap(cityCode, mapJson);
						if(typeof(callback) == 'function'){
							callback(cityCode, data);
						}
			    	})
			    	.always(function(){ if($loader) $loader.hide(); });
			    }
			},
			loadItem2:function(url, request_data, barCallback, mapCallback, barContainer, mapContainer){
				  var ajaxOptions={url:url, type:'post', contentType:'application/json;charset=utf-8', data:JSON.stringify(request_data)};
				  var $thisLoadMap=this.loadMap2;
				  var $loader=null;
				  if(typeof barContainer== 'string'){
					  $loader=$.loader.loader(barContainer, '加载图表数据...');
				  }
				  
				  $.ajax(ajaxOptions)
				  .done(function(data){					  
			    	  if(typeof(barCallback) == 'function'){
			    		  barCallback(data);
			    	  }
			    	  $loader.hide();
			    	  if(mapCallback){
			    		  $thisLoadMap(request_data.params.city, data, mapCallback, mapContainer);
			    	  }
			      })
			      .fail(function(){ if($loader) $loader.hide(); });
			},
			loadItem:function(url, request_data, barCallback, mapCallback, maps, barContainer, mapContainer){
				  var ajaxOptions={url:url, type:'post', contentType:'application/json;charset=utf-8', data:JSON.stringify(request_data)};
				  var $thisLoadMap=this.loadMap;
				  var $loader=null;
				  if(typeof barContainer== 'string'){
					  $loader=$.loader.small(barContainer);
				  }
				  $.ajax(ajaxOptions)
				  .done(function(data){					  
			    	  if(typeof(barCallback) == 'function'){
			    		  barCallback(data);
			    	  }
			    	  $loader.hide();
			    	  $thisLoadMap(request_data.params.city, data, mapCallback, maps, mapContainer);
			      })
			      .fail(function(){ if($loader) $loader.hide(); });
			},
			findSimpleName:function(name, simples){
				for(var i=0; i<simples.length; i++){
					if(name.substr(0,2)==simples[i].substr(0,2)){
						return simples[i];
					}
				}
				return "";
			},
			getLabels : function(values, simpleNames){
				var labels=[];
				for(var i=0; i< values.length; i++){
					labels.push(this.findSimpleName(values[i].name, simpleNames));
				}
				return labels;
			},
			getNames:function(data){
				var names=[];
				for(var i=0; i<data.length; i++){
					names.push(data[i].name);
				}
				return names;
			},
			getValues : function(data){
				var values=[];
				for(var i=0; i<data.length; i++){
					values.push(data[i].value);
				}
				return values;
			},
			getMaxValue:function(data){
				if(data && data.length>0){
					var maxValue=data[0].value;
					for(var i=1; i< data.length; i++){
						if(maxValue<data[i].value){
							maxValue=data[i].value;
						}
					}
					return maxValue;
				}
				return 0;
			},
			getSum:function(data){
				var sum=0;
				for(var i=0; i<data.length; i++){
					sum +=data[i].value;
				}
				return sum;
			},
			findCityCodeByName : function(cityName){
			    var cityList=[{code:"530100", name:"昆明市"},	{code:"530300", name:"曲靖市"},{code:"530400", name:"玉溪市"},
				{code:"530500", name:"保山市"},{code:"530600", name:"昭通市"},{code:"530700", name:"丽江市"},{code:"530800", name:"普洱市"},
				{code:"530900", name:"临沧市"},{code:"532300", name:"楚雄彝族自治州"},{code:"532500", name:"红河哈尼族彝族自治州"},
				{code:"532600", name:"文山壮族苗族自治州"},{code:"532800", name:"西双版纳傣族自治州"},{code:"532900", name:"大理白族自治州"},
				{code:"533100", name:"德宏傣族景颇族自治州"},{code:"533300", name:"怒江傈僳族自治州"},{code:"533400", name:"迪庆藏族自治州"}];
			    for(var i=0; i< cityList.length; i++){
			    	var city=cityList[i];
			    	if(city.name==cityName){
			    		return city.code;
			    	}
			    }
			    return null;
			}	
		}
	};
	$.extend(uc);
	
}(window.jQuery));