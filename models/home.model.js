var config = require('../config');
var sqlite3 = require('sqlite3');

var Home = function (){

}
let db = new sqlite3.Database('./OffMyChest.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

db.run(`CREATE TABLE IF NOT EXISTS HOME_posts (post VARCHAR(255), entry VARCHAR(10), time VARCHAR(255))`, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("Table created");
    }
});


Home.insert = function(text, time) {
    var max_entry = 0;
    db.get("SELECT MAX(entry) AS entry FROM HOME_posts", function(err, row){
        if (err) throw err;
        if (row != undefined){
            console.log("1");
            var get_entry = parseInt(row.entry);
            max_entry = get_entry + 1;
            db.run("INSERT INTO HOME_posts (post, entry, time) VALUES ('" + text + "', '" + max_entry + "', '" + time + "')", function (err, row){
                if (err) throw err;
                console.log("max entry is ", max_entry);
                console.log("Inserted into db");
            });
        }
        else{
            db.run("INSERT INTO HOME_posts (post, entry, time) VALUES ('" + text + "', '" + max_entry + "', '" + time + "')", function (err, row){
                if (err) throw err;
                console.log("max entry is ", max_entry);
                console.log("Inserted into db");
            }); 
        }
    });
}


Home.getPost = function(last_entry, callback){
    console.log("CALLED");
    db.get("SELECT * FROM HOME_posts WHERE entry = '" + last_entry + "'", 
        function(err, row) {
            if(row == undefined){
                var response = {post: "", entry: "", time: ""}
                console.log("Doesnt exist " + last_entry);
                callback("Non existent", false);
            }
            else{
                var row = {"post": row.post, "entry": row.entry, "time": row.time}
                console.log(row);
                callback(row, true);
            }
            if(err){
                console.log(err);
            }
        });
}


Home.db = db;
Home.table = "HOME_posts";
Home.table.format = "(post, entry, time)";

