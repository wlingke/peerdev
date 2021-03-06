/**
 * Version 1.1.0
 * Last Update: 3/21/2014
 * Dependencies: Bootstrap alerts.js
 */

var RVAlerts = angular.module('RVAlerts', []);

RVAlerts.provider('UniversalAlertService', function () {
    var alerts_container = "body";
    return {
        setContainer: function (container) {
            alerts_container = container;
        },
        $get: function ($interval) {
            var getAlertType = function (type) {
                switch (type) {
                    case "success":
                        return "alert-success";
                    case "error":
                        return "alert-danger";
                    case "warning":
                        return "alert-warning";
                    case "info":
                        return "alert-info";
                    default:
                        return "alert-info";
                }
            };

            var createAlert = function (msg, permanent, type, wait_time) {
                //permanent takes value of true

                var alert_type = getAlertType(type);

                /* jshint -W014 */
                var elemStr = '<div class="alert alert-dismissable rv-alert-universal ' + alert_type + '" alert-permanent="'
                    + permanent + '"> <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + msg + '</strong></div>';

                var elem = $(elemStr);
                $(alerts_container).append(elem);

                if (!isNaN(parseFloat(wait_time)) && isFinite(wait_time)) {
                    $interval(function () {
                        elem.remove();
                    }, wait_time, 1);
                }

            };

            var removeAlerts = function (type, incPermanent) {
                //type accepts "all" or an alert type
                //incPermament only runs if its the true boolean

                var alert_target = "";
                if (type === "all") {
                    alert_target = ".alert";
                } else {
                    alert_target = "." + getAlertType(type);
                }

                var alerts = $(alert_target, $(".navbar-fixed-top"));
                var alertsLength = alerts.length;

                if (!!alertsLength) {
                    if (incPermanent === true) {
                        for (var i = 0; i < alertsLength; i++) {
                            alerts.eq(i).remove();
                        }
                    } else {
                        for (var j = 0; j < alertsLength; j++) {
                            if (alerts.eq(j).attr('alert-permanent') !== 'true') {
                                alerts.eq(j).remove();
                            }

                        }
                    }
                }
            };

            var removeAllTempAlerts = function () {
                //slightly more efficient alert removal for applicationController
                var alerts = $('.rv-alert-universal');
                var alertsLength = alerts.length;
                for (var j = 0; j < alertsLength; j++) {
                    if (alerts.eq(j).attr('alert-permanent') !== 'true') {
                        alerts.eq(j).remove();
                    }
                }
            };

            return {

                internals: {
                    createAlert: createAlert,
                    removeAlerts: removeAlerts
                }, //needed for testing purposes

                createWarningAlert: function (msg, permanent) {
                    removeAllTempAlerts();
                    createAlert(msg, permanent, "warning");
                },

                createSuccessAlert: function (msg, permanent) {
                    removeAllTempAlerts();
                    createAlert(msg, permanent, "success");
                },

                createTransientSuccessAlert: function (msg, permanent, delay) {
                    removeAllTempAlerts();

                    var delayTime = 4000;
                    if (!isNaN(parseFloat(delay)) && isFinite(delay)) {
                        delayTime = delay;
                    }

                    createAlert(msg, permanent, "success", delayTime);
                },

                createTransientErrorAlert: function (msg, permanent, delay) {
                    removeAllTempAlerts();

                    var delayTime = 4000;
                    if (!isNaN(parseFloat(delay)) && isFinite(delay)) {
                        delayTime = delay;
                    }

                    createAlert(msg, permanent, "error", delayTime);
                },

                createErrorAlert: function (msg, permanent) {
                    removeAllTempAlerts();
                    createAlert(msg, permanent, "error");
                },

                createTryAgainErrorAlert: function (msg, permanent) {
                    var m = msg || "Oops! Something went wrong on our end.";
                    removeAllTempAlerts();
                    var message = m + " Please refresh and try again or " +
                        "<a href='mailto:support@renovatd.com' target='_blank'>email us</a> if you continue to receive this error.";
                    createAlert(message, permanent, "error");
                },

                createInfoAlert: function (msg, permanent) {
                    removeAllTempAlerts();
                    createAlert(msg, permanent, "info");
                },

                createWorkingAlert: function (workingMsg) {
                    var msg = workingMsg || "Working...";
                    removeAllTempAlerts();
                    createAlert('<i class="fa fa-spinner fa-spin ie8n9-hide fa-fw"></i> ' + msg, false, "info");
                },

                removeAllTempAlerts: function () {
                    removeAllTempAlerts();
                },
                removeAllAlerts: function (permanent) {
                    removeAlerts("all", permanent);
                },

                removeWarningAlerts: function (permanent) {
                    removeAlerts("warning", permanent);
                },

                removeSuccessAlerts: function (permanent) {
                    removeAlerts("success", permanent);
                },

                removeErrorAlerts: function (permanent) {
                    removeAlerts("error", permanent);
                },

                removeInfoAlerts: function (permanent) {
                    removeAlerts("info", permanent);
                }
            };
        }
    }
});