RVStatus.factory('StatusService', function () {
    function StatusService(defaultWorkingMessage, defaultErrorMsg, defaultSuccessMsg) {
        this.msg = '';
        this.isWorking = false;
        this.hasError = false;
        this.hasSuccess = false;
        this.defaultWorkingMessage = defaultWorkingMessage || "Loading...";
        this.defaultErrorMsg = defaultErrorMsg || "Oops, there's an error. Please reload and again.";
        this.defaultSuccessMsg = defaultSuccessMsg || "Success!";
    }

    StatusService.prototype.showWorking = function (msg) {
        this.reset();
        this.msg = msg || this.defaultWorkingMessage;
        this.isWorking = true;
        return this;
    };

    StatusService.prototype.showError = function (msg) {
        this.reset();
        this.msg = msg || this.defaultErrorMsg;
        this.hasError = true;
        return this;
    };

    StatusService.prototype.showSuccess = function (msg) {
        this.reset();
        this.msg = msg || this.defaultSuccessMsg;
        this.hasSuccess = true;
        return this;
    };

    StatusService.prototype.reset = function () {
        this.msg = "";
        this.isWorking = false;
        this.hasError = false;
        this.hasSuccess = false;
        return this;
    };

    return {
        create: function (defaultWorkingMessage, defaultErrorMsg, defaultSuccessMsg) {
            return new StatusService(defaultWorkingMessage, defaultErrorMsg, defaultSuccessMsg);
        },
        createSaveStatus: function(){
            return new StatusService('Saving...', "Oops, there's an error. Please check the form again.", "Success!")
        }
    };


});