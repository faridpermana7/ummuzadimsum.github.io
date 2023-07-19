(function () {
    'use strict'; 

    angular
        .module('ummuza')
        .directive('fToolbar', farstToolbar)
        // .directive('fAppbar', farstAppbar)
        .directive('fFilter', farstFilter)
        .directive('a', navigationDirective)
        .directive('button', triggerTooltip)
        .directive('form', formEl)
        .directive('print', _print)
        .directive('uiSelect', uiSelectFocus);
    // .directive('ngRightClick', function ($parse) {
    //     return function (scope, element, attrs) {
    //         var fn = $parse(attrs.ngRightClick);
    //         element.bind('contextmenu', function (event) {
    //             scope.$apply(function () {
    //                 event.preventDefault();
    //                 fn(scope, { $event: event });
    //             });
    //         });
    //     };
    // });
    function farstAppbar($stateParams) {
        return {
            restrict: 'E',
            template: '<div class="row breadcrumb-container">' +
                '<div class="col-md-6"><span class="title" ng-bind="title"></span>' +
                '</div>' +
                '<div class="col-md-6 text-right">' +
                '<ncy-breadcrumb></ncy-breadcrumb>' +
                '</div>' +
                '</div>',
            replace: true,
            link: function (scope, element, attr) {
                if (!attr.custom) {
                    if ($stateParams.id == 'new') {
                        scope.title = 'Create ' + attr.title;
                    }
                    else if ($stateParams.id > 0) {
                        scope.title = 'Edit ' + attr.title;
                    } else {
                        scope.title = attr.title;
                    }
                } else {
                    scope.title = attr.title;
                }
            }
        };
    }

    function farstFilter() {
        return {
            restrict: 'E',
            template: '<div class="filter"><ng-transclude></ng-transclude></div>',
            transclude: true,
        };
    }

    function farstToolbar() {
        return {
            restrict: 'E',
            template: '<div class="toolbar"><ng-transclude></ng-transclude></div>',
            transclude: true,
            link: function (scope, element, attr) {
                element.parent().parent('.row').addClass('toolbar-sticky');
            }
        };
    }

    function triggerTooltip() {
        return {
            restrict: 'E',
            link: function (scope, element, attr) {
                element.on('click', function () {
                    angular.element('[uib-tooltip-popup]').addClass('ng-hide');
                });
            }
        };
    }

    function navigationDirective() {
        var directive = {
            restrict: 'E',
            link: link
        }
        return directive;

        function link(scope, element, attrs) {
            if (element.hasClass('nav-dropdown-toggle') && angular.element('body').width() > 782) {
                element.on('click', function () {
                    if (!angular.element('body').hasClass('compact-nav')) {
                        element.parent().toggleClass('open').find('.open').removeClass('open');
                    }
                });
            } else if (element.hasClass('nav-dropdown-toggle') && angular.element('body').width() < 783) {
                element.on('click', function () {
                    element.parent().toggleClass('open').find('.open').removeClass('open');
                });
            }
        }
    }

    function formEl() {
        return {
            restrict: 'E',
            link: function (scope, elem) {
                var el = elem[0].querySelector('.form-control');
                if (el) {
                    el.focus();
                }
                // set up event handler on the form element
                elem.on('submit', function () {

                    // find the first invalid element
                    var firstInvalid = elem[0].querySelector('.ng-invalid');
                    // if we find one, set focus
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                });
            }
        };
    }


    function uiSelectFocus($timeout) {
        return {
            //require: 'ui-select',
            link: function (scope, $element, $attributes, selectController) {

                //scope.$select.search = scope.$select.ngModel.$viewValue.name;
                scope.$on('uis:activate', function () {
                    // Give it time to appear before focus
                    // console.log(scope.$select.selected);

                    $timeout(function () {
                        if ($attributes.prop && scope.$select.selected && !angular.equals({}, scope.$select.selected)) {
                            if (scope.$select.selected[$attributes.prop]) {
                                scope.$select.search = scope.$select.selected[$attributes.prop];
                            }
                        }
                    }, 0);
                    $timeout(function () {
                        scope.$select.searchInput[0].focus();
                    }, 500);
                });
            }
        }
    };

    function _print() {
        var directive = {
            restrict: 'E',
            link: link
        }
        return directive;

        function link(scope, element, attrs) {
            // angular.element('body').removeClass("header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden");
            angular.element('body').addClass(attrs.size);
        }
    }

})();