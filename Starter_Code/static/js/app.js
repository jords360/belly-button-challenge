// Define the URL of the dataset
const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use D3 to fetch the data
d3.json(url).then(function (data) {
  // The 'data' object containing the dataset
  console.log(data);

  // Select the dropdown element
  const dropdown = d3.select("#selDataset");

  // Populate the dropdown with test subject IDs
  data.names.forEach(function (name) {
    dropdown.append("option").text(name).property("value", name);
  });

  // Initialize the page with data for the first test subject
  const initialSubject = data.names[0];

  // Define the optionChanged function to handle dropdown changes
  function optionChanged(selectedSubject) {
    // Call the updateChartsAndInfo function with the selected subject
    updateChartsAndInfo(selectedSubject, data);
  }

  // Attach the optionChanged function to the dropdown's onchange event
  dropdown.on("change", function () {
    const selectedSubject = dropdown.property("value");
    optionChanged(selectedSubject);
  });

  // Inside the updateChartsAndInfo function
  function updateChartsAndInfo(selectedSubject, data) {
    // Find the data for the selected subject
    const subjectData = data.samples.find((sample) => sample.id === selectedSubject);

    // Select the top 10 OTUs based on sample_values
    const top10Values = subjectData.sample_values.slice(0, 10).reverse();
    const top10Labels = subjectData.otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
    const top10HoverText = subjectData.otu_labels.slice(0, 10).reverse();

    // Create the bar chart using Plotly and update it
    const trace = {
      x: top10Values,
      y: top10Labels,
      text: top10HoverText,
      type: "bar",
      orientation: "h",
    };

    const chartData = [trace];

    const layout = {
      title: `Top 10 OTUs for Test Subject ${selectedSubject}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" },
    };

    Plotly.newPlot("bar", chartData, layout);

    // Create the bubble chart using Plotly and update it
    const traceBubble = {
      x: subjectData.otu_ids,
      y: subjectData.sample_values,
      text: subjectData.otu_labels,
      mode: "markers",
      marker: {
        size: subjectData.sample_values,
        color: subjectData.otu_ids,
        colorscale: "Viridis",
        opacity: 0.7,
      },
    };

    const chartDataBubble = [traceBubble];

    const layoutBubble = {
      title: `Bubble Chart for Test Subject ${selectedSubject}`,
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" },
    };

    Plotly.newPlot("bubble", chartDataBubble, layoutBubble);

    // Update the sample metadata
    const metadataDiv = d3.select("#sample-metadata");
    const subjectMetadata = data.metadata.find((metadata) => metadata.id === parseInt(selectedSubject));

    // Clear the previous metadata
    metadataDiv.html("");

    // Populate the metadata div with demographic information
    Object.entries(subjectMetadata).forEach(([key, value]) => {
    metadataDiv.append("p").text(`${key}: ${value}`);
  });  
  }

  // Call the function with the initial subject
  updateChartsAndInfo(initialSubject, data);
});


