(function () {
    'use strict'; 
    angular
        .module('ummuza')
        .directive('dateTimePicker', function ($timeout) {
            return {
                restrict: 'EA',
                require: 'ngModel',
                scope: {
                    options: '=?',
                    onChange: '&?',
                    onClick: '&?'
                },
                link: function ($scope, $element, $attrs, ngModel) {
                    // var dpElement = $element.parent().hasClass('input-group') ? $element.parent() : $element;
                    var dpElement = $element;

                    $scope.$watch('options', function (newValue) {
                        var dtp = dpElement.data('DateTimePicker');
                        $.map(newValue, function (value, key) {
                            dtp[key](value);
                        });
                    }, true);

                    ngModel.$render = function () {
                        // if value is undefined/null do not do anything, unless some date was set before
                        var currentDate = dpElement.data('DateTimePicker').date();
                        if (!ngModel.$modelValue && currentDate) {
                            dpElement.data('DateTimePicker').clear();
                        } else if (ngModel.$modelValue) {
                            // otherwise make sure it is moment object
                            if (!moment.isMoment(ngModel.$modelValue)) {
                                ngModel.$setViewValue(moment(ngModel.$modelValue));
                            }
                            dpElement.data('DateTimePicker').date(ngModel.$modelValue);
                        }
                    };

                    var isDateEqual = function (d1, d2) {
                        return moment.isMoment(d1) && moment.isMoment(d2) && d1.valueOf() === d2.valueOf();
                    };

                    dpElement.on('dp.change', function (e) {
                        if (!isDateEqual(e.date, ngModel.$modelValue)) {
                            var newValue = e.date === false ? null : e.date;
                            ngModel.$setViewValue(newValue);
                            $timeout(function () {
                                if (typeof $scope.onChange === 'function') {
                                    $scope.onChange();
                                }
                            });
                        }
                    });


                    dpElement.on('click', function () {
                        $timeout(function () {
                            if (typeof $scope.onClick === 'function') {
                                $scope.onClick();
                            }
                        });
                    });

                    dpElement.datetimepicker($scope.options);
                }
            }
        })
})();