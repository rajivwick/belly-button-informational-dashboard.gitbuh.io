// API url containing data 
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function init() {
  // Grab a reference to the dropdown select element
  var selectDropDown = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(url).then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selectDropDown
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildmetadata(firstSample);
  });
}


// Initialize the dashboard
init();


// this allows us to change the data by optionsChange on the onchange in html, line 25
function optionChanged(newSubjectID) {
  buildmetadata(newsubjectID);
  buildCharts(newSubjectID);

}

function buildmetadata(subjectID) {

  d3.json(url).then(function (data) {
      var metadatadiv = d3.select('#sample-metadata')
      var metadata = data.metadata
      //filtering through data to make subjectID be the dropdown id
      var resultArray = metadata.filter(sampleObj => sampleObj.id == subjectID);
      // console.log(resultArray)
      var result = resultArray[0]
      console.log(result)
      //clearing the html from the page
      metadatadiv.html("")
      //setting the key value pairs from result variable
      Object.entries(result).map(([key, value]) => {
          metadatadiv.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });

  });
}

function buildCharts(subjectID) {
  d3.json(url).then(function (data) {

    var datasamples = data.samples;

    var resultArray = datasamples.filter(sampleObj => sampleObj.id == subjectID);
    
    var metadataArray = data.metadata;
    var resultMetadata = metadataArray.filter(sampleObj => sampleObj.id == subjectID);

    var result = resultArray[0];
    var metadata = resultMetadata[0];


    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    var wFreq = parseFloat(metadata.wfreq)

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    
    
    
    var barData = [
        {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }
    ];

    var barLayout = {
            
            margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

      // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        type: "scatter",
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Viridis"
        }
      }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      margins: {
        l: 0,
        r: 0,
        b: 0,
        t: 0     
      },
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wFreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [0, 10], 
          tickwidth: 1, 
          tickcolor: "black"},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"},
        ]}
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 400,
      margin: {t: 0, r: 0, l: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


  });
}

