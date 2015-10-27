const API_DOMAIN = "http://localhost:8000";
const API_VERSION = "v1";
const BANNER_ID = 1;


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$( document ).ready(function() {
    loadJSONNavigation();  
    // initNav();
    // initSubNav();
    initClose();
    // initFileOpen();
    // initListViewItems();
});

$('#logo').click(function(){  loadIndex() });

var initNav = function()
{
    $( ".navitem" ).on( "click", function() {
        var id = $(this).attr('id'); 
        var nav = $(this).attr('data-nav');
        var title = $(this).attr('data-title');
        openPanel(id, nav, title);
        $('.navitem').off('click');
    });
}

var initSubNav = function()
{
    $( ".hasSubNav" ).on( "click", function() { 
        var nav = $(this).attr('data-subnav');
        var title = $(this).attr('data-title');
        var parent = $(this).attr('data-parent');
     //   console.log("attempting to load subnav: " + nav);
        loadNavigation(nav);
     });   
}

var initClose = function()
{
    $('#close').click(function(){
        closePanel();
        initNav();
    });
}

var initFileOpen = function()
{
    $( ".openfile" ).on( "click", function() {
        el = document.getElementById("overlay");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        var file = $(this).attr('data-file');
        console.log(file);

        //$("#overlay div embed").attr("src","/content/pdf"+file);
      //  $('#overlay div').load("/content/pdf/"+file).fadeIn(500);
    });
}

var initListViewItems = function()
{
    $('.openList').click(function(){ 
        var item = $(this).attr('data-loadList');
        var title = $(this).attr('data-listTitle');
        loadContent(title, item);
    });
}

var openPanel = function(id, nav, title)
{
    $("#panel").addClass("open");
    $("#arrow").hide();

    $('.navitem').addClass("grey");
    $('#'+id).removeClass("grey");
    $('#'+id).addClass("selectedItem");

    $( "#panel" ).animate({
      width: "+=750"
      }, 300, function() {
        $("#close").fadeIn();
        $("#navtitle").fadeIn();
        setNavTitle(title);
        loadNavigation(nav);
    });
}

var closePanel = function()
{ 
    $("#navtitle").hide();
    $(".navbox").hide();
    $('.navitem').removeClass("grey");
    $('.navitem').removeClass("selectedItem");

    $( "#panel" ).animate({
      width: "-=750"
      }, 300, function() {
        //put the arrow back, if we need it
        if( $('#main>#arrow') ) {
            $("#arrow").show();
        }
    });
    $("#close").hide();
   // $("#navtitle").hide();
}

var loadNavigation = function(nav)
{ 
    $("#subTitle").html(""); //always empty the subtitle before filling it.
    $(".navbox").hide(); //hide all of the navboxes
    $("#title-divider").hide(); 
    $("#subTitle").hide(); //even though this is set to empty, we will need to fade it in later
    $("#back").hide();         

    var parent = $("#"+nav).attr('data-parent');
    var subtitle = $("#"+nav).attr('data-subfoldertitle');
    var isTopLevel = $("#"+nav).attr('data-isTopLevel');
    
    if(isTopLevel == "true"){

        $("#title-divider").hide();
        $(".navbox").hide();
        $("#title-divider").hide();
        $("#subTitle").hide();
        $("#back").hide(); 

    } else {

        $("#subTitle").html(subtitle);      
        $("#subTitle").fadeIn();
        $("#title-divider").fadeIn();

        if(parent || typeof parent != 'undefined'){
            setBackButton(parent); 
            $("#back").fadeIn(); 
        } 
    }

    $("#"+nav).fadeIn();      
}

var loadContent = function(title, id)
{
    $('#main').fadeOut(10);
    closePanel();

    $('#main').load("content/list.html").fadeIn(1000);
    //set the hidden element to the item id
    $("#listViewId").html(id);   
    $("#listViewTitle").html(title);   

    initNav();
}

var loadPDF = function()
{

}

