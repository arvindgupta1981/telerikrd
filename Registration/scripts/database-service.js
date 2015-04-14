 $(document).ready(function() {
            $("#dob").kendoDatePicker();
             viewModel = kendo.observable({
                firstName: "John",
                lastName: "Doe",
                genders: ["Male", "Female"],
                gender: "Male",
                address: "JKT",
                email: "arvind.gupta@jktech.com",
                phone: "9899968001",
                agreed: false,
                confirmed: false,
                register: function(e) {
                    e.preventDefault();

                    this.set("confirmed", true);
                },
                startOver: function() {
                    this.set("confirmed", false);
                    this.set("agreed", false);
                    this.set("gender", "Male");
                    this.set("firstName", "Arvind");
                    this.set("lastName", "Gupta");
                }
                
            });

            kendo.bind($("#example"), viewModel);
                 
            
        });

document.addEventListener("deviceready", intialize, false);
document.addEventListener("touchstart", function() {}, false);

var app = new kendo.mobile.Application(document.body);
app.db = null;
var viewModel = {};
var render ={};

function intialize() {
    navigator.splashscreen.hide();
	app.openDb();
	app.createTable();
	app.refresh();
}
app.openDb = function() {
    var dbName = "registration.sqlite";
    if (window.navigator.simulator === true) {
        // For debugin in simulator fallback to native SQL Lite
        //console.log("Use built in SQL Lite");
        app.db = window.openDatabase(dbName, "1.0", "Cordova Demo", 200000);
    }
    else {
        app.db = window.sqlitePlugin.openDatabase(dbName);
    }
} 

app.createTable = function() {
	var db = app.db;
	db.transaction(function(tx) {
        //tx.executeSql("DROP TABLE IF EXISTS registration");
		tx.executeSql("CREATE TABLE IF NOT EXISTS registration(ID INTEGER PRIMARY KEY ASC, name TEXT, lname TEXT, gender TEXT, address TEXT, email TEXT, phone TEXT,  added_on DATETIME)", []);
	});
}

app.refresh = function() {
	var renderRegister = function (row) {
		//return "<li>" + "<div class='todo-check'></div>" + row.Re + "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
        return "<li>" + row.name +  "</li>";
	}
    
	 render = function (tx, rs) {
		var rowOutput = "";
		var resgisterItems = document.getElementById("registerItems");
		for (var i = 0; i < rs.rows.length; i++) {
			rowOutput += renderRegister(rs.rows.item(i));
		}
      
		resgisterItems.innerHTML = rowOutput;
	}
    
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM registration", [], 
					  render, 
					  app.onError);
	});
    
    $("#grid").kendoGrid({
       columns: [{
                                field: "name",
                                title: "Name",
                                width: 200
                            }, {
                                field: "lname",
                                title: "Last Name"
                            }],
       dataSource: render,
       filterable: true,
       columnMenu: true,
       mobile: true,
       height: 100 
    });
}

function addRegister() {
	var name = document.getElementById("fname");
	app.addRegister(viewModel);
	name.value = "";
    
}

      
app.addRegister = function(viewModel) {
	var db = app.db;
	db.transaction(function(tx) {
		var addedOn = new Date();
		tx.executeSql("INSERT INTO registration(name, lname, gender, phone, email, address, added_on) VALUES (?,?,?,?,?,?,?)",
					  [viewModel.get("firstName"), viewModel.get("lastName"), viewModel.get("gender"), viewModel.get("phone"),
                       viewModel.get("email"), viewModel.get("address"), addedOn],
					  app.onSuccess,
					  app.onError);
	});
}

app.onError = function(tx, e) {
	console.log("Error: " + e.message);
} 
      
app.onSuccess = function(tx, r) {
	app.refresh();
}












        