if (!document.all) {
    document.captureEvents(Event.MOUSEUP);
}

var TwickitPopup = {
    previousSelection : "",
    theme : "twickit",

    load: function() {
        var eventMode = "mouseup";
        var disableCreate = 0;
        var disableGeo = 0;
		var color = "";        

        var scripts = document.getElementsByTagName("script");
        for(var i=0; i<scripts.length; i++) {
            var s = scripts[i];
            if(s.src.match(/twickit.js(\?.*)?$/)) {
                var themes = s.src.match(/\?.*theme=([a-z,]*)/);
                var theme = themes ? themes[1] : "twickit";
                TwickitPopup.theme = theme;

                var eventModes = s.src.match(/\?.*event=([a-z,]*)/);
                eventMode = eventModes ? eventModes[1] : "mouseup";

                disableCreate = s.src.search(/\?.*disableCreate=1/) == -1 ? 0 : 1;
                disableGeo = s.src.search(/\?.*disableGeo=1/) == -1 ? 0 : 1;
				
				var colors = s.src.match(/\?.*color=(.+)/);
				var color = colors ? colors[1] : "";
            }
        }
		
		if(!document.getElementById("twickit_bubble_js")) {
            script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("charset", "utf-8");
            script.setAttribute("id", "twickit_bubble_js");
            script.setAttribute("src", "http://static.twick.it/interfaces/js/bubble.js");
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        TwickitPopup.observe(window, 'load', function() {
            TwickitPopup.observe(
                document,
                'keyup',
                function(inEvent) {
                    if (!inEvent) var inEvent = window.event;
                    if (inEvent.keyCode) code = inEvent.keyCode;
                    if(code==27 && document.getElementById('twicktip') != null) {
                        document.getElementById('twicktip').style.display = "none";
                    }
                }
                );

            TwickitPopup.observe(
                document,
                eventMode,
                function(inEvent) {
                    if (document.selection) {
                        selection = document.selection.createRange().text;
                    } else {
                        selection = window.getSelection().toString();
                    }

                    if (selection != TwickitPopup.previousSelection) {
                        if (!inEvent.altKey) {
                            var twicktip = document.getElementById('twicktip');
                            if (twicktip != null) {
                                twicktip.style.display="none";
                            }
                        } else {
                            TwickitPopup.previousSelection=selection;

                            if (selection != "") {
                                if (document.all) {
                                    var documentElement = null;
                                    if (document.compatMode && document.compatMode == "CSS1Compat") {
                                        documentElement = document.documentElement;
                                    } else {
                                        documentElement = document.body;
                                    }
                                    tempX = window.event.clientX + documentElement.scrollLeft;
                                    tempY = window.event.clientY + documentElement.scrollTop;
                                } else {
                                    tempX = inEvent.pageX;
                                    tempY = inEvent.pageY;
                                }
                                tempX -= 15;
                                TwickitBubble.open(tempX, tempY, TwickitPopup.theme, color);

                                // CSS + JavaScript-Include
                                if (document.getElementById('twickit_open_popup_js') != null) {
                                    var element = document.getElementById('twickit_open_popup_js');
                                    element.parentNode.removeChild(element);
                                }

                                TwickitBubble.fill("<div id='twicktip_wait'>&nbsp;</div>");

                                var script = document.createElement("script");
                                script.setAttribute("type", "text/javascript");
                                script.setAttribute("charset", "utf-8");
                                script.setAttribute("id", "twickit_open_popup_js");
                                script.setAttribute("src", "http://twick.it/interfaces/js/popup/open_popup_js.php?t=" + encodeURIComponent(selection.replace(/^\s+/, '').replace(/\s+$/, '')) + "&dc=" + disableCreate + "&dg=" + disableGeo + "&cache=" + (new Date()).getTime());
                                try {
                                    if(twickitLanguage) {
                                        script.src += "&lng=" + twickitLanguage;
                                    }
                                } catch(ignored) {}

                                document.getElementsByTagName("head")[0].appendChild(script);
                            }
                        }
                    }
                }
                );
        });
    },

    observe: function(inObject, inEventType, inFunction) {
        if (inObject.addEventListener) {
            inObject.addEventListener(inEventType, inFunction, false);
        } else if (inObject.attachEvent) {
            inObject["e"+inEventType+inFunction] = inFunction;
            inObject[inEventType+inFunction] = function() {
                inObject["e"+inEventType+inFunction](window.event);
            }
            inObject.attachEvent("on"+inEventType, inObject[inEventType+inFunction]);
        }
    }
}

TwickitPopup.load();