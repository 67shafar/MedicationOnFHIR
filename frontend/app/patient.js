(function() {

    // Drives grabbing and applying patient information to the view
    FHIR.oauth2.ready().then(function(client) {
        // get patient object and then display its demographics info in the banner
        client.request(`Patient/${client.patient.id}`).then(
            function (patient) {
                document.getElementById("welcome-bar").innerText = "Welcome, " + getPatientName(patient) + "!"
                console.log(patient);
            }
        );
    }).catch(console.error);
})();