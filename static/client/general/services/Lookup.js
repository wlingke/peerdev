app.factory('Lookup', function ($log) {
    function Lookup(data, lookupBy) {
        this.lookupObj = {};

        for (var i = 0, len = data.length; i < len; i++) {
            this.lookupObj[data[i][lookupBy]] = data[i];
        }
    }

    Lookup.prototype.get = function (value, returnProperty, muteLog) {
        if (this.lookupObj.hasOwnProperty(value)) {
            //returns requested property or object if no property is specified
            return !!returnProperty ? this.lookupObj[value][returnProperty] : this.lookupObj[value];

        } else {
            if (!muteLog) {
                $log.error("Invalid lookup value: " + value);
            }
            return '';
        }
    };

    return {
        create: function (data, lookupBy) {
            return new Lookup(data, lookupBy);
        }
    };
});