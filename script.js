//#region Setup variables
const svgConfig = {
  chartHeight: 300,
  chartWidth: 400,
  paddingTop: 30,
  paddingLeft: 50,
  paddingBottom: 30,
  paddingRight: 15,
  marginFactor: 0.15
};
const historicalGDPSourceUrl =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
//#endregion

//#region Run script
makeGDPChart(historicalGDPSourceUrl, svgConfig);
//#endregion Run Script

//#region Methods
async function makeGDPChart(dataUrl, svgConfig) {
  d3.json(dataUrl, (err, data) => {
    const gdpData = parseGDP(data);
    makeChart(gdpData, svgConfig);
  });
}

function parseGDP(data) {
  let parsedGDP = {
    description: data.description,
    startDate: data.from_date,
    endDate: data.to_date,
    frequency: data.frequency,
    infoSourceURL: data.display_url,
    xAxisTitle: "Date",
    yAxisTitle: "Total $ in Billions"
  };
  parsedGDP.gdpArray = data.data.map(arr => ({ date: arr[0], value: arr[1] }));
  return parsedGDP;
}

function makeChart(historicalGDP, svgConfig) {
  let chartSVG = createSVGElement(svgConfig, "second-chart", "second-BarChart", [
    "barChart"
  ]);
  addBarsToGraph(chartSVG, svgConfig, historicalGDP.gdpArray);
  // console.log(historicalGDP.gdpArray);
}

function createSVGElement(svgSizeAndPadding, appendToId, name, classes = []) {
  const totalHeight =
    svgSizeAndPadding.chartHeight +
    svgSizeAndPadding.paddingBottom +
    svgSizeAndPadding.paddingTop;
  const totalWidth =
    svgSizeAndPadding.chartWidth +
    svgSizeAndPadding.paddingLeft +
    svgSizeAndPadding.paddingRight;

  return d3
    .select(`#${appendToId}`)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("viewbox", `0 0 ${totalWidth} ${totalHeight}`)
    .attr("id", `${name}-barchart`)
    .attr("class", classes.join(" "));
}

function addBarsToGraph(chart, svgConfig, data, heightScale) {
  const { barWidth, margin } = getBarWidth(svgConfig, data.length);
  console.log(barWidth, margin);

  function getBarWidth(svgConfig, totalBars) {
    const {
      chartWidth,
      chartHeight,
      paddingTop,
      paddingLeft,
      paddingRight,
      marginFactor
    } = svgConfig;

    const barWidthWithMargin = chartWidth / totalBars;
    const margin = barWidthWithMargin * marginFactor;
    const barWidth = barWidthWithMargin - margin;

    return { barWidth, margin };
  }
}
