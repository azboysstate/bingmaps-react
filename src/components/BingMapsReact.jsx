// DEPENDENCIES
import React, { useEffect, useRef, useCallback } from "react";

export default function BingMapsReact({
  bingMapsKey,
  mapOptions,
  height,
  width
}) {
  const scriptLoadInterval = useRef(null);
  const mapContainer = useRef(null);

  const initMap = useCallback(() => {
    function makeMap() {
      const { Maps } = window.Microsoft;
      const options = { ...mapOptions };
      if (mapOptions && mapOptions.navigationBarMode) {
        options.navigationBarMode =
          Maps.NavigationBarMode[mapOptions.navigationBarMode];
      }
      if (mapOptions && mapOptions.navigationBarOrientation) {
        options.navigationBarOrientation =
          Maps.NavigationBarOrientation[mapOptions.navigationBarOrientation];
      }
      if (mapOptions && mapOptions.supportedMapTypes) {
        options.supportedMapTypes = mapOptions.supportedMapTypes.map(
          type => Maps.MapTypeId[type]
        );
      }
      const newMap = new Maps.Map(mapContainer.current, {});
      newMap.setOptions(options);
    }

    if (window.Microsoft && window.Microsoft.Maps) {
      makeMap();
    } else {
      const scriptTag = document.createElement("script");
      scriptTag.src = `https://www.bing.com/api/maps/mapcontrol?key=${bingMapsKey}`;
      document.body.appendChild(scriptTag);
      scriptLoadInterval.current = window.setInterval(() => {
        if (window.Microsoft && window.Microsoft.Maps) {
          window.clearInterval(scriptLoadInterval.current);
          makeMap();
        }
      }, 500);
    }
  }, [bingMapsKey, mapOptions]);

  useEffect(() => {
    initMap();
    return () => {
      window.clearInterval(scriptLoadInterval.current);
    };
  }, [bingMapsKey, initMap]);

  return (
    <div ref={mapContainer} style={{ height: height, width: width }}></div>
  );
}
BingMapsReact.defaultProps = {
  bingMapsKey: undefined,
  mapOptions: undefined,
  height: "100%",
  width: "100%"
};
