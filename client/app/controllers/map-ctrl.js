angular.module('myApp')
.controller('MapCtrl', [ '$scope', '$http', "leafletMapEvents", "leafletData",
  function($scope, $http, leafletMapEvents, leafletData) {
    $scope.dirty = false;

    leafletData.getMap().then((map) => {
      map.on("layeradd",()=>{
        if($scope.dirty){
          $scope.dirty=false;
          $scope.fitBounds();
        }
      });
    });

    $scope.fitBounds = function(){
      leafletData.getMap().then((map) => {
        const layers = [];
        map.eachLayer((layer)=>{
          if(layer instanceof L.Marker || layer instanceof L.GeoJSON) layers.push(layer);
        });
        if(layers.length === 0) return;
        const group = new L.FeatureGroup(layers);

        let bounds = group.getBounds();
        if(!bounds.isValid()){
          console.log("Error calculating bounds");
          return;
        }
        //avoid bug in leaflet ui that causes a map error when taking bounds on a single point
        if(bounds.getNorthEast().distanceTo(bounds.getSouthWest()) < 500)
          return;
        console.log(JSON.stringify(bounds));
        map.fitBounds(bounds);

      });
    };

    angular.extend($scope, {
    // center: {
    //   autoDiscover: true
    // },
    center: {
      lat: -8.98,
      lng: -38.22,
      zoom: 8
    },
    defaults: {
      // scrollWheelZoom: false
    },
    tiles: {
      url: "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
    }
  });
}]);
