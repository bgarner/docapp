var item = $("#listViewId").html();
$(".listTitle").html(item);	

$.getJSON('http://localhost:8000/api/v1/banner/1/navigation', function(json) {

	var i=0;
	$.each(json, function(index, element) {

		
		//check if is_child
		if(element.is_child == 0){
			console.log( "parent node: " + element.label ) ;
			var children = element.children;

			if( children.length > 0 ){

					$.each(children, function( jndex, child ){
						var id = child.child_id;
						console.log("----" + json[id].label );
					});
			}
		}
		
   //      $('table').append(
   //      	"<tr>" +
   //      		"<td><span class='fileicons file-pdf'></span><span class='filetitle'>"+json[i]+"</span></td>";
			// "</tr>";
   //      );

        i++;
    });


});      



