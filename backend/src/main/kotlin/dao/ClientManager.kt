package dao

import java.sql.Connection
import java.sql.DriverManager

object  ClientManager {

    private val host = System.getenv("MYSQL_HOST")
    private val port = System.getenv("MYSQL_PORT")
    private val user = System.getenv("MYSQL_USER")
    private val pass = System.getenv("MYSQL_PASS")

    /**
     * Get a database connection using environment variables at start up time.
     */
    fun getConnection(): Connection {
        Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
        return DriverManager.getConnection(
            String.format("jdbc:mysql://%s:%s/data?user=%s&password=%s", host, port, user, pass)
        )
    }

}