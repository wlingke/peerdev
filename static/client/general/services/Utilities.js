app.factory('Utilities', function () {

    /**
     * Appends 'http://' to a sanitized URL if it doesn't have a 'http://' or 'https://'
     * This method does modify the original string
     *
     * @param url (String)
     * @return (String) Properly formatted url
     */
    var ensureUrlProtocol = function (url) {
        var str = angular.copy(url);
        if (!!url && angular.isString(url) && str.indexOf('http://') === -1 && str.indexOf('https://') === -1) {
            return "http://" + str.trim();
        }
        return '';
    };

    return {
        ensureUrlProtocol: ensureUrlProtocol
    };
});
