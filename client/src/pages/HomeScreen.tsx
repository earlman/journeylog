import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";

interface CountryCard {
  id: string;
  name: string;
  imageUrl: string;
  visited?: boolean;
}

const countries: CountryCard[] = [
  {
    id: "vietnam",
    name: "VIETNAM",
    imageUrl: "/figmaAssets/image-9.png",
    visited: false
  },
  {
    id: "japan", 
    name: "JAPAN",
    imageUrl: "/figmaAssets/image-9.png",
    visited: false
  },
  {
    id: "singapore",
    name: "SINGAPORE", 
    imageUrl: "/figmaAssets/image-9.png",
    visited: false
  },
  {
    id: "philippines",
    name: "PHILIPPINES",
    imageUrl: "/figmaAssets/image-9.png",
    visited: true
  },
  {
    id: "thailand",
    name: "THAILAND",
    imageUrl: "/figmaAssets/image-9.png",
    visited: false
  }
];

export const HomeScreen = (): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  useLayoutEffect(() => {
    if (!mapRef.current) return;

    // Create root
    const root = am5.Root.new(mapRef.current);

    // Set themes
    root.setThemes([am5themes_Dark.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        wheelX: "zoom",
        wheelY: "zoom",
        projection: am5map.geoMercator(),
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 20
      })
    );

    // Create world polygon series
    const worldSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"] // Exclude Antarctica
      })
    );

    // Configure polygon appearance
    worldSeries.mapPolygons.template.setAll({
      fill: am5.color("#404040"),
      stroke: am5.color("#263240"),
      strokeWidth: 1,
      tooltipText: "{name}",
      interactive: true,
      cursorOverStyle: "pointer"
    });

    // Highlight visited countries using ISO codes
    const visitedCountries = ["PH"]; // Philippines ISO code
    const countryRoutes: { [key: string]: string } = {
      "PH": "/travel-log",
      "VN": "/vietnam",
      "JP": "/japan", 
      "SG": "/singapore",
      "TH": "/thailand"
    };

    worldSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
      const dataItem = target.dataItem;
      if (dataItem) {
        const countryData = dataItem.dataContext as any;
        const countryId = countryData?.id as string;
        if (countryId && visitedCountries.includes(countryId)) {
          return am5.color("#f9e897");
        }
      }
      return fill;
    });

    // Add hover states
    worldSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#f9e897"),
      opacity: 0.8
    });



    // Add click functionality to navigate to country pages
    worldSeries.mapPolygons.template.events.on("click", (ev) => {
      const dataItem = ev.target.dataItem;
      if (dataItem) {
        const countryData = dataItem.dataContext as any;
        const countryId = countryData?.id as string;
        const countryName = countryData?.name as string;
        console.log("Clicked country ID:", countryId); // Debug log
        console.log("Clicked country name:", countryName); // Debug log
        console.log("Available routes:", Object.keys(countryRoutes)); // Debug log
        
        if (countryId && countryRoutes[countryId]) {
          console.log("Navigating to:", countryRoutes[countryId]); // Debug log
          setLocation(countryRoutes[countryId]);
        }
      }
    });

    // Focus on Southeast Asia region
    chart.set("zoomLevel", 2);
    chart.goHome(0);
    
    // Add zoom controls
    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div className="bg-[#263240] min-h-screen w-full">
      <div className="w-full max-w-[393px] mx-auto relative">
        {/* Map section */}
        <div className="h-[400px] w-full">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Country cards section */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {countries.map((country, index) => (
              <Card
                key={country.id}
                className={`relative overflow-hidden bg-transparent border-0 shadow-none ${
                  index === countries.length - 1 ? "col-span-1" : ""
                }`}
              >
                <Link to={country.visited ? "/travel-log" : "#"}>
                  <div 
                    className="relative h-[120px] w-full cursor-pointer transition-transform duration-200 hover:scale-105"
                    style={{
                      backgroundImage: `url(${country.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/40" />
                    
                    {/* Country name */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="[font-family:'Tungsten-Medium',Helvetica] font-medium text-white text-lg tracking-wide">
                        {country.name}
                      </div>
                    </div>

                    {/* Visited indicator */}
                    {country.visited && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-[#f9e897] rounded-full border-2 border-white" />
                      </div>
                    )}
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-[52px] bg-[#263240] flex items-center justify-center border-t border-[#404040]">
          <div className="flex items-center gap-2">
            <div className="w-[23px] h-[23px] bg-[url(/figmaAssets/vector.svg)] bg-[100%_100%]" />
            <div className="[font-family:'Inconsolata',Helvetica] font-normal text-[#f9e897] text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
              create your journeylog
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};