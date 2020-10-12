(function (){
    $("#survey-button").click(function(){

        const sleepAnswer = getRadioButtonAnswer("69732-6")

        FHIR.oauth2.ready().then(function(client) {
            // Create an observation object and push it to FHIR
            client.create(
                genSurveyObservationObj(
                    client.patient.id,
                    "69732-6",
                    "Trouble sleeping",
                    sleepAnswer
                )
            ).then(function (resp){
                alert( "Added your survey results to FHIR...\n" +
                    "Just need to display them against medication dates.\n" +
                    "See the response from FHIR\n\n" +
                    JSON.stringify(resp, null, 2)
                );
            });

        }).catch(console.error);
        return false;
    });
})()