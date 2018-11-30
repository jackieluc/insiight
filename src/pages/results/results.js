import 'normalize.css/normalize.css';
import '../../styles/results.scss';


$('document').ready(() => {
    
    $('h1').text('Results');
});

var colors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)'
];

var gdata = [7, 10, 5, 12, 20];

var glabels = ["Very Good", "Good", "Netural", "Bad", "Very Bad"];



var ctx = document.getElementById('q1_Chart').getContext('2d');

Chart.defaults.global.defaultFontFamily = 'Roboto';
 
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: glabels ,
        datasets: [{
            data: gdata,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
        }]
    },

    // Configuration options go here
    options: {
        title: {
            display: true,
            text: 'Question 1'
        }
    }
});

var ctx = document.getElementById('q2_Chart').getContext('2d');

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: glabels,
        datasets: [{
            data: [5, 10, 5, 2, 20],
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
        }]
    },

    // Configuration options go here
    options: {
        title: {
            display: true,
            text: 'Question 2'
        }
    }
});

var ctx = document.getElementById('q3_Chart').getContext('2d');

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(100, 102, 255, 1)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            data: [30, 10, 15, 25, 20],
        }]
    },

    // Configuration options go here
    options: {
        title: {
            display: true,
            text: 'Question 3'
        }
    }
});

var ctx = document.getElementById('q4_Chart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            data: [10, 10, 5, 25, 20],
        }]
    },

    // Configuration options go here
    options: {
        title: {
            display: true,
            text: 'Question 4'
        }
    }
});

var ctx = document.getElementById('q5_Chart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            data: [10, 10, 5, 25, 20],
        }]
    },

    // Configuration options go here
    options: {
        title: {
            display: true,
            text: 'Question 5'
        }
    }
});
