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
    initFileOpen();
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
        var nav = $(this).attr('data-subnavid');
        var title = $(this).attr('data-title');
        var parent = $(this).attr('data-parent');
     //   console.log("attempting to load subnav: " + nav);
        loadNavigation(nav, "1", parent);
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

var openPanel = function(id, nav, title)
{
    // console.log("opening panel with: " + id);
    // console.log("attempting to load nav: " + nav);
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
        loadNavigation(nav, 0, "");
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

var loadNavigation = function(nav, isSubNav, parent)
{ 
    //console.log("loadNaviation called with: nav:"+ nav +" isSubNav:"+ isSubNav +" parent:"+ parent);
    if(isSubNav ==1){
        // console.log("loading SUB nav: "+ nav);
        $(".navbox").hide();
        // $("#title-divider").hide();
        var subtitle = $("#"+nav).attr('data-title');

        console.log("nav:"+nav);
        console.log("subTitle:"+subtitle);
        console.log("parent:"+parent);
        console.log("----------------------------------");

        $("#subTitle").html(subtitle);      
        $("#title-divider").fadeIn();
        $("#subTitle").fadeIn();
        
        setBackButton(parent, 0);

        $("#"+nav).fadeIn();    

    } else {
        $(".navbox").hide();
        $("#title-divider").hide();
        $("#subTitle").hide();
        $("#back").hide();
        $("#"+nav).fadeIn();            
    }
}

var loadContent = function(c)
{
    // console.log("content: " + c);
    $('#main').fadeOut(10);
    closePanel();

    $('#main').load("content/"+c+".html").fadeIn(1000);
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

// var setSubTitle = function(title)
// { 
//     $("#subTitle").html(title);      
//     $("#title-divider").fadeIn();
//     $("#subTitle").fadeIn();
// }

var setBackButton = function(whereTo, isMainLevelNav)
{   
    if(isMainLevelNav==1){
        $("#back").hide(); //this is the top level and won't need a back button
    } else {
        $('#back').attr('data-backto', whereTo);
        $("#back").on( "click", function() {
            loadNavigation(whereTo, "1", "");
        });   

        $("#back").fadeIn();
    }
 

}

var loadIndex = function(){
    // I don't love this function
    $('#main').fadeOut(10);

    $("#close").hide();
    $("#navtitle").hide();

    if($('#panel').hasClass('open')){
        $(".navbox").fadeOut(300);
        $('.navitem').removeClass("grey");
        $("#panel").removeClass("open");
        $( "#panel" ).animate({
          width: "-=750"
          }, 300, function() {
            // Animation complete.
            $('#main').load("content/index-content.html").fadeIn(500);
            //alert("done");
        });
        initNav();
    } else {
        $('#main').fadeOut(10);
        $('#main').load("content/index-content.html").fadeIn(500);
    }
}

$('#logo').click(function(){  loadIndex() });
// $('#snowservices-nav').click(function(){   loadPDF()   });