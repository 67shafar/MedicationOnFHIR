(function () {
    function getMedicationsQuery(patientId){
        const query = new URLSearchParams();
        query.set("patient", patientId);
        query.set("_count", 100);
        query.set("_sort", "date");

        return query
    }

    // Drives grabbing and weight information, and applys it to the view
    FHIR.oauth2.ready().then(function(client) {

        // Request the weight Observation data
        client.request("MedicationRequest?" + getMedicationsQuery(client.patient.id), {
            pageLimit: 0,
            flat: true
        }).then(function(medResults){
            let data = []
            medResults.forEach(function(med) {
                const startMed = med.authoredOn.split("T")[0]
                const lastUpdated = med.meta.lastUpdated.split("T")[0];
                const status = med.status;

                let stopMed = today.toISOString().split("T")[0];
                if(status === 'stopped'){
                    stopMed = lastUpdated;
                }

                data.push({
                    x: med.medicationCodeableConcept.text,
                    y: [
                        new Date(startMed).getTime(),
                        new Date(stopMed).getTime()
                    ],
                    fillColor: '#775DD0'
                })

            });

            new ApexCharts(document.querySelector("#timeline1"),
                getTimelineBase(
                    "Medication History",
                    data,
                    startDate,
                    endDate)
            ).render();

            new ApexCharts(document.querySelector("#timeline2"),
                getTimelineBase(
                    "Medication History",
                    data,
                    startDate,
                    endDate)
            ).render();

            new ApexCharts(document.querySelector("#timeline3"),
                getTimelineBase(
                    "Medication History",
                    data,
                    startDate,
                    endDate)
            ).render();

        });

    }).catch(console.error);
})();