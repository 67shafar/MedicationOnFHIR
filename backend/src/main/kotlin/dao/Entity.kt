package dao

data class Question(
    val display: String,
    val loinc: String,
    val answers: ArrayList<Answer>? = null
)

data class Answer(
    val answer_id: Int,
    val display_order: Int,
    val display: String,
    val loinc: String,
    val quality: String,
    val question: Question? = null
)

data class PatientQuestion(
    val patient_id: String,
    val loinc: String,
    val question: Question? = null
)

data class PatientAnswer(
    val patient_id: String,
    val loinc: String,
    val answer_id: Int,
    val answer_date: String,
    val question: Question? = null,
    val answer: Answer? = null
)