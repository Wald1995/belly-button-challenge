// The url with data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Display the default plots
function init() {
    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        let names = data.names;

        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        let name = names[0];
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

// Make the demographics panel
function demo(selectedValue) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        let metadata = data.metadata;
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        let obj = filteredData[0];
        d3.select("#sample-metadata").html("");
        let entries = Object.entries(obj);
        
        entries.forEach(([key, value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        console.log(entries);
    });
}

// Make the bar chart
function bar(selectedValue) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        let samples = data.samples;
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        let obj = filteredData[0];

        let trace = [{
            x: obj.sample_values.slice(0, 10).reverse(),
            y: obj.otu_ids.slice(0, 10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            marker: { color: "color" },
            orientation: "h"
        }];

        Plotly.newPlot("bar", trace);
    });
}

// Make the bubble chart
function bubble(selectedValue) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        let obj = filteredData[0];

        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Earth"
            }
        }];

        let layout = {
            xaxis: { title: "OTU ID" }
        };

        Plotly.newPlot("bubble", trace, layout);
    });
}

// Make the gauge chart
function gauge(selectedValue) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        let obj = filteredData[0];

        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 20 } },
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: { range: [null, 10] },
                bar: { color: "blue", colorscale: "pastel" },
                steps: [
                    { range: [0, 1], color: "rgb(253,237,236)" },
                    { range: [1, 2], color: "rgb(250,219,216)" },
                    { range: [2, 3], color: "rgb(245,183,177)" },
                    { range: [3, 4], color: "rgb(241,148,138)" },
                    { range: [4, 5], color: "rgb(236,112,99)" },
                    { range: [5, 6], color: "rgb(231,76,60)" },
                    { range: [6, 7], color: "rgb(203,67,53)" },
                    { range: [7, 8], color: "rgb(176,58,46)" },
                    { range: [8, 9], color: "rgb(148,49,38)" },
                    { range: [9, 10], color: "rgb(120,40,31)" }
                ]
            }
        }];

        Plotly.newPlot("gauge", trace);
    });
}

// Toggle to new plots when option changed
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue);
}

init();
