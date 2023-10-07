package main

import (
    "fmt"
    "net/http"
    "io"
    "log"
    "os"
    "encoding/json"
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
)

type JSON = map[string]interface{}

type DBHandler struct {
    db *sql.DB
}
var DBHandlerInstance DBHandler

var handlerMap = map[string]func(http.ResponseWriter, JSON) {
    "/create": create,
    "/read"  : read,
    "/update": update,
    "/delete": delete,
}

const database_file = "database.db"

func (handler DBHandler) open() {
	file, err := os.OpenFile("database.db", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err.Error())
	}
	file.Close()

    db, err := sql.Open("sqlite3", database_file)
    if err != nil {
        log.Fatal(err.Error())
    }
    handler.db = db

    _, table_check := db.Query("select * from events;")
    if table_check != nil {
        fmt.Println("Creating table...")
        createStudentTableSQL := `CREATE TABLE events (
            "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,		
            "city" TEXT,
            "date" TEXT,
            "name" TEXT,
            "description" TEXT		
          );`
    
        statement, err := db.Prepare(createStudentTableSQL)
        if err != nil {
            log.Fatal(err.Error())
        }
        statement.Exec()
        fmt.Println("Table created")
    }
}

func (handler DBHandler) close() {
    handler.db.Close()
}

func (handler DBHandler) read() JSON {

    insertStudentSQL := `SELECT * FROM events;`
    statement, err1 := handler.db.Prepare(insertStudentSQL)
    if err1 != nil {
        log.Fatal(err1.Error())
    }
    response, err2 := statement.Exec()
    if err2 != nil {
        log.Fatal(err2.Error())
    }

    fmt.Println(response)

    return make(JSON)
}

func (handler DBHandler) create(body JSON) bool {
    city, ok := body["city"]
    if !ok {return false}
    date, ok := body["date"]
    if !ok {return false}
    event, ok := body["event"]
    if !ok {return false}
    eventMap, ok := event.(JSON)
    if !ok {return false}
    name, ok := eventMap["name"]
    if !ok {return false}
    description, ok := eventMap["description"]
    if !ok {return false}

    insertStudentSQL := `INSERT INTO events(city, date, name, description) VALUES (?, ?, ?, ?)`
    statement, err := handler.db.Prepare(insertStudentSQL)
    if err != nil {
        log.Fatal(err.Error())
    }
    _, err = statement.Exec(city, date, name, description)
    if err != nil {
        log.Fatal(err.Error())
    }
    fmt.Println("Inserted new element")

    return true
}

func (handler DBHandler) update(body JSON) {

}

func (handler DBHandler) delete(id int) {

}

func authOk(body JSON) bool {
    val, ok := body["pass"]
    if !ok {return false}
    if val != "12345contraseña" {return false}
    return true
}

func readBody(r *http.Request) (JSON, error) {
    bodyBytes, ioerr := io.ReadAll(r.Body)
    if ioerr != nil {
        return make(JSON), ioerr
    }

    bodyString := string(bodyBytes)
    var jsonMap JSON
    jsonerr := json.Unmarshal([]byte(bodyString), &jsonMap)
    if jsonerr != nil {
        return make(JSON), jsonerr
    }
    
    return jsonMap, nil
}

func create(w http.ResponseWriter, body JSON) {
    DBHandlerInstance.create(body)
}

func read(w http.ResponseWriter, body JSON) {
    DBHandlerInstance.read()
}

func update(w http.ResponseWriter, body JSON) {
    DBHandlerInstance.update(body)
}

func delete(w http.ResponseWriter, body JSON) {
    DBHandlerInstance.delete(body["id"].(int))
}

func handler(w http.ResponseWriter, r *http.Request) {
    handler_function, ok := handlerMap[r.URL.Path]
    if !ok {
        http.NotFound(w, r)
        return
    }

    body, err := readBody(r)
    if err != nil {
        w.WriteHeader(http.StatusBadRequest)
        io.WriteString(w, "Bad Request")
        return
    }
    
    if !authOk(body) {
        w.WriteHeader(http.StatusUnauthorized)
        io.WriteString(w, "Unauthorized")
        return
    }

    handler_function(w, body)
}

// End points:
//   /create  (request: {pass: str, city: str, date: str, event: {name: str, description: str}}, response: 200)
//   /read    (request: {pass: str}, response: 200 {events: [{id: int, city: str, date: str, name: str, description: str}]})
//   /update  (request: {pass: str, id: int, event: {name: str, description: str}}, response: 200})
//   /delete  (request: {pass: str, id: int}, response: 200)
func main() {
    DBHandlerInstance.open()

    http.HandleFunc("/create", handler)
    http.HandleFunc("/read"  , handler)
    http.HandleFunc("/update", handler)
    http.HandleFunc("/delete", handler)

    fmt.Println("Server is running on port 8080")
    http.ListenAndServe(":8080", nil)
}
