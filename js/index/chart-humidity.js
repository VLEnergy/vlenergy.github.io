const humidity="Relative Humidity";


d3.csv(csvFilePath).then(data=>{
    // Extract the column data
  const  humidity_data = data.map(d => parseFloat(d[humidity]));

  const timeConv = d3.timeParse('%Y-%m-%d %H:%M:%S');
 
  const time = data.map(d => timeConv(d[index]));
  console.log(time);


  // Create an array of objects with x and y values
  const chartData = humidity_data.map((d, i) => ({ x:timeConv(data[i].Time),y: d }));

  console.log(chartData);


  // Set up the chart dimensions
  const width = 600;
  const height = 300;
  const margin = { top: 20, right: 10, bottom: 30, left: 40 };

  // Create the SVG container
  const svg = d3.select('#chart-container-humidity')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create scales for x and y axes
  /*const xScale = d3.scaleLinear()
    .domain([0, chartData.length - 1])
    .range([margin.left, width - margin.right]);*/

   const xScale = d3.scaleTime()
    .domain(d3.extent(time)) // Set the domain of the x-axis to the range of dates
    .range([margin.left, width - margin.right]); 

  

  const yScale = d3.scaleLinear()
    .domain([d3.min(chartData, d => d.y), d3.max(chartData, d => d.y)])
    .range([height - margin.bottom, margin.top]);


  var meanValue = d3.mean(humidity_data);
  var minValue = d3.min(humidity_data);
  var maxValue = d3.max(humidity_data);

  var btn = d3.select("#btn-humidity");
  var mean_card=d3.select("#mean")
  var min_card=d3.select("#min")
  var max_card=d3.select("#max")
  btn.on('click',function(){
    //var newElement = textContainer.append('p');
    //newElement.text('Mean Value: '+meanValue+'  Minimum Value: '+minValue+' Maximum Value: '+maxValue);
    max_card.text(maxValue.toFixed(2));
    min_card.text(minValue.toFixed(2));
    mean_card.text(meanValue.toFixed(2));



  })



  // Create the line generator
  const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  // Append the line to the SVG
  svg.append('path')
    .datum(chartData)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line);



    const xAxis = d3.axisBottom(xScale)
                    .ticks(10);

    // Append x-axis to the SVG
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', margin.bottom )
        .attr('fill','black')
        .attr('text-anchor', 'middle')
        .text('time');

    

    const yAxis = d3.axisLeft(yScale);

    // Append y-axis to the SVG
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis)
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', -margin.left)
        .attr('y', margin.top - 10)
        .attr('fill','black')
        .attr('text-anchor', 'start')
        .text("Measurement");


    // Create y-axis gridlines    
    const gridGroup = svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${margin.left}, 0)`)
    .attr("opacity",0.2);

  // Adjust the length of gridlines
  gridGroup.call(yAxis
    .tickSize(-width) 
    .tickFormat("")
    
  );

// Add the cursor dot
const cursor = svg.append("circle")
.attr("class", "cursor")
.attr("r", 2) // Adjust the radius as needed
.attr("fill", "red")
.style("pointer-events", "none"); // Make the cursor not capture events

// Add event listener to update cursor position and display coordinates
svg.on("mousemove", updateCursor);

function updateCursor(event) {
const [xValue, yValue] = d3.pointer(event);

// Find the nearest data point on the line
const bisectDate = d3.bisector(d => d.x).left;
const nearestIndex = bisectDate(chartData, xScale.invert(xValue));

const nearestData = chartData[nearestIndex];

cursor.attr("cx", xValue).attr("cy", yValue);

// Update coordinates display with data
d3.select("#coordinates6").text(`Date and Time: ${nearestData.x.toLocaleDateString()} ${nearestData.x.toLocaleTimeString()} |\n Humidity: ${nearestData.y.toFixed(2)}`);
}
    
    
    

}).catch(error => {
  console.error('Error:', error);


});