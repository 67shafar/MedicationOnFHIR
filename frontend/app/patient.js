(function() {

    // Drives grabbing and applying patient information to the view
    FHIR.oauth2.ready().then(function(client) {

        if(client.getUserType() === 'Patient') {
            // get patient object and then display its demographics info in the banner
            client.request(`Patient/${client.patient.id}`).then(
                function (patient) {
                    document.getElementById("welcome-bar").innerText = "Welcome, " + getPatientName(patient) + "!"
                    console.log(patient);
                }
            );
        } else {
            client.user.read().then(function(data){
                // get practitioner name, using patient function.
                client.request(`Patient/${client.patient.id}`).then(
                    function (patient) {
                        document.getElementById("welcome-bar").innerHTML = "Practitioner: " + getPatientName(data) + "<br />Patient: " + getPatientName(patient)
                    }
                );
            })
        }
    }).catch(console.error);
})();