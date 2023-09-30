//~ ~ Font Type ~ ~
var settingFontFamily = ["Serif", "Sans Serif", "OpenDyslexic"]; //Visible options, you can add or remove them (each should be separated by a comma)
var fontFamily = function() {
var $html = $("html"); 
    $html.removeClass("serif sansserif opendyslexic"); //this will remove the old CSS font tag used before the switch
switch ((settings as any).fontFamily) { //this part will add the new CSS font tag to the page depending on the player choice
    case "Serif": //this name should be the same than in the option defined in the first line
        $html.addClass("serif"); //each of these options need to be set in the StyleSheet (CSS)
        break;
    case "Sans Serif":
        $html.addClass("sansserif");
        break;
    case "OpenDyslexic":
        $html.addClass("opendyslexic");
        break;
    /*
    To add a new font to the list:
        ~ Add the Name of the new option inside > var settingFontFamily
        ~ Add a CSS font tag inside > $html.removeClass
        ~ Add another case inside > switch (settings.fontFamily)

        case "Font Option"
            $html.addClass("css-tag-for-the-new-font");
            break;
    */
}};
Setting.addList("fontFamily", {//This is the actual Setting visible to the player
    label		: "Change font type",
    desc        : "Choose between a Serif, Sans-serif, or the OpenDyslexic Font", //This line is optional
    list		: settingFontFamily,
    default     : "Sans Serif", //If you remove this, the system will pick the first defined option
    onInit		: fontFamily,
    onChange	: fontFamily
});	


//~ ~ Font Size ~ ~
/*
  Note: The code below links the #passages ID to the CSS font-size rule. 
  You can also choose to create a setting like the one above with a new CSS class, and set the class manually in the CSS.
*/
var settingFontSize = ["75%", "100%", "125%", "150%"];
var resizeFont = function() {
var size = document.getElementById("passages")!; //This is linked to #passages in the CSS
switch ((settings as any).fontSize) {
    case "100%":
        size.style.fontSize = "100%"; //You can use other value units, like px, em, or absolute ones (small, large...)
        break;
    case "75%":
        size.style.fontSize = "75%";
        break;
    case "125%":
        size.style.fontSize = "125%";
        break;
    case "150%":
        size.style.fontSize = "150%";
        break;
}
};
Setting.addList("fontSize", {
    label		: "Change Font Size",
    list		: settingFontSize,
    default     : "100%",
    onInit		: resizeFont,
    onChange	: resizeFont
});


//~ ~ Line Height ~ ~
var settingLineHeight = ["75%", "100%", "125%", "150%"];
var lineHeight = function () {
var $html = $("html");
$html.removeClass("lh-small lh-medium lh-large lh-biggest");
switch ((settings as any).lineheight) {
    case "75%":
        $html.addClass("lh-small");
        break;
    case "100%":
        $html.addClass("lh-medium");
        break;	
    case "125%":
        $html.addClass("lh-large");
        break;	
    case "150%":
        $html.addClass("lh-biggest");
        break;	
}};
Setting.addList("lineheight", {
    label       : "Change Line Height",
    default     : "100%",
    list        : settingLineHeight,
    onInit      : lineHeight,
    onChange    : lineHeight
});
