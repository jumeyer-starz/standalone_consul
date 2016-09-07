var host = ""; //provide hostname if not self
var getKVs = function(){};

function makeguid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	//return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	return s4() + s4()  + s4() + s4() + s4() + s4() + s4() + s4();
}

$( document ).ready(function() {

	$( "#editDialog" ).dialog({
		autoOpen:false,
		modal:true,
		width:600,
		buttons:[
		{
			text:"Cancel",
			click:function(){
				$( this ).dialog( "close" );
			}
		},{
			text:"Delete",
			click:function(){
				if(confirm("Really Delete?")){
					$.ajax({
						ptr:$( this ).dialog( "close" ),
						url: host + '/v1/kv/redirects/' + $('#ed_server').val() + '/' + $('#ed_redirectId').text() + '?dc=dc1&token=',
						method: "DELETE",
						contentType: 'application/json',
				        dataType: 'json',
				        processData: false,
				        crossDomain:false,
				        crossOrigin:false,
				        success: function(data,result){
				        	this.ptr.dialog("close");
				        	getKVs();
				        },
				        failure:function(data,result){}

				    });
				}
			}
		},{
			text:"ok",
			click:function(){
				$.ajax({
					ptr:$( this ).dialog( "close" ),
					url: host + '/v1/kv/redirects/' + $('#ed_server').val() + '/' + $('#ed_redirectId').text() + '?dc=dc1&token=',
					method: "PUT",
					contentType: 'application/json',
					data:$('#ed_path').val() + "\n" + $('#ed_url').val()+"\n",
					dataType: 'json',
					processData: false,
					crossDomain:false,
					crossOrigin:false,
					success: function(data,result){
						this.ptr.dialog("close");
						getKVs();
					},
					failure:function(data,result){}

				});
			}
		}
		]
	});



	$( "#addDialog" ).dialog({
		autoOpen:false,
		modal:true,
		width:600,
		buttons:[
		{
			text:"Cancel",
			click:function(){
				$( this ).dialog( "close" );
			}
		},{
			text:"ok",
			click:function(){
				var guid = makeguid();

				$.ajax({
					ptr:$( this ).dialog( "close" ),
					url: host + '/v1/kv/redirects/' + $('#add_server').val() + '/' + guid + '?dc=dc1&token=',
					method: "PUT",
					contentType: 'application/json',
					data:$('#add_path').val() + "\n" + $('#add_url').val()+"\n",
					dataType: 'json',
					processData: false,
					crossDomain:false,
					crossOrigin:false,
					success: function(data,result){
						this.ptr.dialog("close");
						getKVs();
					},
					failure:function(data,result){
					}

				});
			}
		}
		]
	});

	$('#addButton').click(function(){
		$( "#addDialog" ).dialog("open");
	});

	$('#refreshButton').click(function(){
		getKVs();
	});

	getKVs = function(){

		$.ajax({
			url: host+'/v1/kv/?recurse',
			data: {},
			method: "GET",
			dataType: 'json',
			success: function(data,result){
				$('#kvList').empty();

				$.each(data, function(i, item) {
					var values = atob(item.Value).split("\n");
					var keys = item.Key.split("/");	
					$('#kvList').append('<li><key>' + item.Key + "</key><value>"+ item.Value + '</value><display>'+keys[1]+'/'+values[0]+' -> '+values[1]+'</display><lnk><a target="_new" href="http://'+keys[1]+'/'+values[0]+'">'+keys[1]+'/'+values[0]+'</a></lnk></li>');

				}); 


				$('#kvList li display').bind( "click", function() {
					var ctr = $(this).parent();
					var key = ctr[0].children[0].innerHTML;
					var value = ctr[0].children[1].innerHTML;

					var valueDecoded = atob(value);
					var parts = key.split("/");
					var valParts = valueDecoded.split("\n");

					$('#ed_redirectId').text(parts[2]);
					$('#ed_server').val(parts[1]);
					$('#ed_path').val(valParts[0]);
					$('#ed_url').val(valParts[1]);



					$( "#editDialog" ).dialog("open");
				});
			}

		});
	};

	getKVs();

});
