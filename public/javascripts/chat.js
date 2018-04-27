var ws;
function init(){
    ws = new WebSocket('ws://localhost:1337');
    // event emmited when connected
    ws.onopen = function () {
        console.log('websocket is connected ...');
        ws.send('client side acknowledge connection success');
        // ws.send('connected');
        // ws.send('userid_init', "2");
        ws.send(JSON.stringify({message:'userid_init',userid:'456'}));
    }
    // event emmited when receiving message 
    ws.onmessage = function (ev) {
        console.log(ev);
    }
}