// test_data = function(){
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("consequat",1,"2018-02-28 14:01:45"),("Fusce dolor quam, elementum at, egestas a,",2,"2018-06-02 15:02:39"),("Proin dolor.",3,"2016-11-12 15:34:24"),("Quisque imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus,",4,"2018-03-26 21:55:56"),("sagittis. Nullam vitae diam. Proin dolor. Nulla",5,"2017-06-24 21:03:22"),("enim non nisi. Aenean eget metus. In nec",6,"2018-01-02 19:38:43"),("inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In",7,"2016-11-28 00:21:22"),("ultricies ornare, elit elit fermentum risus,",8,"2016-11-21 22:44:03"),("turpis egestas.",9,"2018-03-09 13:07:20"),("sem. Pellentesque ut ipsum ac mi",10,"2016-07-17 22:47:15")');
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("consectetuer",11,"2017-11-09 16:42:49"),("In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec egestas.",12,"2016-12-19 15:17:31"),("augue, eu",13,"2017-12-17 03:30:32"),("augue",14,"2018-05-02 19:58:35"),("purus, accumsan",15,"2018-04-10 02:46:54"),("Suspendisse sed",16,"2017-12-06 13:31:07"),("metus urna convallis erat, eget tincidunt dui augue eu tellus.",17,"2018-01-26 23:07:08"),("elit sed consequat auctor, nunc nulla",18,"2017-10-01 15:10:11"),("tincidunt dui augue eu tellus. Phasellus",19,"2018-04-14 05:49:09"),("Fusce fermentum fermentum",20,"2017-08-16 18:56:22")');
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("Donec est mauris, rhoncus",21,"2018-01-16 04:38:46"),("aliquet vel, vulputate eu, odio. Phasellus at augue",22,"2016-09-20 20:01:05"),("velit. Cras lorem lorem, luctus ut, pellentesque",23,"2016-10-30 10:28:14"),("a, auctor non, feugiat nec, diam. Duis mi",24,"2017-01-05 13:05:15"),("laoreet posuere, enim nisl elementum purus, accumsan interdum libero",25,"2018-02-04 17:06:31"),("Pellentesque ut ipsum ac",26,"2017-12-06 19:28:51"),("Curabitur dictum.",27,"2016-12-07 01:11:22"),("sit amet, consectetuer adipiscing elit. Etiam laoreet, libero",28,"2018-04-23 00:24:41"),("senectus et netus et malesuada",29,"2018-05-18 10:16:28"),("lacus pede sagittis augue, eu tempor",30,"2017-11-09 05:03:16")');
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("euismod mauris eu elit. Nulla facilisi. Sed neque.",31,"2017-03-06 20:53:47"),("Vivamus euismod urna. Nullam",32,"2018-04-18 11:37:52"),("mauris elit, dictum eu, eleifend",33,"2018-03-19 18:40:14"),("orci",34,"2017-12-08 15:14:58"),("ipsum leo elementum sem, vitae aliquam eros turpis non",35,"2018-03-14 17:35:16"),("ut cursus luctus,",36,"2017-10-14 10:39:15"),("rutrum non, hendrerit id, ante. Nunc mauris",37,"2018-04-18 22:23:16"),("ut odio vel",38,"2017-11-14 15:14:10"),("pretium et, rutrum",39,"2017-07-15 06:23:02"),("sem semper erat, in consectetuer ipsum nunc id enim.",40,"2016-11-07 01:54:03")');
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("vitae, sodales at, velit. Pellentesque ultricies",41,"2018-06-24 22:38:13"),("ac nulla. In tincidunt congue turpis. In condimentum. Donec",42,"2018-02-08 20:29:48"),("scelerisque mollis. Phasellus libero mauris, aliquam",43,"2018-03-05 03:33:13"),("eget lacus.",44,"2018-03-13 22:18:49"),("scelerisque",45,"2017-10-30 22:33:09"),("Integer vitae nibh. Donec est mauris,",46,"2017-12-14 23:01:00"),("justo. Proin non massa non ante",47,"2018-05-01 23:27:47"),("rutrum",48,"2016-10-29 08:30:08"),("Pellentesque habitant morbi tristique senectus et",49,"2018-04-10 23:59:23"),("dictum mi, ac mattis velit",50,"2017-08-17 08:33:34")');
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("lorem ut aliquam iaculis, lacus pede sagittis",51,"2018-03-28 15:23:45"),("mattis semper, dui lectus rutrum urna,",52,"2017-05-21 05:18:46"),("montes, nascetur ridiculus",53,"2017-10-29 09:38:13"),("vel",54,"2016-07-19 13:14:22"),("In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec",55,"2017-02-08 15:00:13"),("Vivamus",56,"2017-10-08 15:28:19"),("semper. Nam tempor diam dictum sapien. Aenean",57,"2016-11-03 16:17:53"),("Curabitur vel lectus. Cum",58,"2016-07-23 01:49:51"),("dignissim tempor arcu. Vestibulum ut eros non enim",59,"2016-11-07 03:12:12"),("blandit. Nam nulla magna, malesuada vel,",60,"2016-07-16 04:40:14")');
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("nostra,",61,"2017-11-18 01:42:34"),("ridiculus mus. Donec dignissim magna a tortor.",62,"2016-08-05 19:38:52"),("mauris",63,"2018-05-16 15:40:35"),("faucibus lectus, a sollicitudin orci sem eget massa.",64,"2017-09-24 04:48:27"),("torquent per conubia nostra, per inceptos hymenaeos.",65,"2017-08-23 21:43:48"),("non arcu. Vivamus sit amet risus.",66,"2017-06-06 06:52:08"),("tempus non, lacinia",67,"2018-03-07 06:18:55"),("mauris erat eget",68,"2017-01-19 00:10:21"),("egestas lacinia. Sed congue, elit",69,"2016-08-22 03:19:20"),("egestas blandit. Nam nulla magna, malesuada",70,"2017-09-13 01:05:03")');
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("ornare, facilisis",71,"2016-11-26 13:20:39"),("pede. Cras",72,"2016-10-26 06:38:52"),("amet ornare lectus",73,"2017-03-30 11:23:35"),("et libero. Proin mi. Aliquam gravida",74,"2018-04-11 14:00:59"),("convallis dolor. Quisque",75,"2016-12-08 18:01:21"),("posuere cubilia Curae; Donec tincidunt. Donec vitae erat vel pede",76,"2017-01-08 09:05:45"),("augue ut lacus. Nulla tincidunt, neque vitae",77,"2016-12-27 04:39:53"),("faucibus leo,",78,"2016-11-27 21:18:48"),("Morbi accumsan laoreet",79,"2017-11-25 14:29:02"),("Cras eget nisi dictum",80,"2017-05-19 03:13:28")');
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed",81,"2018-04-22 09:58:24"),("et magnis dis parturient montes,",82,"2016-08-01 21:09:15"),("parturient montes, nascetur ridiculus mus. Aenean eget",83,"2018-06-15 02:37:12"),("tristique",84,"2018-05-26 03:53:05"),("dolor, tempus non, lacinia at, iaculis quis, pede. Praesent eu",85,"2017-07-04 08:37:34"),("Cum sociis natoque penatibus et magnis dis",86,"2018-04-25 12:52:49"),("pretium aliquet, metus urna",87,"2017-10-10 20:01:49"),("ultrices. Duis volutpat nunc",88,"2017-05-30 20:11:57"),("rhoncus. Nullam velit dui, semper et, lacinia vitae, sodales",89,"2017-02-27 04:45:42"),("Donec",90,"2017-03-02 23:24:16")');
//         con.query('INSERT INTO `threads` (`post`,`entry`,`time`) VALUES ("aliquet. Proin velit. Sed malesuada augue ut lacus. Nulla",91,"2018-01-27 04:33:18"),("eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros.",92,"2017-08-02 12:25:08"),("fermentum",93,"2016-09-07 00:21:22"),("molestie orci tincidunt adipiscing. Mauris molestie",94,"2018-04-02 06:34:39"),("tristique pellentesque, tellus sem",95,"2017-12-22 11:11:55"),("Sed diam lorem, auctor quis, tristique",96,"2016-09-22 05:44:41"),("sapien imperdiet",97,"2017-10-29 05:39:22"),("mi lacinia mattis. Integer eu",98,"2017-05-13 16:09:28"),("conubia nostra, per",99,"2017-07-07 02:35:38"),("odio a",100,"2018-04-11 21:59:25")');
// }

module.exports = Home;