import dao.ClientManager
import dao.DataUtils
import spark.Spark.*
import com.google.gson.Gson
import com.google.gson.JsonArray

fun main(args: Array<String>){

    get("/patient/survey"){ req, res ->
        res.header("Content-Type", "application/json")
        val patientId:String = req.queryParams("patientId")
        val conn = ClientManager.getConnection()
        Gson().toJson(DataUtils.getPatientSurvey(conn, patientId))
    }

    get("/patient/survey/history"){ req, res ->
        res.header("Content-Type", "application/json")
        val patientId:String = req.queryParams("patientId")
        val loinc:String = req.queryParamOrDefault("loinc", "%")
        val conn = ClientManager.getConnection()
        Gson().toJson(DataUtils.getPatientSurveyHistory(conn, patientId, loinc))
    }

    post("/patient/survey/answer"){ req, res ->
        res.header("Content-Type", "application/json")
        val patientId:String = req.queryParams("patientId")
        val patientAnswers = Gson().fromJson(req.body(), JsonArray::class.java)
        val conn = ClientManager.getConnection()

        DataUtils.postPatientAnswers(conn, patientId, patientAnswers)

        Gson().toJson(hashMapOf(
                "msg" to "OK"
        ))
    }

    get("/practitioner/survey"){ req, res ->
        res.header("Content-Type", "application/json")
        val patientId:String = req.queryParams("patientId")
        val conn = ClientManager.getConnection()
        Gson().toJson(DataUtils.getPatientSurvey(conn, patientId))
    }

    get("/practitioner/survey/unassigned"){ req, res ->
        res.header("Content-Type", "application/json")
        val patientId:String = req.queryParams("patientId")
        val display:String = req.queryParamOrDefault("display", "%")
        val conn = ClientManager.getConnection()
        Gson().toJson(DataUtils.getPatientSurveyUnassignedQuestions(conn, patientId, display))
    }

    get("/practitioner/patient/list"){ req, res ->
        res.header("Content-Type", "application/json")
        val conn = ClientManager.getConnection()
        Gson().toJson(DataUtils.getPatientList(conn))
    }

    post("/practitioner/survey/update"){ req, res ->
        res.header("Content-Type", "application/json")
        val patientId:String = req.queryParams("patientId")
        val questions = Gson().fromJson(req.body(), JsonArray::class.java)
        val conn = ClientManager.getConnection()

        DataUtils.updatePatientSurvey(conn, patientId, questions)

        Gson().toJson(hashMapOf(
                "msg" to "OK"
        ))
    }

}
