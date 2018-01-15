function buildChart(data) {
  //#region Shared variables
  const height = 300;
  const width = 500;
  const paddingTop = 20;
  const paddingRight = 15;
  const paddingBottom = 40;
  const paddingLeft = 45;
  //#endregion Shared Variables

  //#region Create SVG Element
  const barChart = d3
    .select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("class", "chart");
  //#endregion

  //#region Create the scale for the data
  const parseDate = dateString => new Date(dateString);
  const minDate = parseDate(d3.min(data.data, d => d[0]));
  const maxDate = parseDate(d3.max(data.data, d => d[0]));

  const scaleX = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([paddingLeft, width - paddingRight]); //Extra padding for the scale to fit

  const minGDPValue = d3.min(data.data, d => d[1]);
  const maxGDPValue = d3.max(data.data, d => d[1]);

  const scaleY = d3
    .scaleLinear()
    .domain([minGDPValue * 0.85, maxGDPValue * 1.05])
    .range([height - paddingBottom, paddingTop]); //Reversed to start bars from the bottom
  //#endregion

  //#region Add axes to chart
  const xAxis = d3.axisBottom(scaleX);
  const yAxis = d3.axisLeft(scaleY);

  barChart
    .append("g")
    .attr("transform", `translate(0, ${height - paddingBottom})`)
    .attr("class", "axis")
    .call(xAxis);

  barChart
    .append("g")
    .attr("transform", `translate(${paddingLeft}, 0)`)
    .attr("class", "axis")
    .call(yAxis);

  // Add full length ticks
  const horizontalGrid = yAxis
    .tickSize(width - paddingLeft - paddingRight)
    .tickFormat("");
  barChart
    .append("g")
    .attr("class", "horizontal-guidelines")
    .attr("transform", `translate(${width - paddingRight}, 0)`)
    .call(horizontalGrid);
  //#endregion

  //#region Add labels to chart
  const leftLabel = barChart
    .append("text")
    .text("GDP in billions of USD")
    .attr("transform", "rotate(90 15 40)")
    .attr("class", "left-label");

  const dataReference = barChart
    .append("a")
    .attr("xlink:href", "http://www.bea.gov/national/pdf/nipaguid.pdf")
    .append("text")
    .text("Data provided by St. Louis Federal Reserve")
    .attr("transform", "translate(310, 289)")
    .attr("class", "data-reference");
  //#endregion

  //#region Add bars to chart
  const barWidth = (width - (paddingLeft + paddingRight)) / data.data.length;
  const barPadding = barWidth * 0.05;

  const bars = barChart
    .selectAll("rect")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", barWidth - barPadding)
    .attr("x", (d, i) => i * barWidth + paddingLeft + 1)
    .attr("height", d => scaleY(0) - scaleY(d[1]))
    .attr("y", d => scaleY(d[1]) - 2.7); // Off by 2.7, no idea why

  //#endregion

  //#region Add tooltip to bars
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");
  const tooltipGDP = tooltip.append("h3").attr("class", "tip-gdp");
  const tooltipDate = tooltip.append("p").attr("class", "tip-date");

  function prettyPrintDate(dateString) {
    const dateArray = dateString.split("-");
    let year = dateArray[0];
    let quarter = convertToQuarter(dateArray[1]);
    return `${quarter}, ${year}`;

    function convertToQuarter(month) {
      switch (month) {
        case "01":
          return "1st Quarter";
        case "04":
          return "2nd Quarter";
        case "07":
          return "3rd Quarter";
        case "10":
          return "4th Quarter";
        default:
          return month;
      }
    }
  }

  bars.on("mouseover", (d, i) => {
    tooltip.style("visibility", "visible").style("left", event.pageX - 40 + "px");
    tooltipDate.text(prettyPrintDate(d[0]));
    tooltipGDP.text("$" + d[1].toLocaleString() + " Billion");
  });

  bars.on("mousemove", d => {
    tooltip.style("top", event.pageY - 120 + "px");
  });

  bars.on("mouseout", d => {
    tooltip.style("visibility", "hidden");
  });
  //#endregion
}
