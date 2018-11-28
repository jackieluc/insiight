import 'normalize.css/normalize.css';
import '../../styles/results.scss';


$('document').ready(() => {
    
    $('h1').text('Results');
});

var ctx = document.getElementById('q1_Chart').getContext('2d');

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ["Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5"],
        datasets: [{
            data: [7, 10, 5, 12, 20],
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
            borderWidth: 1
        }]
    },

    // Configuration options go here
    options: {
    }
});

var ctx = document.getElementById('q2_Chart').getContext('2d');

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [5, 10, 5, 2, 20],
            backgroundColor: [
                'rgba(255, 130, 132, 0.2)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderColor: [
                'rgba(255,130,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },

    // Configuration options go here
    options: {
    }
});

var ctx = document.getElementById('q3_Chart').getContext('2d');

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },

    // Configuration options go here
    options: {
    }
});

var ctx = document.getElementById('q4_Chart').getContext('2d');

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },

    // Configuration options go here
    options: {
    }
});
/*
var ctx2 = document.getElementById('q2_Chart').getContext('2d');
var myPieChart = new Chart(ctx2,{
    type: 'pie',
    data: {
        
        datasets: [{
            labels: [
                "Red",
                'Yellow',
                'Blue'
                ],
            data: [10, 20, 30]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    
    
});
*/