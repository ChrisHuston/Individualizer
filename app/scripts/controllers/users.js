'use strict';

angular.module('assignmentRouterApp')
  .controller('UsersCtrl', function ($scope, $http, UserService) {
        $scope.admin = UserService.admin;
        $scope.showGrid = true;
        $scope.currentSection = 1;

        $scope.csvSelected = function($event, files) {
            //Net ID, User ID, Password
            $scope.importErrors = [];
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                var reader = new FileReader();
                reader.onload = (function() {
                    var dsv = d3.dsv($scope.imports.delimiter.character, "text/plain");
                    var importObj = dsv.parseRows(this.result);
                    var import_data = "";
                    var students = "";
                    if (importObj.length < 1 || importObj[0].length !== 3) {
                        alert("Import file was not valid.");
                    } else {
                        importObj.shift();
                        angular.forEach(importObj, function(r) {
                            import_data += "('" + r[0] + "','" + r[1] + "','" + r[2] + "'," + UserService.user.assignment_id + "),";
                            students += r[0] + ',';
                        });
                        import_data = import_data.slice(0,-1);
                        students = students.slice(0,-1);
                    }

                    if (import_data !== '') {
                        importCSV(import_data, importObj.length);
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





        $scope.getStudents = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            $http({method: 'POST',
                url: UserService.appDir + 'php/getStudents.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    var students = data.students;
                    var members = "";
                    var ids = "(";
                    var student_index = 1;

                    angular.forEach(students, function(s) {
                        s.net_id = s.user.login_id;
                        s.section_id = s.course_section_id;
                        s.user_name = s.user.sortable_name;
                        s.canvas_user_id = s.user_id;
                        for (var i=0; i < $scope.admin.sections.length; i++) {
                            if ($scope.admin.sections[i].section_id=== s.section_id) {
                                s.section = $scope.admin.sections[i].section;
                                break;
                            }
                        }

                        var member = "(" + UserService.admin.course_id + ",'" + s.net_id + "',\"" + s.user_name + "\"," + s.section_id + "," + s.canvas_user_id + ")";
                        ids += "'" + s.net_id + "'";

                        if (students.length !== student_index) {
                            member += ", ";
                            ids += ", ";
                        }
                        members += member;
                        student_index += 1;
                    });
                    ids += ")";
                    addUsers(members, ids);
                    $scope.admin.users = students;
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Get students failed. Check your internet connection");
                });
        };

        var addUsers = function(members, ids) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "addUsers.php";
            var params = {};
            params.members = members;
            params.ids = ids;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    console.log(data);
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Add users failed. Check your internet connection");
                });
        };


        $scope.courseStudentsGridOptions = { data: 'admin.users',
            columnDefs: [{displayName:'Del', headerClass:'centeredCol', width:"50", cellClass:'centeredCol',
                cellTemplate:'<div class="ngCellText colt{{$index}}" ng-click="removeStudent(row.entity)"><i class="fa fa-trash-o"></i></div>'},
                {field:'user_name', displayName:'Name', headerClass:'centeredCol', width:"*", enableCellEdit: true},
                {field:'net_id', displayName:'NetID', headerClass:'centeredCol', width:"100"},
                {field:'section', displayName:'Section', headerClass:'centeredCol', width:"100", cellClass:'centeredCol'}
            ],
            showGroupPanel: false,
            showColumnMenu: false,
            canSelectRows: true,
            enableCellSelection:true,
            showFilter: true,
            multiSelect: false,
            keepLastSelected: false,
            footerVisible: false,
            maintainColumnRatios:true,
            displaySelectionCheckbox: false
        };

        var lastCell = '';

        $scope.$on('ngGridEventStartCellEdit', function(evt){
            lastCell = evt.targetScope.row.entity[evt.targetScope.col.field];
        });


        $scope.$on('ngGridEventEndCellEdit', function(evt){
            var row = evt.targetScope.row.entity;
            if (row[evt.targetScope.col.field] !== lastCell) {
                var uniqueSuffix = "?" + new Date().getTime();
                var params = {};
                params.net_id = row.net_id;
                params.user_name = row.user_name.trim();
                $http({method: 'POST',
                    url: UserService.appDir + 'php/updateUser.php' + uniqueSuffix,
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).
                    success(function() {
                    }).
                    error(function(data, status) {
                        alert("Error: " + status + " Update nickname failed. Check your internet connection");
                    });
            }

        });

        $scope.removeStudent = function(student) {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            params.net_id = student.net_id;
            $http({method: 'POST',
                url: UserService.appDir + 'php/removeCourseStudent.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function() {
                    for (var i=0; i < $scope.course.students.length; i++) {
                        if ($scope.course.students[i].net_id === student.net_id) {
                            $scope.course.students.splice(i,1);
                            break;
                        }
                    }
                    $scope.all_students.unshift(student);
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Remove from course failed. Check your internet connection");
                });
        };

        var addSections = function(inserts) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "addSections.php";
            var params = {};
            params.inserts = inserts;
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    console.log(data);
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Add sections failed. Check your internet connection");
                });
        };

        $scope.getSections = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "getSections.php";
            var params = {};
            $http({method: 'POST',
                url: UserService.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    var sections = JSON.parse(data.sections);
                    sections = _.sortBy(sections, function(s) {return s.id;});
                    var section_num = 1;
                    var inserts = "";
                    angular.forEach(sections, function(s) {
                        s.section = section_num;

                        s.section_id = s.id;
                        var values = "(" + UserService.admin.course_id + "," + s.section + "," + s.section_id + ")";
                        if (sections.length > section_num) {
                            values += ", ";
                        }
                        inserts += values;
                        section_num += 1;
                    });
                    addSections(inserts);
                    $scope.admin.sections = sections;
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Get sections failed. Check your internet connection");
                });
        };



  });
