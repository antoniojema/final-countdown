package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

type JSON = map[string]interface{}

type DBHandler struct {
	db *sql.DB
}

type Event struct {
	id int
	city string
	date string
	title string
	description string
}

func (event *Event) MarshalJSON() ([]byte, error) {
	fmt.Println(event.id)
	fmt.Println(event.city)
	fmt.Println(event.description)
	return json.MarshalIndent(
		map[string]interface{} {
			"id": event.id,
			"city" : event. city,
			"date" : event. date,
			"title" : event .title,
			"description" :  event.description,
		},
		"",
		"  ",
	)
}

var DBHandlerInstance DBHandler

var handlerMap = map[string]func(http.ResponseWriter, *JSON){
	"/create": create,
	"/read":   read,
	"/update": update,
	"/delete": delete,
}

var CITIES = []string {
	"columbus",
	"granada",
}

const database_file = "database.db"

func (handler *DBHandler) open() {
	file, err := os.OpenFile("database.db", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println(err.Error())
	}
	file.Close()

	db, err := sql.Open("sqlite3", database_file)
	if err != nil {
		fmt.Println(err.Error())
	}
	handler.db = db

	_, table_check := db.Query("select * from events;")
	if table_check != nil {
		fmt.Println("Creating table...")
		createStudentTableSQL := `CREATE TABLE events (
            "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,		
            "city" TEXT,
            "date" TEXT,
            "title" TEXT,
            "description" TEXT		
          );`

		statement, err := db.Prepare(createStudentTableSQL)
		if err != nil {
			fmt.Println(err.Error())
		}
		statement.Exec()
		fmt.Println("Table created")
	}
}

func (handler *DBHandler) close() {
	handler.db.Close()
}

func (handler *DBHandler) read() []byte {
	insertStudentSQL := `SELECT * FROM events;`
	query, err1 := handler.db.Query(insertStudentSQL)
	if err1 != nil {
		fmt.Println(err1.Error())
		return []byte{}
	}

	events := []Event{}

	for query.Next() { // Iterate and fetch the records from result cursor
		event := Event{}

		query.Scan(&event.id, &event.city, &event.date, &event.title, &event.description)

		events = append(events, event)
	}

	response, err := json.Marshal(map[string][]Event{"events" : events})
	if err != nil {
		fmt.Println(err.Error())
		return []byte{}
	}

	return response
}

func (handler *DBHandler) create(body *JSON) bool {
	if !cityOk(body) || !dateOk(body) {return false}

	event, ok := (*body)["event"]
	if !ok {return false}
	eventMap, ok := event.(JSON)
	if !ok {return false}
	title, ok := eventMap["title"]
	if !ok {return false}
	description, ok := eventMap["description"]
	if !ok {return false}

	city, _ := (*body)["city"]
	date, _ := (*body)["date"]

	insertStudentSQL := `INSERT INTO events(city, date, title, description) VALUES (?, ?, ?, ?)`
	statement, err := handler.db.Prepare(insertStudentSQL)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	_, err = statement.Exec(city, date, title, description)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	fmt.Println("Inserted new element")

	return true
}

func (handler *DBHandler) update(body *JSON) bool {
	insertStudentSQL := `UPDATE events SET title = ?, description = ? WHERE id=?;`
	statement, err1 := handler.db.Prepare(insertStudentSQL)
	if err1 != nil {
		fmt.Println(err1.Error())
		return false
	}
	
	id, ok := (*body)["id"]
	if !ok {return false}
	event, ok := (*body)["event"]
	if !ok {return false}
	eventMap, ok := event.(JSON)
	if !ok {return false}
	title, ok := eventMap["title"]
	if !ok {return false}
	description, ok := eventMap["description"]
	if !ok {return false}

	_, err := statement.Exec(title, description, id)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	fmt.Println("Updated element")

	return true
}

func (handler *DBHandler) delete(id int) bool {
	return true
}

func cityOk(body *JSON) bool {
	if body == nil {return false}

	city, ok := (*body)["city"]
	if !ok {return false}
	city_str := city.(string)

	is_in := false
	for i := 0; i < len(CITIES); i++ {
		if city_str == CITIES[i] {
			is_in = true
			break
		}
	}

	return is_in
}

func dateOk(body *JSON) bool {
	if body == nil {return false}

	date, ok := (*body)["date"]
	if !ok {return false}
	date_str := date.(string)

	date_split := strings.Split(date_str, "/")
	if len(date_split) != 3 {return false}

	day_str := date_split[0]
	if len(day_str) != 2 {return false}
	day, err := strconv.Atoi(day_str)
	if err != nil {return false}

	month_str := date_split[1]
	if len(month_str) != 2 {return false}
	month, err := strconv.Atoi(month_str)
	if err != nil {return false}

	year, err := strconv.Atoi(date_split[2])
	if err != nil {return false}

	if year != 2023 {return false}
	if month < 8 || month > 11 {return false}
	if (
		(month ==  8 && (day < 30 || day > 31)) ||
		(month ==  9 && (day <  0 || day > 30)) ||
		(month == 10 && (day <  0 || day > 31)) ||
		(month == 11 && (day <  0 || day > 30))) {
		return false
	}

	return true
}

func authOk(body *JSON) bool {
	if body == nil {return false}

	val, ok := (*body)["pass"]
	if !ok {
		return false
	}
	if val != "12345contraseña" {
		return false
	}
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

func create(w http.ResponseWriter, body *JSON) {
	if !DBHandlerInstance.create(body) {
		w.WriteHeader(http.StatusBadRequest)
	}
}

func read(w http.ResponseWriter, body *JSON) {
	response := DBHandlerInstance.read()
	_, err := io.WriteString(w, string(response))
	if err != nil {
		fmt.Println(err.Error())
	}
}

func update(w http.ResponseWriter, body *JSON) {
	if !DBHandlerInstance.update(body) {
		w.WriteHeader(http.StatusBadRequest)
	}
}

func delete(w http.ResponseWriter, body *JSON) {
	if !DBHandlerInstance.delete((*body)["id"].(int)) {
		w.WriteHeader(http.StatusBadRequest)
	}
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

	if !authOk(&body) {
		w.WriteHeader(http.StatusUnauthorized)
		io.WriteString(w, "Unauthorized")
		return
	}

	handler_function(w, &body)
}

// End points:
//
//	/create  (request: {pass: str, city: str, date: str, event: {title: str, description: str}}, response: 200)
//	/read    (request: {pass: str}, response: 200 {events: [{id: int, city: str, date: str, title: str, description: str}]})
//	/update  (request: {pass: str, id: int, event: {title: str, description: str}}, response: 200})
//	/delete  (request: {pass: str, id: int}, response: 200)
func main() {
	DBHandlerInstance.open()

	http.HandleFunc("/create", handler)
	http.HandleFunc("/read", handler)
	http.HandleFunc("/update", handler)
	http.HandleFunc("/delete", handler)

	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", nil)
}
