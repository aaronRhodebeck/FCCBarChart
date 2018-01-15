let request = new XMLHttpRequest();
request.open(
  "GET",
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  true
);
request.send();
request.onload = function() {
  data = JSON.parse(request.responseText);
  buildChart(data);
};
