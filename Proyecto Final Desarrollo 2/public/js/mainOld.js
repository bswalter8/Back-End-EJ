
const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    socket.emit('update', producto);
    formAgregarProducto.reset()
})

socket.on('productos', productos => {
    makeHtmlTable(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

// MENSAJES

/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */
// Definimos un esquema de autor

const authorSchema = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });


// Definimos un esquema de mensaje
const messageSchema = new normalizr.schema.Entity('text', {authorSchema}, { idAttribute: 'idText' } );



// Definimos un esquema de posts
const postSchema = new normalizr.schema.Entity(
    'posts', 
    { 
    mensajes: [messageSchema]
    },
    { idAttribute: 'idText' }
);
/* ----------------------------------------------------------------------------- */

const inputUsername = document.getElementById('username')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = {
        author: {
            email: inputUsername.value,
            nombre: document.getElementById('firstname').value,
            apellido: document.getElementById('lastname').value,
            edad: document.getElementById('age').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: inputMensaje.value
    }

    socket.emit('new-msg', mensaje);
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('mensajes', mensajesN => {
   // if(mensajesN.length !== 0){
        const mensajesD = normalizr.denormalize(
                mensajesN.result, 
                [postSchema], 
                mensajesN.entities
                ); 

        console.log(mensajesD)        
     /*   const porcentajeC = Math.floor(-(JSON.stringify(newMessages).length * 100 / JSON.stringify(messageArray).length) + 100);
        document.querySelector('#MsgPorciento').innerHTML = `La compresion por Normalizar es: ${Compresion}%`;
        newMessages.forEach(message =>{
            document.querySelector('#messageContainer').innerHTML = '';
            renderTemplateMessages(message);
        })
    }else {
        document.querySelector('#messageContainer').innerHTML = 'No hay mensajes';
    }*/

    console.log(`Porcentaje de compresión ${porcentajeC}%`)
    document.getElementById('compresion-info').innerText = porcentajeC

    console.log(mensajesD.mensajes);
    const html = makeHtmlList(mensajesD)
    document.getElementById('mensajes').innerHTML = html;
})

function makeHtmlList(mensajes) {
    return mensajes.map(mensaje => {
        return (`
        <div>
            <b style="color:blue;">${mensaje.author.email}</b>
            [<span style="color:brown;">${mensaje.fyh}</span>] :
            <i style="color:green;">${mensaje.text}</i>
            <img width="50" src="${mensaje.author.avatar}" alt=" ">
        </div>
    `)
    }).join(" ");
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
