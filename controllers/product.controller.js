(function () {
    'use strict';

    angular
        .module('redrickApp')
        .controller('ProductController', ProductController);


    ProductController.$inject = ['$location', '$parse', '$scope', '$rootScope', 'config'];
    function ProductController($location, $parse, $scope, $rootScope, config) {
        var redrick = this;
        redrick.invalid = false;
        var token = null;
        token = $location.search().product;
        var variables = token.split('-');
        redrick.option1 = variables[0];
        redrick.option2 = variables[1];
        redrick.option3 = variables[2];

        if(token == null) {
            redrick.invalid = true;
        }
        else {
          checkOption1(redrick.option1);
          checkOption2(redrick.option2);
          checkOption3(redrick.option3);
          redrick.invalid = false;
        }

        function checkOption1(op1) {
            var url = "app-content/json/option_1.json";
            readTextFile(url, function(text){
                var data = JSON.parse(text);
                var id = data.option_1[op1-1].id;
                if(id == null) {
                  redrick.invalid = true;
                }
                else {
                  redrick.op1 = data.option_1[op1-1].name;
                  redrick.op1_code = data.option_1[op1-1].id;
                }
            });
        }

        function checkOption2(op2) {
            var url = "app-content/json/bk-source.json";
            readTextFile(url, function(text){
                var data = angular.fromJson(text);
                for(var i=0; i<data.length; i++)
                {
                    if (op2 == data[i].code)
                    {
                      redrick.op2FP = data[i].name;
                    }
                }
            });
            var url2 = "app-content/json/option_2/" + redrick.option1 + ".json";
            readTextFile(url2, function(text){
                var data = JSON.parse(text);
                for(var i=0; i<data.option_2.length; i++)
                {
                    if (redrick.op2FP == data.option_2[i].name)
                    {
                      redrick.op2 = data.option_2[i].name;
                      redrick.op2_code = data.option_2[i].id;
                    }
                }
            });
        }

        function checkOption3(op3) {
            var url = "app-content/json/option_3.json";
            readTextFile(url, function(text){
                var data = JSON.parse(text);
                var the_string = "option_3_" + redrick.op1_code + "_" + redrick.op2_code;
                var option_3_source = data[the_string];
                for(var i=0; i<option_3_source.length; i++)
                {
                    if ((op3) == option_3_source[i].id)
                    {
                      redrick.op3 = option_3_source[i].name;
                    }
                }
                if(redrick.op3 == null) {
                  redrick.invalid = true;
                }
            });
        }





        function readTextFile(file, callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        }

      redrick.optionOneSelected = function() {
          redrick.option1 = $scope.optionOne;
          var url = "app-content/json/option_2/" + redrick.option1.id + ".json";
          readTextFile(url, function(text){
              var data = JSON.parse(text);
              $scope.option_2 = data.option_2;
              $scope.$digest();
          });
      };

      redrick.optionTwoSelected = function() {
          redrick.option2 = $scope.optionTwo;
          var url = "app-content/json/option_3.json";
          readTextFile(url, function(text){
              var data = JSON.parse(text);
              var the_string = "option_3_" + redrick.option1.id + "_" + redrick.option2.id;
              $scope.option_3 = data[the_string];
              redrick.noProducts = false;
              if(data[the_string]==null) {
                redrick.noProducts = true;
                redrick.pdtData1 = $scope.optionOne.name;
                redrick.pdtData2 = $scope.optionTwo.name;
              }
              $scope.$digest();
          });
      };

      redrick.optionThreeSelected = function() {
          redrick.option3 = $scope.optionThree;
          createBarcode();
      };

      function createBarcode() {
        var url = "app-content/json/bk-source.json";
        readTextFile(url, function(text){
            var data = angular.fromJson(text);
            redrick.barcodeSource = data;
            var op2ShortName;
            for(var i=0; i<redrick.barcodeSource.length; i++)
            {
                if ($scope.optionTwo.name == redrick.barcodeSource[i].name)
                {
                  op2ShortName = redrick.barcodeSource[i].code;
                }
            }
            var payload = $scope.optionOne.id + "-" + op2ShortName + "-" + $scope.optionThree.id;
            JsBarcode("#productBarcode", payload);
        });
      }

      //usage:
      readTextFile("app-content/json/option_1.json", function(text){
          var data = JSON.parse(text);
          $scope.option_1 = data.option_1;
          $scope.optionOne = $scope.option_1[0];
      });

    }

})();
