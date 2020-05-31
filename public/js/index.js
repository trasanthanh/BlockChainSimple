var socket = io('/');
socket.on('storeSocketId', (socketId) =>{
    if($('.socketId')){
        $('.socketId').val(socketId);
    }
});
socket.on('registerSuccess', () =>{
    $('#register').hide();
    $('#success').show();
});
