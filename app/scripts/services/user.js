'use strict';

angular.module('individualizerApp')
  .factory('UserService', function ($http, $location) {
        var userInstance = {};

        userInstance.appDir = '/app/individualizer/';

        userInstance.admin = {students:[]};
        userInstance.user = {loginError:null, priv_level:1, assignment_id:null,
            fields:{},
            values:{}};

        userInstance.login = function(gridOptions) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script = "lti_login.php";
            var params = {};
            $http({method: 'POST',
                url: userInstance.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    if (data.login_error === "NONE") {
                        userInstance.user.priv_level = parseInt(data.priv_level);
                        userInstance.user.assignment_id = data.assignment_id;
                        if (data.fields.length > 0) {
                            userInstance.user.fields = data.fields[0];
                        }
                        if (userInstance.user.priv_level > 1) {
                            userInstance.admin.students = data.students;
                            $location.path('/admin');
                        } else {
                            if (data.values.length > 0) {
                                userInstance.user.values = data.values[0];
                            }
                            canvasGradePassback(true);
                            $location.path('/');
                        }

                    } else {
                        userInstance.user.loginError =  data.login_error;
                    }
                }).
                error(function(data, status) {
                    userInstance.user.loginError =  "Error: " + status + " Sign-in failed. Check your internet connection";
                });
        };

        userInstance.login();

        var canvasGradePassback = function(retry) {
            var uniqueSuffix = "?" + new Date().getTime();
            var params = {};
            $http({method: 'POST',
                url: userInstance.appDir + 'php/canvasGradePassback.php' + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    console.log(data);
                    if (data.indexOf("failure") !== -1 && retry) {
                        canvasGradePassback(false);
                    }
                }).
                error(function(data, status) {
                    console.log("Error: " + status + " Canvas grade passback failed. Check your internet connection");
                });
        };

        userInstance.importStudents = function(students, ids, num_students) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script = "addStudents.php";
            var params = {};
            params.students = students;
            params.ids = ids;
            params.assignment_id = userInstance.user.assignment_id;
            $http({method: 'POST',
                url: userInstance.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    if (!data) {
                        userInstance.admin.import_res = "Import students failed."
                    } else {
                        userInstance.admin.import_res = "Processed " + num_students + " students for import.";
                    }
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Import students failed. Check your internet connection");
                });
        };

        userInstance.saveFields = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script = "saveFields.php";
            var params = {};
            params.field_1 = userInstance.user.fields.field_1;
            params.field_2 = userInstance.user.fields.field_2;
            params.field_3 = userInstance.user.fields.field_3;
            params.field_4 = userInstance.user.fields.field_4;
            params.field_5 = userInstance.user.fields.field_5;
            params.field_6 = userInstance.user.fields.field_6;
            params.assignment_id = userInstance.user.assignment_id;
            $http({method: 'POST',
                url: userInstance.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    if (!data) {
                        alert("Save field labels failed.");
                    }
                }).
                error(function(data, status) {
                    alert("Error: " + status + " Save field labels failed. Check your internet connection");
                });
        };

        return userInstance;
  });
