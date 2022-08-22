const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    //Armar objeto producto y emitir mensaje a evento update
    const producto = {
        name: document.getElementById('nombre').value,
        price: document.getElementById('precio').value,
        thumbnail: document.getElementById('foto').value,
    };
    socket.emit('new-product', producto);
})


socket.on('productos', async productos => {
    //generar el html y colocarlo en el tag productos llamando al funcion makeHtmlTable
      document.getElementById('productos').innerHTML = await makeHtmlTable(productos);
});

 async function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    //Armar el objeto de mensaje y luego emitir mensaje al evento nuevoMensaje con sockets
    let d = new Date();
    let n = d.toLocaleTimeString();
    const mensaje = {
        email: document.getElementById('inputUsername').value,
        msg: document.getElementById('inputMensaje').value,
        time: n
    };
    socket.emit('new-msg', mensaje);
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('mensajes', mensajes => {
    console.log(mensajes);
    const html = makeHtmlList(mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

function makeHtmlList(mensajes) {
    //Armar nuestro html para mostrar los mensajes como lo hicimos en clase
    const html = mensajes.map((elem,index)=>{
        return (`<div><em>${elem.time}</em><strong>   ${elem.email}</strong>: <em>     ${elem.msg}</em> </div>`)
    }).join(" ");  
    return html
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
