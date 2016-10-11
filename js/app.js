angular.module('app', ['ToastModule'])
.controller('MainCtrl', ['$scope', 'Toast', function($scope, Toast) {

	$scope.showToast = function() {
		Toast.show('This is angular toast!');
	}
}])