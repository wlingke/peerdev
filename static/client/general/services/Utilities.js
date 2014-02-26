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
        if (str.indexOf('http://') === -1 && str.indexOf('https://') === -1) {
            str = "http://" + str.trim();
        }
        return str;
    };
    
    return {
        ensureUrlProtocol: ensureUrlProtocol
    };
});
