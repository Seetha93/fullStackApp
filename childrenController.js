fullStackApp.controller('childrenController', function($scope, $http) {
	var count =0;
	$scope.calculate = function(firstDate,secondDate){
	var days = $scope.dayDiff(firstDate,secondDate);
	var years = Math.floor(days/365); alert(years);
	if( years < 1)
		$scope.childrenCount = 0;
	else {
		var totalDays = days - 122;
		var divorcedCouples = (days/122);
		var requiredCouples = 100 - divorcedCouples;
		$scope.childrenCount = years * requiredCouples;
		}
	}
		
	$scope.dayDiff = function(firstDate,secondDate) {
		var date2 = new Date($scope.formatString(secondDate));
		var date1 = new Date($scope.formatString(firstDate));
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());   
		var noOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
		return noOfDays;
	}
	$scope.formatString = function(format) {
		var day   = parseInt(format.substring(0,2));
		var month  = parseInt(format.substring(3,5));
		var year   = parseInt(format.substring(6,10));
		var date = new Date(year, month-1, day);
		return date;
	}
 
	
	$scope.send = function () {
		console.log("inside click");
		id = count++;
        $http({
			method : 'GET',
			url : 'http://localhost:8080/page1',
			params: { id: $scope.childrenCount },
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded',
			}
					
		}).success(function(d){ $scope.result=d;console.log( "yay "+d ); })
			.error(function(d){ console.log( "nope" ); });  
	};
});

        
fullStackApp.directive('datepicker', function() {
	return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.datepicker({
                    dateFormat:'dd/mm/yy',
                    onSelect:function (date) {
                        ngModelCtrl.$setViewValue(date);
                        scope.$apply();
                    }
                });
            });
        }
    }
});