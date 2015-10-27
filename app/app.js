
angular.module('app', [])

.factory('GetData', function( $q, $timeout, $interval){
	var timer , progress = 0;
	return function ( boolean ) {
		var deferred = $q.defer();
		timer = $interval(function () {
			if(progress < 101) {
				deferred.notify( progress );
				progress = progress + 1;
			} else {
				$interval.cancel(timer);
				boolean ? deferred.resolve('Data done!') : deferred.reject('Sorry Something went wrong!');
				progress = 0;
			}
		}, 50);
		return deferred.promise;
	};
})

.controller('Example1Controller', function($scope, $log, GetData) {
	$scope.progress = 0;
	$scope.data = 'Loading ...';
	$scope.boolean = true;
	$scope.get = function() {
		$scope.data = 'Loading...';
		GetData($scope.boolean).then(function( data ) {
			$scope.data = data;
			// 操作data
		}, function (data) {
			$scope.data = data;
		}, function ( msg ) {
			$scope.progress = msg;
		}).finally(function(){
			$log.info('over');
		});
	};
	
})
.controller('Example2Controller', function( $scope, $q, $timeout ) {
	// 这个例子中我们就不使用服务了，直接在控制器中假装获取数据，当然最佳实践不建议这样做的
	var deferred = $q.defer();
	$timeout(function () {
		deferred.reject('拒绝!数据不想给你，咋滴？');
	}, 3000);
	deferred
	.promise
	.then(function(){})
	.catch(function(msg){
		$scope.reson = msg;
	});
})
.controller('Example3Controller', function ( $scope, $q, $timeout, GetData ) {
	var deferred1 = $q.defer();
	var deferred2 = $q.defer();
	var deferred3 = $q.defer();
	var start = +new Date();

	$timeout(function () {
		deferred1.resolve('done');
	}, 300);
	$timeout(function () {
		deferred2.reject('error');
	} , 600);
	$timeout(function () {
		deferred1.resolve('error2');
	}, 1000);

	$q.all([deferred1.promise, deferred2.promise, deferred3.promise])
	.then(function(result) {
		console.log(result);
		console.log(+new Date - start);
	}, function(result) {
		console.log(result);
		console.log(+new Date - start);
	});
	$q.when(GetData(true))
	.then(function(msg){
		console.log(msg);
	});
})

.controller('Example4Controller' , function($scope, $q, $timeout, $log) {
	$scope.info = '';
	var deferred1 = $q.defer();
	$timeout(function () {
		deferred1.resolve('done');
	}, 1000);

	deferred1.promise
	.then(function (data) {
		$scope.info = data;
		var deferred2 = $q.defer();
		$timeout( function () {
			deferred2.resolve(data + ' really?');
		}, 1000);
		return deferred2.promise;
	})
	.then(function (data) {
		$scope.info = data;
		var deferred3 = $q.defer();
		$timeout(function () {
			deferred3.resolve(data + " Yes, it's done!!!");
		}, 1000);
		return deferred3.promise;
	})
	.then(function (data) {
		$scope.info = data;
	});
});











