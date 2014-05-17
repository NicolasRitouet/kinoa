
angular.module('KinoaApp')
    .directive('scrollfollow', function($window) {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var currentOffsetTop, getParentWidth, handleSnapping, headerOffsetTop, parent, placeholder, window;
                window = angular.element($window);
                parent = angular.element(el.parent());
                currentOffsetTop = el[0].getBoundingClientRect().top;
                headerOffsetTop = scope.$eval(attrs.scrollfollow) || 5;
                getParentWidth = function() {
                    var returnDigit;
                    returnDigit = function(val) {
                        var valMatch = val.match(/\d+/);
                        if (valMatch && valMatch.length > 0) {
                            return valMatch[0];
                        }
                    };
                    return returnDigit(parent.css("width")) - returnDigit(parent.css("padding-left")) - returnDigit(parent.css("padding-right"));
                };
                handleSnapping = function() {
                    var dynamicContent;
                    dynamicContent = $("#" + el.attr("id")).css("content");
                    if (dynamicContent !== "tablet" && window[0].scrollY > currentOffsetTop) {
                        el.addClass("scrollfollowing");
                        el.css({
                            position: "fixed",
                            top: headerOffsetTop + "px",
                            width: getParentWidth()
                        });
                        return el.next().css({
                            height: el[0].offsetHeight,
                            display: "block"
                        });
                    } else {
                        el.removeClass("scrollfollowing");
                        el.css({
                            position: "static",
                            width: getParentWidth()
                        });
                        return el.next().css({
                            "display": "none"
                        });
                    }
                };
                placeholder = document.createElement("div");
                placeholder.className = "scrollfollow_placeholder";
                placeholder.style.display = "none";
                el.after(placeholder);
                handleSnapping();
                window.bind("scroll", function() {
                    return handleSnapping();
                });
                return window.bind("resize", function() {
                    return el.css({
                        width: getParentWidth()
                    });
                });
            }
        };
    });
