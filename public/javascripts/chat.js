var ws;
var user_id;
function init()
{



    var url = new URL(window.location.href);
    if(!IS_NULL(url.searchParams.get("user_id"))){
        user_id = url.searchParams.get("user_id");
        console.log(user_id);
        ws = new WebSocket('ws://localhost:1337');
        
        // event emmited when connected
        ws.onopen = function () {
            ws.send('client side acknowledge connection success');
            ws.send(JSON.stringify({message:'user_id', user_id: user_id}));
        }

        // event emmited when receiving message 
        ws.onmessage = function (ev) {
            console.log(ev);
        }

        ws.onclose = function () {
            console.log('websocket has closed ...');
        }
    }
    else{
        console.log("No user id found in url");
    }




}
