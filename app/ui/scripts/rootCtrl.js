//angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);
angular.module('app', []).controller('rootCtrl', function($scope) {

//test
$scope.tmp = 888;
  console.log($scope.tmp);
console.log($scope.tmp);	
//angular-uib settings START
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
//angular-uib settings END
});