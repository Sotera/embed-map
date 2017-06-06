'use strict';
angular.module('myApp')
.directive('postMessage', [function() {

  function link(scope, elem, attrs) {
    window.addEventListener('message', receiveMessage, false);

    // event.data should match options available on leaflet directive
    // https://github.com/angular-ui/ui-leaflet
    function receiveMessage(event) {
      console.info(event.data);
      const options = event.data;
      options.geojson.onEachFeature = onEachFeature; // send marker click to parent
      angular.extend(scope, options);
      scope.$apply();
      scope.dirty=true;
    }
  }

  function onClick(event) {
    // console.info(event);
    const outbound = {
      feature: event.target.feature,
      latlng: event.latlng,
      type: event.type
    };
    if (window.parent) {
      window.parent.postMessage(outbound, '*');
    } else {
      console.info('Parent will receive: ', outbound);
    }
  }

  function onEachFeature(feature, layer) {
    layer.on({
      click: onClick
    });
  }

  return {
    link: link
  };
}]);
