import React, { Component } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import cities from "./mock";
import am4geodata_southKoreaHigh from "@amcharts/amcharts4-geodata/southKoreaHigh";

import AnimateNumber from "react-animated-number";
import s from "./am4chartMap.module.scss";

class Am4chartMap extends Component {
  componentDidMount() {
    let map = am4core.create("map", am4maps.MapChart);
    map.geodata = am4geodata_southKoreaHigh;
    map.percentHeight = 90;
    map.dy = 10;
    map.projection = new am4maps.projections.Miller();
    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    map.homeZoomLevel = 1.2;
    map.zoomControl = new am4maps.ZoomControl();
    map.zoomControl.layout = "horizontal";
    map.zoomControl.align = "left";
    map.zoomControl.valign = "bottom";
    map.zoomControl.dy = -10;
    map.zoomControl.contentHeight = 20;
    map.zoomControl.minusButton.background.fill = am4core.color("#C7D0FF");
    map.zoomControl.minusButton.background.stroke = am4core.color("#6979C9");
    map.zoomControl.minusButton.label.fontWeight = 600;
    map.zoomControl.minusButton.label.fontSize = 22;
    map.zoomControl.minusButton.scale = 0.75;
    map.zoomControl.minusButton.label.scale = 0.75;
    map.zoomControl.plusButton.background.fill = am4core.color("#C7D0FF");
    map.zoomControl.plusButton.background.stroke = am4core.color("#6979C9");
    map.zoomControl.plusButton.label.fontWeight = 600;
    map.zoomControl.plusButton.label.fontSize = 22;
    map.zoomControl.plusButton.label.align = "center";
    map.zoomControl.plusButton.scale = 0.75;
    map.zoomControl.plusButton.label.scale = 0.75;
    map.zoomControl.plusButton.dx = 5;
    let plusButtonHoverState =
      map.zoomControl.plusButton.background.states.create("hover");
    plusButtonHoverState.properties.fill = am4core.color("#354D84");
    let minusButtonHoverState =
      map.zoomControl.minusButton.background.states.create("hover");
    minusButtonHoverState.properties.fill = am4core.color("#354D84");
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#474D84");
    polygonTemplate.stroke = am4core.color("#6979C9");
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#354D84");
    let citySeries = map.series.push(new am4maps.MapImageSeries());
    citySeries.data = cities;
    citySeries.dataFields.value = "size";
    let city = citySeries.mapImages.template;
    city.nonScaling = true;
    city.propertyFields.latitude = "latitude";
    city.propertyFields.longitude = "longitude";
    let circle = city.createChild(am4core.Circle);
    circle.fill = am4core.color("#C7D0FF");
    circle.strokeWidth = 0;
    let circleHoverState = circle.states.create("hover");
    circleHoverState.properties.strokeWidth = 1;
    circle.tooltipText = "{tooltip}";
    circle.propertyFields.radius = "size";
    this.map = map;


    // Add heat rule
polygonSeries.heatRules.push({
  "property": "fill",
  "target": polygonSeries.mapPolygons.template,
  "min": am4core.color("#ffffff"),
  "max": am4core.color("#AAAA00"),
  "logarithmic": true   //LOG로 할지 LINEAR로 할지
});
  
    // Add heat legend
var heatLegend = map.createChild(am4maps.HeatLegend);
heatLegend.series = polygonSeries;
heatLegend.width = am4core.percent(100);

polygonSeries.mapPolygons.template.events.on("over", function(ev) {
  if (!isNaN(ev.target.dataItem.value)) {
    heatLegend.valueAxis.showTooltipAt(ev.target.dataItem.value)
  }
  else {
    heatLegend.valueAxis.hideTooltip();
  }
});

polygonSeries.mapPolygons.template.events.on("out", function(ev) {
  heatLegend.valueAxis.hideTooltip();
});

// Add expectancy data
polygonSeries.data = [
  { id : "KR-11", value: 60.524 },
  { id : "KR-46", value: 77.185 }
];
    

    let lineSeries = map.series.push(new am4maps.MapLineSeries());

    lineSeries.mapLines.template.line.stroke = am4core.color("#90AFFF");
    lineSeries.mapLines.template.line.strokeOpacity = 0.5;
    lineSeries.mapLines.template.line.strokeWidth = 4;
    lineSeries.mapLines.template.line.strokeDasharray = "3,3";
    
    lineSeries.data = [{
      "multiGeoLine": [
        [
          { "latitude": 37.530689, "longitude": 127.003066 },
          { "latitude": 35.01905, "longitude": 127.433 }
       ]
     ]
    }];
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.dispose();
    }
  }

  render() {
    return (
      <div className={s.mapChart}>
        <div className={s.stats}>
          <h6 className="mt-1">발전량</h6>
          <p className="h3 m-0">
            <span className="mr-xs fw-normal">
              <AnimateNumber
                value={165684}
                initialValue={0}
                duration={1000}
                stepPrecision={0}
                formatValue={(n) =>
                  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }
              />
            </span>
            <i className="fa fa-map-marker" />
          </p>
        </div>
        <div className={s.map} id="map">
          <span>Alternative content for the map</span>
        </div>
      </div>
    );
  }
}

export default Am4chartMap;