var closeModal = function()
{
    el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

var setNavTitle = function(title)
{
   $("#topLevelTitle").html(title);
}

var setBackButton = function(whereTo)
{   
    $("#back").unbind(); //lets take all other actions off the back button
    $("#back").on( "click", function() {
        loadNavigation(whereTo);
    });   
}

var loadIndex = function(){
    // I don't love this function
    console.log("home button clicked");
    $("#navtitle").hide();
    $("#close").hide();
    $(".navbox").hide();
    $('.navitem').removeClass("grey");
    $("#back").hide();

    $("#panel").removeClass("open");
    $('#panel').css({"width":"0"});

    var w = $('#panel').width();
    console.log("width: " + w);

    if( $('#main>#arrow') ) {
        $("#arrow").show();
    }

    $('#main').fadeOut(10);
    $('#main').load("content/index-content.html").fadeIn(500);
    initNav();    
}

var loadJSONNavigation = function()
{

    var jqxhr = $.getJSON( API_DOMAIN + "/api/"+ API_VERSION +"/banner/"+ BANNER_ID +"/navigation", function(json) {
     
        var i=0;
            $.each(json, function(index, element) {
                inspectNode(element, json);
                i++;
            });
        })

        .done(function(){

        console.log("json loaded... init the nav");

        initNav();
        console.log("nav done!");

        initSubNav();
        console.log("sub nav done!");

        initFileOpen();
        console.log("file open done!");

        initListViewItems();        
        console.log("list view done!");
    });

}

var inspectNode = function(node, json)
{
    if(node.is_child == 0){ //this is a parent node
        console.log("//// CONSTRUCTING TOP LEVEL ITEM ////");
        var thisLabel = node.label;
        var thisId = node.id;

        thisId = thisLabel + "-" + thisId;
        thisId = thisId.replace(" ", "-");
      
        //create the root level element    
        var html = constructNavElement("topLevel", thisLabel, thisId);  
        //apend it to the "nav" div
        appendToContainer("nav", html);
        //create a sub nav container for this elements childern
        constructSubNavContainer( thisId, "", thisLabel);

        return;
    }

    if(node.is_child == 1) { //this is a child item
       // console.log(node);
        var children = node.children;
        var thisLabel = node.label;
        var thisId = node.id;
        var parent_id = node.parent_id;
        var parent_label = json[parent_id].label;
        var parent_label_nospace = parent_label.replace(" ", "-");
        var thisLabel_nospace = thisLabel.replace(" ", "-");
        var subNavContainerId = parent_label_nospace + "-" + parent_id;

        if( children.length > 0 ){ 

            var html = constructNavElement("child", thisLabel, thisId, parent_label, parent_id);  
            appendToContainer( subNavContainerId, html);            

            parentContainerId = subNavContainerId;  //borrow the container we built above. just renamed for clarity.
            var thisSubNavContainerId = thisLabel_nospace + "-" + thisId;
            constructSubNavContainer( thisSubNavContainerId, parentContainerId, thisLabel);

            //check for childern of this node
            $.each(children, function( index, child ){
                inspectNode(child, json);
            });
            return;
        }  


        if( children.length == 0 && typeof node.weeks === "undefined") {
            var html = createLeaf( thisLabel, thisId );
            appendToContainer(subNavContainerId, html);
            return;
        }

        //if( typeof node.weeks !== "undefined" ){
        if( node.weeks ){
            console.log("I have weeks?");
            console.log(node);

            var html = constructNavElement("child", thisLabel, thisId, parent_label, parent_id);  
            appendToContainer( subNavContainerId, html);  

            var thisLabelWeeks = node.label;
            thisLabelWeeks = thisLabelWeeks.replace(" ", "-");
            

            var parentLabelWeeks = json[node.parent_id].label;
            parentLabelWeeks = parentLabelWeeks.replace(" ", "-");

            subNavContainerWeeksId = thisLabelWeeks + "-" + node.id;
            //var constructSubNavContainer = function( subNavContainerId, parentLabel, thisLabel )
            constructSubNavContainer( subNavContainerWeeksId, parentLabelWeeks, thisLabelWeeks )
            

            var weeks = node.weeks;
            $.each(weeks, function(index, week) {
                var html = createLeafWeeks( week.week, week.week_id );
                appendToContainer(subNavContainerWeeksId, html);
                return;       
            });
        }     
    }
}

var constructSubNavContainer = function( subNavContainerId, parentLabel, thisLabel )
{
    var css = 'background: #222; color: #bada55; padding: 5px 2px;';
    console.log ("%c%s", css, "constructSubNavContainer ==> subNavContainerId: " + subNavContainerId +", parentLabel: " + parentLabel + " thisLabel: "+ thisLabel );
    var html;
    html = "<div id='"+subNavContainerId+"' data-subfoldertitle='"+thisLabel+"' data-parent='"+parentLabel+"' class='navbox'></div>";
    $( "#panel" ).append( html );   
}

var appendToContainer = function( container, element ) //container MUST be an ID
{   
    $( "#"+container).append( element );
    console.log("New nav item appended to " + container);
}

var constructNavElement = function(nodeType, label, id, parent_label, parent_id)
{
    var css = 'background: #fff; color: #c00; border-bottom: 2px solid lime;';    

    var html;
    switch( nodeType ){
        case "topLevel":
            console.log ("%c%s", css, "constructNavElement ==> nodeType: " + nodeType +", label: " + label + " id: "+ id + " parent_label: " + parent_label + " parent_id: " +parent_id );

            html = "<span class='navitem' id='toplevel-"+id+"' data-nav='"+id+"' data-title='"+label+"'>"+label+"</span>";

            return html;
            break;

        case "child":   
            console.log ("%c%s", css, "constructNavElement ==> nodeType: " + nodeType +", label: " + label + " id: "+ id + " parent_label: " + parent_label + " parent_id: " +parent_id );
            var navlabel = label.replace(" ", "-");
            var navparent_label = parent_label.replace(" ", "-");

            html =        "<div class='selectbox hasSubNav' id='' data-parent='"+navparent_label+"-"+parent_id+"' data-subnav='"+navlabel+"-"+id+"'>"
            html = html + "   <div class='selectbox-content'>"
            html = html + "        <img src='img/bikes-nav.jpg' />"
            html = html + "        <h2>"+label+"</h2>"
            html = html + "    </div>"
            html = html + "</div> "

            return html; 
            break;
    }
}

var createLeaf =  function( title, id )
{
    console.log("making a leaf: " + title +", " +id);    
    var html; 
    html =        "<div class='selectbox openList' data-listTitle='" + title + "' data-loadList='"+ id +"' style='border: thick solid green;'>"
    html = html + "    <div class='selectbox-content'>"
    html = html + "        <img src='img/snowsports-nav.jpg' />"
    html = html + "        <h2>" + title + "</h2>"
    html = html + "    </div>"
    html = html + "</div>"    

    return html;

}

var createLeafWeeks =  function( title, id )
{
    console.log("making a leaf: " + title +", " +id);    
    var html; 
    html =        "<div class='selectbox openList' data-listTitle='" + title + "' data-loadList='"+ id +"' style='border: thick solid red;'>"
    html = html + "    <div class='selectbox-content'>"
    html = html + "        <img src='img/snowsports-nav.jpg' />"
    html = html + "        <h2>" + title + "</h2>"
    html = html + "    </div>"
    html = html + "</div>"    

    return html;

}
