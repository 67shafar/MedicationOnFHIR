/**
 * helper function to get quanity from an observation resoruce.
 * @param ob
 * @returns {Number|undefined}
 */
function getQuantityValue(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
        return Number(parseFloat((ob.valueQuantity.value)).toFixed(2));
    } else {
        return undefined;
    }
}

/**
 * helper function to get unit from an observation resoruce.
 * @param ob
 * @returns {String|undefined}
 */
function getQuantityUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
        return ob.valueQuantity.unit;
    } else {
        return undefined;
    }
}

/**
 * helper function to get quanity and unit from an observation resoruce.
 * @param ob
 * @returns {string|undefined}
 */
function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
        return Number(parseFloat((ob.valueQuantity.value)).toFixed(2)) + ' ' + ob.valueQuantity.unit;
    } else {
        return undefined;
    }
}

/**
 * helper function to process fhir resource to get the patient name.
 * @param pt
 * @returns {string}
 */
function getPatientName(pt) {
    if (pt.name) {
        var names = pt.name.map(function(name) {
            return name.given.join(" ") + " " + name.family;
        });
        return names.join(" / ")
    } else {
        return "anonymous";
    }
}

/**
 * helper function to get both systolic and diastolic bp
 * @param BPObservations
 * @param typeOfPressure
 * @returns {string}
 */
function getBloodPressureValue(BPObservations, typeOfPressure) {
    var formattedBPObservations = [];
    BPObservations.forEach(function(observation) {
        var BP = observation.component.find(function(component) {
            return component.code.coding.find(function(coding) {
                return coding.code == typeOfPressure;
            });
        });
        if (BP) {
            observation.valueQuantity = BP.valueQuantity;
            formattedBPObservations.push(observation);
        }
    });

    return formattedBPObservations;
}

/**
 * DeepCopy function
 * @param input
 * @returns {*[]|*}
 */
function deepCopy(input) {
    let output, value, key

    if (typeof input !== "object" || input === null) {
        return input
    } else {
        output = Array.isArray(input) ? [] : {}
        // noinspection JSUnfilteredForInLoop
        for (key in input) {
            // noinspection JSUnfilteredForInLoop
            value = input[key]
            // noinspection JSUnfilteredForInLoop
            output[key] = deepCopy(value)
        }
    }

    return output
}

/**
 * Generate a list of dates that can be used as labels
 * @param start
 * @param end
 * @returns {any[]}
 */
function genDateLabels(start, end) {
    const arr = []
    const dt = new Date(start);

    while (dt <= end) {
        let temp = new Date(dt)
        arr.push(temp.getFullYear() + "-" + (temp.getMonth()+1) + "-0" + temp.getDate());
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}

/**
 * Generate a object that describes an apex chart
 * @param id
 * @param measureTitle
 * @param chartTitle
 * @param color
 * @param data
 * @param labels
 * @param startDate
 * @param endDate
 * @returns {*[]|*}
 */
function getBaseLineGraph(id, measureTitle, chartTitle, color, data, labels, startDate, endDate) {
    const baseLineGraph = {
        chart: {
            id: id,
            type: 'line',
            group: 'vitals',
            height: 200,
            sparkline: {
                enabled: true
            },
        },
        stroke: {
            curve: 'straight'
        },
        fill: {
            opacity: 1,
        },
        series: [{
            name: measureTitle,
            data: data
        }],
        labels: labels,
        yaxis: {
            min: 0
        },
        xaxis: {
            type: 'datetime',
            min: startDate.getTime(),
            max: endDate.getTime()
        },
        colors: [color],
        title: {
            text: chartTitle,
            offsetX: 30,
            style: {
                fontSize: '24px',
                cssClass: 'apexcharts-yaxis-title'
            }
        },
        subtitle: {
            text: measureTitle,
            offsetX: 30,
            style: {
                fontSize: '14px',
                cssClass: 'apexcharts-yaxis-title'
            }
        }
    }
    return deepCopy(baseLineGraph)
}

/**
 * Get the baseline object for medications
 * @param chartTitle
 * @param data
 * @param startDate
 * @param endDate
 * @returns {*[]|*}
 */
function getTimelineBase(chartTitle, data, startDate, endDate) {
    var options = {
        series: [
            {
                data: data
            }
        ],
        chart: {
            height: 200,
            type: 'rangeBar'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
                dataLabels: {
                    hideOverflowingLabels: false
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                var label = opts.w.globals.labels[opts.dataPointIndex]
                var a = moment(val[0])
                var b = moment(val[1])
                var diff = b.diff(a, 'days')
                return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
            },
            style: {
                colors: ['#000000', '#000']
            }
        },
        xaxis: {
            show: false,
            type: 'datetime'
        },
        yaxis: {
            show: false,
            min: startDate.getTime(),
            max: endDate.getTime()
        },
        // title: {
        //     text: chartTitle,
        //     offsetX: 0,
        //     offsetY: 0,
        //     style: {
        //         fontSize: '24px',
        //         cssClass: 'apexcharts-yaxis-title'
        //     }
        // },
        grid: {
            row: {
                colors: ['#f3f4f5', '#fff'],
                opacity: 1
            }
        }
    }

    return deepCopy(options)
}

/**
 * Generate an survey observation
 */
function genSurveyObservationObj(patientId, loincCode, display, value){
    const observation = {
        "resourceType":"Observation",
        "status":"final",
        "category":[
            {
                "coding":[
                    {
                        "system":"http://terminology.hl7.org/CodeSystem/observation-category",
                        "code":"survey",
                        "display":"Survey"
                    }
                ]
            }
        ],
        "code":{
            "coding":[
                {
                    "system":"http://loinc.org",
                    "code":loincCode,
                    "display": display
                }
            ],
            "text":display
        },
        "subject":{
            "reference":"Patient/" + patientId
        },
        "valueString": value
    }
    return observation
}

/**
 * Get the answer to a radio button question.
 * @param question
 * @returns {undefined}
 */
function getRadioButtonAnswer(question){
    let value = undefined
    document.getElementsByName(question).forEach(function(elem){
        if(elem.checked) {
            value = elem.value
        }
    });
    return value;
}