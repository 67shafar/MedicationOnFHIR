
    function getSystolicObservationsQuery(patientId){
        const query = new URLSearchParams();
        query.set("patient", patientId);
        query.set("_count", 100);
        query.set("_sort", "date");
        query.set("code", [
            'http://loinc.org|55284-4',
            'http://loinc.org|8462-4',
        ].join(","));

        return query
    }

    // Drives grabbing and weight information, and applys it to the view
    function diastolicView(client) {

        // Request the weight Observation data
        client.request("Observation?" + getSystolicObservationsQuery(client.patient.id), {
            pageLimit: 0,
            flat: true
        }).then(function(ob) {
            const byCodes = client.byCodes(ob, 'code');
            const rawBloodPressureData = getBloodPressureValue(byCodes('55284-4'), '8462-4');

            // Build the systolic blood pressure data set
            let data = [], labels = [];
            for(let i = 0; i < rawBloodPressureData.length; i++){
                const bp = rawBloodPressureData[i];
                if(bp.effectiveDateTime > startDate.toISOString() && bp.effectiveDateTime <= endDate.toISOString()) {
                    labels.push(bp.effectiveDateTime.split("T")[0]);
                    data.push(getQuantityValue(bp))
                }
            }

            // Technically incorrect... may show current bp for sparse past data...
            if(data.length === 0){
                const bp = rawBloodPressureData[rawBloodPressureData.length-1]
                labels.push(startDate.toISOString().split("T")[0]);
                data.push(getQuantityValue(bp))
            }

            // Set the latest value as the most recent value
            labels.push(endDate.toISOString().split("T")[0]);
            data.push(data[data.length-1])

            // Set the first value the closet value in range
            labels.unshift(startDate.toISOString().split("T")[0]);
            data.unshift(data[0])

            new ApexCharts(document.querySelector("#spark3"), getBaseLineGraph(
                "sparkline3",
                getQuantityUnit(rawBloodPressureData[0]),
                "Diastolic BP",
                '#FEB019',
                data,
                labels,
                startDate,
                endDate
                )
            ).render();

        });

    }