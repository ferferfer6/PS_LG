/**

 *Crea un grafico cartesiano

 * @method createLinealChart

 * @param abscissa Array que contiene los valores del eje de abcisas

 * @param seriesInput Array que contiene un  los datos de que se quieren representar

 */
function createLinealChart(abscissa, seriesInput) {
    $('#lineChart').highcharts({
        title: {
            text: 'Line chart',
            x: -20 //center
        },
        subtitle: {
            text: 'Fuente de datos: http://s3.amazonaws.com/logtrust-static/test/test/',
            x: -20
        },
        xAxis: {
            categories:abscissa
        },
        yAxis: {
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: seriesInput
    });
}

/**

 *Crea un grafico de tipo tarta

 * @method createPieChart

 * @param dataInput Array que contiene un  los datos de que se quieren representar

 */
function createPieChart(dataInput) {
    $('#pieChart').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Pie chart'
        },
        subtitle: {
            text: 'Fuente de datos: http://s3.amazonaws.com/logtrust-static/test/test/',
            x: -20
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: dataInput
        }]
    });
};