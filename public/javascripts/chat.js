


$.session_info = Object.create({
    ws:'',
    user_id:'',
    user_id_accepted : false,
    friend_id_accepted : false
})

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
            console.log("Received " + (ev.data));

     

            if(user_id_accepted === false)
            {
                console.log("DEBUG 1");
                if(ev.data['message'] === 'user_id_accepted')
                {   console.log("DEBUG 2");
                    user_id_accepted = true;
                } 
            }
            else
            {   console.log("DEBUG 3");
                if(ev.data['message']  === 'friend_id_accepted')
                {   console.log("DEBUG 4");
                    friend_id_accepted = true;
                }
                else if(ev.data['message']  === 'friend_disconnected')
                {   console.log("DEBUG 5");
                    friend_id_accepted = false;
                }
                else if(friend_id_accepted && ev.data['message']  === 'friend_message_rec')
                {   console.log("DEBUG 6");
                    console.log(ev.data['chat_message']);
                    appendMessage(ev.data['chat_message']);
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
        sendMessage("HELLO");
    })
}

function appendMessage(chat_message){
    console.log(ev.data['chat_message']);
    $('.chat_discussion').append(`<li class="chat_other">      
                                        <div class="chat_avatar">        
                                            <img src='https://cdn2.digitalartsonline.co.uk/cmsdata/slideshow/3513552/polybreno_1500.jpg' />      
                                        </div>      
                                        <div class="chat_messages">        
                                            <p>` + chat_message + `</p>        
                                            <time datetime="2009-11-13T20:00">Timothy • 51 min</time>      
                                        </div>
                                </li>`);
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