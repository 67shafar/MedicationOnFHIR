package dao

import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import java.sql.Connection
import java.sql.ResultSet
import java.util.*


object DataUtils {

//    fun asList(rs: ResultSet): List<HashMap<String, Any>> {
//        val resultSetMetaData = rs.metaData
//        val resultSetColumnCount = resultSetMetaData.columnCount
//        val list: MutableList<HashMap<String, Any>> = ArrayList()
//
//        while (rs.next()) {
//            val row = HashMap<String, Any>(resultSetColumnCount)
//            for (i in 1..resultSetColumnCount) {
//                row[resultSetMetaData.getColumnName(i)] = rs.getObject(i)
//            }
//            list.add(row)
//        }
//
//        return list
//    }

    /**
     * Get survey data for the patient
     */
    fun getPatientSurvey(conn: Connection, patientId: String): ArrayList<PatientQuestion> {
        val statement = conn.prepareStatement("""
            SELECT * FROM patient_question pq 
                JOIN question q ON pq.loinc=q.loinc 
                JOIN answer a ON q.loinc=a.loinc 
            WHERE patient_id=?
            ORDER BY q.loinc, display_order ASC;
        """.trimIndent())

        statement.setString(1, patientId);

        val result = statement.executeQuery()

        return buildPatientQuestionListFromResultSet(result, patientId)
    }

    private fun buildPatientQuestionListFromResultSet(result: ResultSet, patientId: String): ArrayList<PatientQuestion> {
        val list = ArrayList<PatientQuestion>()
        var currentPatientQuestion: PatientQuestion? = null
        while (result.next()) {
            if (currentPatientQuestion?.loinc == result.getString("q.loinc")) {
                currentPatientQuestion?.question?.answers?.add(
                        Answer(
                                answer_id = result.getInt("answer_id"),
                                loinc = result.getString("a.loinc"),
                                display = result.getString("a.display"),
                                display_order = result.getInt("display_order"),
                                quality = result.getString("quality")
                        )
                )
            } else {
                if (currentPatientQuestion?.question != null) {
                    list.add(
                            PatientQuestion(
                                    patient_id = patientId,
                                    loinc = currentPatientQuestion.loinc,
                                    question = Question(
                                            display = currentPatientQuestion.question!!.display,
                                            loinc = currentPatientQuestion.loinc,
                                            answers = currentPatientQuestion.question!!.answers
                                    )
                            )
                    )
                    currentPatientQuestion = null
                }
                if(currentPatientQuestion == null) {
                    currentPatientQuestion = PatientQuestion(
                            patient_id = patientId,
                            loinc = result.getString("q.loinc"),
                            question = Question(
                                    display = result.getString("q.display"),
                                    loinc = result.getString("q.loinc"),
                                    answers = arrayListOf(
                                            Answer(
                                                    answer_id = result.getInt("answer_id"),
                                                    loinc = result.getString("a.loinc"),
                                                    display = result.getString("a.display"),
                                                    display_order = result.getInt("display_order"),
                                                    quality = result.getString("quality")
                                            )
                                    )
                            )
                    )
                }
            }
        }

        if (currentPatientQuestion?.question != null) {
            list.add(
                    PatientQuestion(
                            patient_id = patientId,
                            loinc = currentPatientQuestion.loinc,
                            question = Question(
                                    display = currentPatientQuestion.question!!.display,
                                    loinc = currentPatientQuestion.loinc,
                                    answers = currentPatientQuestion.question!!.answers
                            )
                    )
            )
            currentPatientQuestion = null
        }

        return list
    }

