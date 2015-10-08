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
    initNav();
    initSubNav();
    initClose();
    // initFileOpen();
    initListViewItems();
});

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
        var item = $(this).attr('data-loadData');
        loadContent(item);
    });
}

var openPanel = function(id, nav, title)
{
    $("#panel").addClass("open");
    $("#arrow").hide();

    $('.navitem').addClass("grey");
    $('#'+id).removeClass("grey");

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

var loadContent = function(c)
{
    $('#main').fadeOut(10);
    closePanel();

    $('#main').load("content/list.html").fadeIn(1000);
    //set the hidden element to the item id
    $("#listViewId").html(c);   
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
    if($('#panel').hasClass('open')){
        closePanel();
    } 

    $('#main').fadeOut(10);
    $('#main').load("content/index-content.html").fadeIn(500);
    initNav();    
}

$('#logo').click(function(){  loadIndex() });
// $('#snowservices-nav').click(function(){   loadPDF()   });