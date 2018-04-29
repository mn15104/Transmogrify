var ws;
var user_id;
var user_id_accepted = false;
var friend_id_accepted = false;
function init()
{
    var url = new URL(window.location.href);
    if(!IS_NULL(url.searchParams.get("user_id"))){
        user_id = url.searchParams.get("user_id");
        console.log(user_id);
        ws = new WebSocket('ws://localhost:1337');
        
        // event emmited when connected
        ws.onopen = function () {
            console.log('client side acknowledge connection success');
            sendUserId();
        }

        // event emmited when receiving message 
        ws.onmessage = function (ev) {
            console.log("Received " + JSON.stringify(ev.data));
            if(user_id_accepted === false)
            {
                if(ev.message === 'user_id_accepted')
                {
                    user_id_accepted = true;
                }
            }
            else
            {
                if(ev.message === 'friend_id_accepted')
                {
                    friend_id_accepted = true;
                }
                else if(ev.message === 'friend_disconnected')
                {
                    friend_id_accepted = false;
                }
                else if(friend_id_accepted && ev.message === 'friend_message_rec')
                {
                    console.log("RECEIVED MESSAGE FROM FRIEND");
                }
            }
        }

        ws.onclose = function () {
            console.log('websocket has closed ...');
        }
    }
    else{
        console.log("No user id found in url");
    }
    $('.chat_top-bar').on('click', function(){
        connectToFriend(3);
    })
    $('#send_message').button().click(function(){
        // console.log("yo");
        sendMessage("HELLO");
    })
}

function sendUserId()
{
    ws.send(JSON.stringify({message:'user_id', 
                            data: { user_id:user_id }}));
}

function connectToFriend(friend_id)
{
    ws.send(JSON.stringify({message:'friend_id_req', 
                            data: { friend_id:friend_id, user_id:user_id }}));
}
function sendMessage(msg)
{
    ws.send(JSON.stringify({message:'friend_message_send', 
                            data: {user_id:user_id,
                                   chat_message:msg}}));
}