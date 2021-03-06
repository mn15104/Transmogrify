session_info = Object.create({
    ws:'',
    user_id_accepted : false,
    friend_id_accepted : false
})

function connect(){
    window.onbeforeunload = function (e) {
        if(!IS_NULL(session_info.ws)) session_info.ws.close();
    };
    chat_container = $('.chat_container');
    chat_container.toggleClass('chat_container_closed'); 
    profile_user_id = chat_container.attr('data-user-id');

 
    connectToFriend(profile_user_id);
}

function initChat()
{

        var url = new URL(window.location.href);
   
        session_info.ws = new WebSocket('ws://localhost:3000');
        window.onbeforeunload = function() {
            session_info.ws.onclose = function () {} // disable onclose handler first
            session_info.ws.close()
        }
        // event emmited when connected
        session_info.ws.onopen = function () {
            console.log('client side acknowledge connection success');
            sendUserId();
        }

        // event emmited when receiving message 
        session_info.ws.onmessage = function (ev) {
            var msg = JSON.parse(ev.data);
            console.log(msg)
            {   console.log("DEBUG 3");
                if(msg['message']  === 'friend_id_accepted')
                {   
                    console.log("DEBUG 4.a");
                    session_info.friend_id_accepted = true;
                }
                else if(msg['message']  === 'friend_req_offline')
                {
                    console.log("DEBUG 4.b");
                    session_info.friend_id_offline = true;
                }
                else if(msg['message']  === 'friend_disconnected')
                {   
                    console.log("DEBUG 5");
                    session_info.friend_id_accepted = false;
                }
                else if(   (session_info.friend_id_accepted && msg['message']  === 'friend_message_rec')
                        || (session_info.friend_id_offline && msg['message']  === 'friend_message_rec'))
                {   
                    console.log("DEBUG 6");
                    console.log(msg['chat_message']);
                    appendReceivedMessage(msg['chat_message'],msg['profile_picture']);
                }
                else if(   (session_info.friend_id_accepted && msg['message']  === 'friend_message_send')
                        || (session_info.friend_id_offline && msg['message']  === 'friend_message_send'))
                {   
                    console.log("DEBUG 7");
                    console.log(msg['chat_message']);
                    appendSentMessage(msg['chat_message'], msg['profile_picture']);
                }
            }
        }

        session_info.ws.onclose = function () {
            console.log('websocket has closed ...');
        }
    

    $('#send_message').button().click(function(){
        console.log($(this).siblings('.chat_input').eq(0).val());
        sendMessage($(this).siblings('.chat_input').eq(0).val());
    })
}
function appendSentMessage(chat_message, profile_picture){
    $('.chat_discussion').append('<li class="chat_self">'              +      
                                       '<div class="chat_avatar">'      +  
                                            '<img src="' + profile_picture + '" /> ' +      
                                        '</div>' +     
                                        '<div class="chat_messages">' +        
                                            '<p>' + chat_message + '</p>' +        
                                            '<time datetime="2009-11-13T20:00">Timothy • 51 min</time>' +      
                                        '</div>' +
                                    '</li>');
}
function appendReceivedMessage(chat_message, profile_picture){
    $('.chat_discussion').append('<li class="chat_other">'              +      
                                       '<div class="chat_avatar">'      +  
                                            '<img src="' + profile_picture + '" /> ' +      
                                        '</div>' +     
                                        '<div class="chat_messages">' +        
                                            '<p>' + chat_message + '</p>' +        
                                            '<time datetime="2009-11-13T20:00">Timothy • 51 min</time>' +      
                                        '</div>' +
                                    '</li>');
}

function sendUserId()
{
    try{
        session_info.ws.send(JSON.stringify({message:'user_id'}));
    }catch{
        console.log("You are not logged in/user_id not found");
    }

}

function connectToFriend(friend_id)
{
    try{
        session_info.ws.send(JSON.stringify({message:'friend_id_req', 
                                data: { friend_id:friend_id}}));
    }catch{
        console.log("You are not logged in/user_id not found");
    }
}
function sendMessage(msg)
{
    if(!IS_NULL(msg)){
        
        console.log("SEND + " + msg);
        try{
            session_info.ws.send(JSON.stringify({message:'friend_message_send', 
                                    data: {chat_message:msg}}));
        }catch{
            console.log("You are not logged in/user_id not found");
        }
    }
}



function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}