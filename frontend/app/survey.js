(function (){

    FHIR.oauth2.ready().then(function(client) {
        if(client.getUserType() === 'Patient' && sessionStorage.getItem("taken-survey") === null) {
            $.ajax({
                url: '/patient/survey?patientId=' + client.patient.id,
            }).done(function (data) {
                let survey = $('#survey')
                data.forEach(function (patientQuestion) {
                    survey.append('<label class="form-label">' + patientQuestion.question.display + '</label>')
                    patientQuestion.question.answers.forEach(function (answer) {
                        survey.append('<label class="form-radio answer-id-' + answer.answer_id + '">')

                        let radio = $('.answer-id-' + answer.answer_id)
                        radio.append('   <input class="radio-answer-id-' + answer.answer_id + '" type="radio" name="' + patientQuestion.loinc + '" value="' + answer.display + '">')
                        radio.append('   <i class="form-icon"></i> ' + answer.display)
                    })
                    survey.append('<br /><br />')
                })

                survey.append('<button id="survey-button" class="btn btn-primary" style="float: right; margin-right: 25px;">Submit</button>')
                $("#survey-button").click(function (event) {
                    event.preventDefault();
                    data.forEach(function (patientQuestion) {
                        answer = getRadioButtonAnswer(patientQuestion.loinc)
                        answerId = getRadioButtonAnswerId(patientQuestion.loinc)
                        FHIR.oauth2.ready().then(function (client) {
                            // Create an observation object and push it to FHIR
                            client.create(
                                genSurveyObservationObj(
                                    client.patient.id,
                                    patientQuestion.loinc,
                                    patientQuestion.question.display,
                                    answer
                                )
                            ).then(function (resp) {
                                console.log("sending survey observation to fhir api...")
                            });

                            $.ajax({
                                url: '/patient/survey/answer?patientId=' + client.patient.id,
                                method: 'POST',
                                data: JSON.stringify([{ answer_id:  answerId, loinc: patientQuestion.loinc }]),
                                contentType: "application/json",
                                xhrFields: {
                                    withCredentials: true
                                }
                            }).done(function (data) {
                                console.log("survey answers response:\n" + data)
                            });

                        }).catch(console.error);

                    })
                    sessionStorage.setItem("taken-survey", "true")
                    $("#survey").html('<h5>Thank you for taking your survey this session!</h5>')
                    window.location.reload()
                })
            });
        } else {
            if(client.getUserType() === 'Patient') {
                $("#survey").append('<h5>Thank you for taking your survey this session!</h5>')
            } else {
                $("#survey").append('<h5>Hi Practitioner!</h5>')
                client.user.read().then(function(data) {
                    console.log(data)
                })
            }
        }
    }).catch(console.error)

    // $("#survey-button").click(function(){
    //
    //     const sleepAnswer = getRadioButtonAnswer("69732-6")
    //
    //     FHIR.oauth2.ready().then(function(client) {
    //         // Create an observation object and push it to FHIR
    //
    //         client.create(
    //             genSurveyObservationObj(
    //                 client.patient.id,
    //                 "69732-6",
    //                 "Trouble sleeping",
    //                 sleepAnswer
    //             )
    //         ).then(function (resp){
    //             console.log("sending survey observation to fhir api...")
    //         });
    //
    //     }).catch(console.error);
    //     return false;
    // });
})()