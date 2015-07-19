'use strict';

angular.module('individualizerApp')
  .controller('AdminCtrl', function ($scope, UserService, $timeout) {
        $scope.admin = UserService.admin;
        $scope.user = UserService.user;

        $scope.saveFields = function() {
            UserService.saveFields();
        };

        $scope.csvSelected = function($event, files) {
            //Net ID, Family Name, Given Name, Field 1, Field 2, Field 3, Field 4, Field 5, Field 6
            $scope.importErrors = [];
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                var reader = new FileReader();
                reader.onload = (function() {
                    var dsv = d3.dsv(',', "text/plain");
                    var importObj = dsv.parseRows(this.result);
                    var import_data = "";
                    var students = "";
                    if (importObj.length < 1 || importObj[0].length < 4) {
                        alert("Import file was not valid.");
                    } else {
                        importObj.shift();
                        var studentList = [];
                        var student;
                        angular.forEach(importObj, function(r) {
                            student = {};
                            import_data += "(" + UserService.user.assignment_id + ',"';
                            for (var i = 0; i < r.length; i++) {
                                if (i === 0) {
                                    r[i] = r[i].toLowerCase();
                                    student.net_id = r[i];
                                } else if (i === 1) {
                                    student.family_name = r[i];
                                } else if (i === 2) {
                                    student.given_name = r[i];
                                } else {
                                    student['field_' + (i-2)] = r[i];
                                }
                                import_data += r[i].trim() + '","';
                            }
                            for (var j = i; j < 9; j++) {
                                import_data += '","';
                                //student['field_' + (j-2)] = "NULL";
                            }
                            import_data = import_data.slice(0,-2);
                            import_data +=  "),";
                            students += r[0] + ',';
                            studentList.push(student);
                        });
                        import_data = import_data.slice(0,-1);
                        students = students.slice(0,-1);
                    }
                    $scope.adminGridOptions.data = studentList;
                    if (import_data !== '') {
                        UserService.importStudents(import_data, students, importObj.length);
                    } else {
                        $scope.admin.import_res = "No data imported.";
                    }
                    $scope.$apply();
                    f = null;
                    reader = null;


                });
                reader.readAsText(f);
            }
        };

        $scope.adminGridOptions = {
            enableFiltering: true,
            enableSorting: true,
            showGridFooter: true,
            columnDefs: [
                { field: 'net_id', displayName:"Net ID"},
                { field: 'family_name', displayName:"Family Name", width:120},
                { field: 'given_name', displayName:"Given Name", width:120},
                { field: 'field_1', displayName:"Field 1"},
                { field: 'field_2', displayName:"Field 2"},
                { field: 'field_3', displayName:"Field 3"},
                { field: 'field_4', displayName:"Field 4"},
                { field: 'field_5', displayName:"Field 5"},
                { field: 'field_6', displayName:"Field 6"}
            ]
        };

        $timeout(function() {
            $scope.adminGridOptions.data = UserService.admin.students;
        }, 1000);


  });

angular.module('individualizerApp').
    directive('fileChange', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var attrHandler = $parse(attrs['fileChange']);
                var handler = function (e) {
                    $scope.$apply(function () {
                        attrHandler($scope, { $event: e, files: e.target.files });
                    });
                };
                element[0].addEventListener('change', handler, false);
            }
        };
    }]);
