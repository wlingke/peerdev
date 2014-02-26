app.factory('GoogleMaps', function($window, $q, $interval, $log){

    /**
     * Async check for availability of google maps object
     */

    var isReady = function(){
        var deferred = $q.defer();
        if($window.google && $window.google.maps){
            deferred.resolve();
        }else {
            $interval(function(){
                if($window.google && $window.google.maps){
                    deferred.resolve();
                }else {
                    $log.error('Google Maps has not loaded!')
                    deferred.reject();
                }
            })
        }
        return deferred.promise;
    };

    /**
     *
     * @param geocode_request (specified based on google maps api)
     * @returns Promise that resolves to an object {latitude: num, longitude: num}
     */
    var geocode = function(geocode_request){
        var deferred = $q.defer();
        isReady().then(function(){
            var maps = $window.google.maps;
            var Geocoder = new maps.Geocoder();
            Geocoder.geocode(geocode_request, function(result, status){
                if(status === maps.GeocoderStatus.OK ){
                    deferred.resolve({
                        latitude: result[0].geometry.location.d,
                        longitude: result[0].geometry.location.e
                    });
                }else {
                    $log.error(status);
                    deferred.reject(status);
                }
            })
        });

        return deferred.promise;
    }

    return {
        geocode: geocode
    }

});