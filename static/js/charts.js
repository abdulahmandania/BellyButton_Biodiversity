function init() {
  // init = the function name
  var selector = d3.select("#selDataset");
  // selector = the drop down menu
  //d3.select() method = select the dropdown menu, id: selDataset

  d3.json("samples.json").then((data) => {
    // d3.json() = read the data from samples.json

    var sampleNames = data.names;
    // sampleNames = variable given to the participant ID numbers
    sampleNames.forEach((sample) => {
      // The forEach() method is called on the sampleNames array
      //For each element in the array...
      selector
        .append("option")
        //... a dropdown menu option is appended
        .text(sample)
        //The text of each dropdown menu option is the ID
        .property("value", sample);
        // Its value property is also assigned the ID.
      });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// All the code is enclosed inside the init() function is called
init();


function optionChanged(newSample) {
  //newSample = this.value (from the html)
  
  //replace: console.log(newSample); with:
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  //when a dropdown menu option is selected, the ID# is passed in as sample
  d3.json("samples.json").then((data) => {
    //pulls in entire samples.json dataset and calls it "data"
    var metadata = data.metadata;
    //metadata = metadata array in samples.json
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    //filter metadata -> find matching id passed in by "sample"
    var result = resultArray[0];
    //results = the 1st item [0] where the id is located
    
    var PANEL = d3.select("#sample-metadata");
    //panel = (d3.select the <div>) with id sample-metadata 
    //        (ie. the Demographic Info panel)

    PANEL.html("");
    //Clear contents of the panel when another ID number is chosen 
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}


// D1----------------BAR CHART-----------------------

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
  // 3. Create a variable that holds the samples array. 
  var samplesArray = data.samples;

  // 4. Create a variable that filters the samples array for the object with the desired sample number.
  var filteredSamples = samplesArray.filter(i => i.id == sample);
  //  5. Create a variable that holds the first sample in the array.
  var firstFilteredSample = filteredSamples[0];


  // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
  var bar_otu_ids = firstFilteredSample.otu_ids.slice(0, 10).reverse();
  var bar_otu_labels = firstFilteredSample.otu_labels.slice(0, 10).reverse();
  var bar_sample_values = firstFilteredSample.sample_values.slice(0, 10).reverse();

  var yticks = bar_otu_ids.map(i => "OTU " + i);

  
  // 8. Create the trace for the bar chart. 
  var barData = [{
    x: bar_sample_values,
    y: yticks,
    type: "bar",
    orientation: "h",
    text: bar_otu_labels
  }];

  // 9. Create the layout for the bar chart. 
  var barLayout = {
    title:{
      text: 'Top 10 Bacteria Cultures Found',
      font: {
        size: 22,
        color: "black"}},
  };

  // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", barData, barLayout)



  // D2--------------BUBBLE CHART-----------------------
  
  var bubble_otu_ids = firstFilteredSample.otu_ids;
  var bubble_otu_labels = firstFilteredSample.otu_labels;
  var bubble_sample_values = firstFilteredSample.sample_values;

  // 1. Create the trace for the bubble chart.
  var bubbleData = [{
    x: bubble_otu_ids,
    y: bubble_sample_values,
    text: bubble_otu_labels ,
    mode: 'markers',
    marker: {
      color: bubble_otu_ids,
      size: bubble_sample_values, 
      colorscale: 'Earth' 
    }
  }];

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: {
      text: 'Bacteria Cultures Per Sample',
      font: {
        size: 24,
        color: "black"}},
    xaxis: {title: "OTU ID"},
    autoexpand: 'true'
  }

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
 


    // D3--------------GUAGE CHART-----------------------

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetaArray = data.metadata.filter(i => i.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstFilteredMeta = filteredMetaArray[0];

    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(firstFilteredMeta.wfreq);

    // 4. Create the trace for the gauge chart.
    var guageData = [{
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {
        text: "Belly Button Washing Frequency<br><sup>Scrubs per week</sup>", 
        font: {
          size: 24,
          color: "black"}},
      gauge: {
        axis: {range: [0, 10]},
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red" }, 
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" }
        ]}
      }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
       width: 500, 
       height: 300, 
       margin: { t: 0, b: 0 }
    };


    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', guageData, gaugeLayout);

  });
}