    /**
     * Get a data object that can be used in a apex chart for patient survey history.
     */
    fun getPatientSurveyHistory(conn: Connection, patientId: String, loinc: String): HashMap<String, Any> {
        val map = HashMap<String, Any>()

        val loincGroupBy = if(loinc == "%") "" else "a.loinc,"

        val stmt = conn.prepareStatement("""
            SELECT
                WEEK(answer_date) as `week`,
                a.loinc as `loinc`,
                SUM(IF(quality = 'bad', 1, 0)) as `bad`,
                SUM(IF(quality = 'good', 1, 0)) as `good`,
                SUM(IF(quality = 'neutral', 1, 0)) as `neutral`
            FROM patient_answer pa
                    JOIN answer a ON pa.answer_id = a.answer_id
                    JOIN patient_question pq on pa.loinc = pq.loinc
            WHERE pa.patient_id = ?
              and YEAR(answer_date) = YEAR(NOW()) AND (WEEK(answer_date)+4) >= WEEK(NOW()) AND a.loinc LIKE ?
            GROUP BY %s WEEK(answer_date);
        """.trimIndent().format(loincGroupBy))

        stmt.setString(1, patientId)
        stmt.setString(2, loinc)
        val result = stmt.executeQuery()

        map.putIfAbsent("series", ArrayList<HashMap<String, Any>>())
        val series = map["series"] as ArrayList<HashMap<String, Any>>

        map.putIfAbsent("categories", ArrayList<String>())
        val categories = map["categories"] as ArrayList<String>

        series.add(hashMapOf(
                "name" to "good",
                "data" to ArrayList<Int>()
        ))

        series.add(hashMapOf(
                "name" to "bad",
                "data" to ArrayList<Int>()
        ))

        series.add(hashMapOf(
                "name" to "neutral",
                "data" to ArrayList<Int>()
        ))

        while(result.next()){
            val good = series[0]["data"] as ArrayList<Int>
            val bad = series[1]["data"] as ArrayList<Int>
            val neutral = series[2]["data"] as ArrayList<Int>

            good.add(result.getInt("good"))
            bad.add(result.getInt("bad"))
            neutral.add(result.getInt("neutral"))
            if(!categories.contains("" + result.getInt("week"))) {
                categories.add("" + result.getInt("week"))
            }
        }

        return map

    }

    /**
     * Return a list of survey questions that are not assigned to the patient
     */
    fun getPatientSurveyUnassignedQuestions(conn: Connection, patientId: String, display: String = "%"): ArrayList<PatientQuestion> {

        val displayCheck = if(display == "%") display else "%${display}%"

        val statement = conn.prepareStatement("""
            SELECT *
            FROM question q
                     LEFT JOIN (SELECT * FROM patient_question WHERE patient_id = ?) pq ON q.loinc = pq.loinc
                     JOIN answer a ON q.loinc = a.loinc
            WHERE patient_id is NULL
              AND q.display LIKE ?
            ORDER BY q.loinc, display_order ASC;
        """.trimIndent())

        statement.setString(1, patientId);
        statement.setString(2, displayCheck)

        val result = statement.executeQuery()

        return buildPatientQuestionListFromResultSet(result, patientId)

    }

    /**
     * Update a patients associated survey questions.
     */
    fun updatePatientSurvey(conn: Connection, patientId: String, questions: JsonArray?): Int {
        conn.autoCommit = false
        val stmt = conn.prepareStatement("""
            DELETE FROM patient_question WHERE patient_id = ?
        """.trimIndent())

        stmt.setString(1, patientId)
        stmt.executeUpdate()

        val questionIds: Array<String> = questions?.toList()?.map { it: JsonElement -> it.asString }?.toTypedArray() ?: arrayOf()
        val stmt2 = conn.prepareStatement("""
            INSERT INTO patient_question VALUES (?, ?)
        """.trimIndent())

        for(questionId in questionIds){
            stmt2.setString(1, patientId)
            stmt2.setString(2, questionId)
            stmt2.executeUpdate()
        }

        conn.commit()
        conn.autoCommit = true

        return questionIds.size

    }

    fun getPatientList(conn: Connection): ArrayList<String> {
        val list = ArrayList<String>()
        val results = conn.createStatement().executeQuery("SELECT DISTINCT patient_id from patient_question")

        while(results.next()){
            list.add(results.getString("patient_id"))
        }

        return list
    }

    fun postPatientAnswers(conn: Connection, patientId: String, patientAnswers: JsonArray?): Int {
        val answers: Array<JsonObject> = patientAnswers?.toList()?.map { it: JsonElement -> it.asJsonObject }?.toTypedArray() ?: arrayOf()

        conn.autoCommit = false
        val stmt2 = conn.prepareStatement("""
            INSERT INTO patient_answer VALUES (?, ?, ?, NOW())
        """.trimIndent())

        for(answer in answers){
            stmt2.setString(1, patientId)
            stmt2.setInt(2, answer.getAsJsonPrimitive("answer_id").asInt)
            stmt2.setString(3, answer.getAsJsonPrimitive("loinc").asString)
            stmt2.executeUpdate()
        }

        conn.commit()
        conn.autoCommit = true

        return answers.size
    }

}