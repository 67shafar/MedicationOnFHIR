
    function getWeightObservationsQuery(patientId){
        const query = new URLSearchParams();
        query.set("patient", patientId);
        query.set("_count", 100);
        query.set("_sort", "date");
        query.set("code", [
            'http://loinc.org|29463-7'
        ].join(","));

        return query
    }

    function kgToPounds(measure){
        return measure * 2.20462;
    }

    // Drives grabbing and weight information, and applys it to the view
    function weightChart(client) {

        // Request the weight Observation data
        client.request("Observation?" + getWeightObservationsQuery(client.patient.id), {
            pageLimit: 0,
            flat: true
        }).then(function(ob) {
            const byCodes = client.byCodes(ob, 'code');
            const rawWeightData = byCodes('29463-7');

            // Build the weight data set
            let data = [], labels = [];
            for(let i = 0; i < rawWeightData.length; i++){
                const weight = rawWeightData[i];
                if(weight.effectiveDateTime > startDate.toISOString() && weight.effectiveDateTime <= endDate.toISOString()) {
                    labels.push(weight.effectiveDateTime.split("T")[0]);

                    let value = getQuantityValue(weight);
                    if (getQuantityUnit(weight).startsWith("kg")) {
                        data.push(kgToPounds(value));
                    } else {
                        data.push(value);
                    }
                }
            }

            // Technically incorrect... may show current weight for sparse past data...
            if(data.length === 0){
                const newestWeight = rawWeightData[rawWeightData.length-1]

                labels.push(startDate.toISOString().split("T")[0]);
                let value = getQuantityValue(newestWeight);
                if (getQuantityUnit(newestWeight).startsWith("kg")) {
                    data.push(kgToPounds(value));
                } else {
                    data.push(value);
                }
            }

            // Set the latest value as the most recent value
            labels.push(endDate.toISOString().split("T")[0]);
            data.push(data[data.length-1])

            // Set the first value the closet value in range
            labels.unshift(startDate.toISOString().split("T")[0]);
            data.unshift(data[0])

            new ApexCharts(document.querySelector("#spark1"), getBaseLineGraph(
                "sparkline1",
                "lbs",
                "Weight",
                '#00D8B6',
                data,
                labels,
                startDate,
                endDate
                )
            ).render();

        });

    }
