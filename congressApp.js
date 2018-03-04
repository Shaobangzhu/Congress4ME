'use strict'

/* Code for legislation controller */
var congressApp = angular.module('congressApp', ['angularUtils.directives.dirPagination'])
    .controller('congressController', ['$scope','$http','$window', function($scope, $http, $window){
        
        // 以下http请求用于分别获取：1. legislator; 2. bills; 3. committees的JSON数据
        // Reference:http://www.w3schools.com/angular/tryit.asp?filename=try_ng_customers_json
        // GET 'legislator' information from php code => $scope.Legis 应急处理
        $http({
            method: 'GET',
            url: 'congressApp.php?index=legislator',
            //url: 'http://localhost/~andylu/LegiLocal.php',
        }).then(function successCallback(response){
            $scope.Legis =response.data.results;
        }, function errorCallback(response){
            // called asynchronously if an error occurs
            // or server returns response with an error status
        });
        
        // GET 'house' information from php code => $scope.houseLegis 应急处理
        $http({
            method: 'GET',
            url: 'congressApp.php?index=house',
            //url: 'http://localhost/~andylu/LegiLocal.php',
        }).then(function successCallback(response){
            $scope.houseLegis = response.data.results;
        }, function errorCallback(response){
            // called asynchronously if an error occurs
            // or server returns response with an error status
        });

        
        // GET 'active bills' information from php code => $scope.Bills 应急处理
        $http({
            method: 'GET',
            url: 'congressApp.php?index=active',
            //url: 'http://localhost/~andylu/BillLocal.php',
        }).then(function successCallback(response){
            $scope.acBills =response.data.results;
        }, function errorCallback(response){
            // called asynchronously if an error occurs
            // or server returns response with an error status
        });
        
        // GET 'new bills' information from php code => $scope.Bills 应急处理
        $http({
            method: 'GET',
            url: 'congressApp.php?index=new',
            //url: 'http://localhost/~andylu/BillLocal.php',
        }).then(function successCallback(response){
            $scope.neoBills =response.data.results;
        }, function errorCallback(response){
            // called asynchronously if an error occurs
            // or server returns response with an error status
        });
        
        // GET 'Committees' information from php code => $scope.Comms 应急处理
        $http({
            method: 'GET',
            url: 'congressApp.php?index=comm',
            //url: 'http://localhost/~andylu/CommitteeJSON.php',
        }).then(function successCallback(response){
            $scope.Comms =response.data.results;
        }, function errorCallback(response){
            // called asynchronously if an error occurs
            // or server returns response with an error status
        });
        
        
        /* ******************************  The controller code for Legislator  ************************************** */
        
        $scope.legiTab = 1; // Legislator默认tab处于1号位，即为By State
        $scope.legiFiltText = ''; // 用来区分State，House 或是 Senate
        $scope.legiTabName = 'State'; // 初始Search By {{}}
        $scope.curLegi = ''; // Legislator的View Detail中，当前Legis数组中的元素
        $scope.curLegiComm = ''; // Legislator的View Detail中，属于该Legislator的Committees
        $scope.termVal = ''; // 显示的进度条，任期进度的百分之几
        //$scope.myStar = 'star_white'; // 收藏的默认白色星星
        $scope.currentPage = 1; // Pagination当前页码
        $scope.pageSize = 10; // 每页显示的Legislator数目
        //$window.localStorage.test="usc";
        //$scope.test=$window.localStorage.test;
        
        /* select and isSelected are two expressions used to control the Tabs in legislatior table */
        $scope.legiSelect = function(setTab) {
            $scope.legiTab = setTab;
            if (setTab === 2){
                $scope.legiFiltText = "house";
                $scope.legiTabName = "House";
            } else if (setTab === 3){
                $scope.legiFiltText = "senate";
                $scope.legiTabName = "Senate";
            }else{
                $scope.legiFiltText = "";
                $scope.legiTabName = "State";
            }
        };
        
        /* 'passLegi' expression is used to pass the data to Legislator Details page */
        $scope.passLegi = function(Legi){
            
            $scope.curLegi = Legi;
            
            var findComm = $scope.curLegi.bioguide_id;
            // GET 'Committees' information of Specific Legislator => $scope.legiComms 应急处理
            $scope.legiCommUrl = 'congressApp.php?index='+findComm;
            $http({
                method: 'GET',
                url: $scope.legiCommUrl,
                //url: 'http://localhost/~andylu/CommitteeJSON.php',
            }).then(function successCallback(response){
                $scope.legiComms =response.data.results;
            }, function errorCallback(response){
                // called asynchronously if an error occurs
                // or server returns response with an error status
            });
            
            var findBill = $scope.curLegi.bioguide_id;
            // GET 'bills' information from php code => $scope.Bills 应急处理
            $scope.legiBillUrl = 'congressApp.php?type=bill&index='+findBill;
            $http({
                method: 'GET',
                url: $scope.legiBillUrl,
                //url: 'http://localhost/~andylu/BillLocal.php',
            }).then(function successCallback(response){
                $scope.legiBills =response.data.results;
            }, function errorCallback(response){
                // called asynchronously if an error occurs
                // or server returns response with an error status
            });
            /* code to calculate the term */
            var begin_date = Date.parse(Legi.term_start);
            var end_date = Date.parse(Legi.term_end);
            var now = new Date();
            var diff1 = now.getTime() - begin_date;
            var diff2 = end_date - begin_date;
            
            var result = (diff1*100)/diff2;
            var str = result.toFixed(0).toString();
            $scope.termVal = str + "%";
            /* end for this term code */
        };
        /* 注意：此处为Favorite(Legislator)的功能之“存” */
        /* 本方程在用户点击收藏用星号的时候起作用：第一次点击，存进localStorage,第二次点击从localStorage中删去 */
        $scope.setFavorLegi = function(Legi_id) {
            if($window.localStorage.getItem(Legi_id) == Legi_id){
                $window.localStorage.removeItem(Legi_id);
            } else {
                $window.localStorage.setItem(Legi_id, Legi_id);
            }   
        };
//      /* 本方法用于判断curLegi是否已被储存到本地 */
        $scope.isStoredLegi=function(myId){
            if($window.localStorage.getItem(myId) == myId){
                return true;
            } else {
                return false;
            }   
        }
        
        /* ****************************  The controller code for Bill  ***************************************** */
        $scope.billTab = 1; // Bill默认tab处于1号位，即为Active Bill
        $scope.billFiltText = true; // 用来区分Active Bill 或是 New Bill
//        $scope.currentPage = 1; // Pagination当前页码
//        $scope.pageSize = 10; // 每页显示的Legislator数目
        
        /* select and isSelected are two expressions used to control the Tabs in legislatior table */
        $scope.billSelect = function(setTab) {
            $scope.billTab = setTab;
            if (setTab === 2){
                $scope.billFiltText = false;
            }else{
                $scope.billFiltText = true;
            }
        };
        
        /* 'passLegi' expression is used to pass the data to Legislator Details page */
        $scope.passBill = function(myLcrBill){
            $scope.curBill = myLcrBill;
        };
        
        /* 注意：此处为Favorite(Bill)的功能之“存” */
        /* 本方程在用户点击收藏用星号的时候起作用：第一次点击，存进localStorage,第二次点击从localStorage中删去 */
        $scope.setFavorBill = function(Bill_id) {
            if($window.localStorage.getItem(Bill_id) == Bill_id){
                $window.localStorage.removeItem(Bill_id);
            } else {
                $window.localStorage.setItem(Bill_id, Bill_id);
            }   
        };
        
        /* 本方法用于判断curBill是否已被储存到本地 */
        $scope.isStoredBill=function(myId){
            if($window.localStorage.getItem(myId) == myId){
                return true;
            } else {
                return false;
            }   
        }
        
        /* ****************************  The controller code for Committee  ************************************ */
        $scope.commTab = 1; // Comm默认tab处于1号位，即为House
        $scope.commFiltText = 'house'; // 用来区分House, Senate 或是 Joint
        $scope.curComm = ''; // 当前的Committee数组，用于处理'favorite'和'local storage'
        
//        $scope.currentPage = 1; // Pagination当前页码
//        $scope.pageSize = 5; // 每页显示的Legislator数目
        
        /* select and isSelected are two expressions used to control the Tabs in legislatior table */
        $scope.commSelect = function(setTab) {
            $scope.commTab = setTab;
            if (setTab === 2){
                $scope.commFiltText = "senate";
            }else if (setTab === 3){
                $scope.commFiltText = "joint";
            }else{
                $scope.commFiltText = "house";
            }
        };
        /* 注意：此处为Favorite(Committee)的功能之“存” */
        /* 本方程在用户点击收藏用星号的时候起作用：第一次点击，存进localStorage,第二次点击从localStorage中删去 */
        $scope.setFavorComm = function(Comm_id) {
            if($window.localStorage.getItem(Comm_id) == Comm_id){
                $window.localStorage.removeItem(Comm_id);
            } else {
                $window.localStorage.setItem(Comm_id, Comm_id);
            }   
        };
        
        /* 本方法用于判断Comm是否已被储存到本地 */
        $scope.isStoredComm=function(myId){
            if($window.localStorage.getItem(myId) == myId){
                return true;
            } else {
                return false;
            }   
        }
        
        /* ****************  The controller code for Favorites  ********************** */
        $scope.favorTab = 1; // Favor默认tab处于1号位，即为legislator
        $scope.favorFlagText = 'legislators'; // 用来区分House, Senate 或是 Joint 
//        $scope.currentPage = 1; // Pagination当前页码
//        $scope.pageSize = 5; // 每页显示的Legislator数目
        
        /* select and isSelected are two expressions used to control the Tabs in legislatior table */
        $scope.favorSelect = function(setTab) {
            $scope.favorTab = setTab;
            if (setTab === 2){
                $scope.favorFlagText = "bills";
            }else if (setTab === 3){
                $scope.favorFlagText = "committees";
            }else{
                $scope.favorFlagText = "legislators";
            }
        };
        
        /* 注意：此处为Favorite(Committee)的功能之“删” */
        /* 本方程在用户点击删除用trash can符号的时候起作用：点击之后从localStorage中删去 */
        $scope.delFavor = function(any_id) {
            $window.localStorage.removeItem(any_id);
        };
    }])
;

// OtherController是用来控制Pagination的Controller
function OtherController($scope) {
  $scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
}

congressApp.controller('OtherController', OtherController);

/* Reference: http://www.jb51.net/article/77076.htm */
congressApp.filter('saveLegi', function($window) {
    return function(input) {
        var out = [];
        angular.forEach(input, function(Legi) {
            if (Legi.bioguide_id == $window.localStorage.getItem(Legi.bioguide_id)) {
                out.push(Legi);
            }
        });
        return out;  
    };
});

congressApp.filter('saveBill', function($window) {
    return function(input) {
        var out = [];
        angular.forEach(input, function(myFavorBill) {
            if (myFavorBill.bill_id == $window.localStorage.getItem(myFavorBill.bill_id)) {
                out.push(myFavorBill);
            }
        });
        return out;  
    };
});

congressApp.filter('saveComm', function($window) {
    return function(input) {
        var out = [];
        angular.forEach(input, function(comm) {
            if (comm.committee_id == $window.localStorage.getItem(comm.committee_id)) {
                out.push(comm);
            }
        });
        return out;  
    };
});