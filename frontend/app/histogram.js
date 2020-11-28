(function() {

    FHIR.oauth2.ready().then(function(client) {
        $.ajax({
            url: "/patient/survey/history?patientId=" + client.patient.id,
        }).done(function(data){
            let options = {
                series: data.series,
                chart: {
                    type: 'bar',
                    height: 200,
                    stacked: true,
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                    },
                },
                stroke: {
                    width: 1,
                    colors: ['fff']
                },
                title: {
                    text: 'Survey Metrics'
                },
                xaxis: {
                    categories: data.categories,
                    labels: {
                        formatter: function (val) {
                            return "Week " + val
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: undefined
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val
                        }
                    }
                },
                fill: {
                    opacity: 1,
                    colors: ['#50c850', '#c85050', '#ffff50']
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40,
                },
                colors: ['#50c850', '#c85050', '#ffff50']
            };

            new ApexCharts(document.querySelector("#spark0"), options).render();
        })
    }).catch(console.error);


})();