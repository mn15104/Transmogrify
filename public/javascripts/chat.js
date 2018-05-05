


session_info = Object.create({
    ws:'',
    user_id:'',
    user_id_accepted : false,
    friend_id_accepted : false
})

function init()
{
    initChat();
    $('.chat_top-bar').on('click', function(){
        chat_container = $(this).parent('.chat_container');
        chat_container.toggleClass('chat_container_closed'); 
        container_user_id = chat_container.attr('data-chat-user-id');
        connectToFriend(container_user_id);
    })
}

function initChat()
{
    var url = new URL(window.location.href);
    if(!IS_NULL(url.searchParams.get("user_id"))){

        session_info.user_id = url.searchParams.get("user_id");
        session_info.ws = new WebSocket('ws://localhost:1337');
        
        // event emmited when connected
        session_info.ws.onopen = function () {
            console.log('client side acknowledge connection success');
            sendUserId();
        }

        // event emmited when receiving message 
        session_info.ws.onmessage = function (ev) {
            var msg = JSON.parse(ev.data);
            console.log("Received " + (msg));
            if(session_info.user_id_accepted === false)
            {
                console.log("DEBUG 1" + msg['message']);
                if(msg['message'] === 'user_id_accepted')
                {   console.log("DEBUG 2");
                    session_info.user_id_accepted = true;
                  
                }
            }
            else
            {   console.log("DEBUG 3");
                if(msg['message']  === 'friend_id_accepted')
                {   console.log("DEBUG 4");
                    session_info.friend_id_accepted = true;
                }
                else if(msg['message']  === 'friend_disconnected')
                {   console.log("DEBUG 5");
                    session_info.friend_id_accepted = false;
                }
                else if(session_info.friend_id_accepted && msg['message']  === 'friend_message_rec')
                {   console.log("DEBUG 6");
                    console.log(msg['chat_message']);
                    appendReceivedMessage(msg['chat_message']);
                }
            }
        }

        session_info.ws.onclose = function () {
            console.log('websocket has closed ...');
        }
    }
    else{
        console.log("No user id found in url");
    }
    $('.myButton').button().click(function(){
        sendMessage("[USER MESSAGE] >> " + $(this).siblings('.chat_input').val());
        appendSentMessage("[USER MESSAGE] >> " + $(this).siblings('.chat_input').val());
    })
}
function appendSentMessage(chat_message){
    $('.chat_discussion').append('<li class="chat_self">'              +      
                                       '<div class="chat_avatar">'      +  
                                            '<img src="https://cdn2.digitalartsonline.co.uk/cmsdata/slideshow/3513552/polybreno_1500.jpg" /> ' +      
                                        '</div>' +     
                                        '<div class="chat_messages">' +        
                                            '<p>' + chat_message + '</p>' +        
                                            '<time datetime="2009-11-13T20:00">Timothy • 51 min</time>' +      
                                        '</div>' +
                                    '</li>');
}
function appendReceivedMessage(chat_message){
    $('.chat_discussion').append('<li class="chat_other">'              +      
                                       '<div class="chat_avatar">'      +  
                                            '<img src="https://cdn2.digitalartsonline.co.uk/cmsdata/slideshow/3513552/polybreno_1500.jpg" /> ' +      
                                        '</div>' +     
                                        '<div class="chat_messages">' +        
                                            '<p>' + chat_message + '</p>' +        
                                            '<time datetime="2009-11-13T20:00">Timothy • 51 min</time>' +      
                                        '</div>' +
                                    '</li>');
}

function sendUserId()
{
    session_info.ws.send(JSON.stringify({message:'user_id', 
                            data: { user_id:user_id }}));
}

function connectToFriend(friend_id)
{
    session_info.ws.send(JSON.stringify({message:'friend_id_req', 
                            data: { friend_id:friend_id, user_id:user_id }}));
}
function sendMessage(msg)
{
    session_info.ws.send(JSON.stringify({message:'friend_message_send', 
                            data: {user_id:user_id,
                                   chat_message:msg}}));
}