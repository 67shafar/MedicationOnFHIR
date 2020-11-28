
    function getMedicationsQuery(patientId){
        const query = new URLSearchParams();
        query.set("patient", patientId);
        query.set("_count", 100);
        query.set("_sort", "date");

        return query
    }

    // Drives grabbing and weight information, and applys it to the view
    function medicationView(client) {

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
                    name: med.medicationCodeableConcept.text,
                    data: [{
                    x: med.medicationCodeableConcept.text,
                    y: [
                        new Date(startMed).getTime(),
                        new Date(stopMed).getTime()
                    ],
                    fillColor: [
                        "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
                        "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
                        "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
                    ][data.length]
                }]})

            });

            new ApexCharts(document.querySelector("#timeline1"),
                getTimelineBase(
                    "Medication History",
                    data,
                    startDate,
                    endDate)
            ).render();

        });

    }