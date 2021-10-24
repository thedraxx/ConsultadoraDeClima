const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();
    console.log("Buscando clima...")

    //Validar 
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === "" || pais === "") {
        //hubo un error
        mostrarError("ambos campos son obligatorios");
        return;
    }
    // consultar por una API
    consultarAPI(ciudad,pais);
}

function mostrarError(mensaje) {

    const alerta = document.querySelector('.bg-red-100')
    if (!alerta) {
        //crear una alerta
        const alerta = document.createElement('div')
        alerta.classList.add('bg-red-100', 'border-red-400',
            'text-red-700', 'px-4', 'py-3', 'rounded', 'mx-w-md',
            'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class ='block'>${mensaje}</span>
    `
        container.appendChild(alerta);

        //Se elimine la alerta despues de 5 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarAPI(ciudad,pais) {
    const appId = '3f6bcf692414401a7164575d83ec6486';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    

    spinner(); //Muestra un Spinner de carga

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
            limpiarHTML(); // limpiar HTML previo

            if (datos.cod === "404") {
                mostrarError('ciudad No encontrada');
                return;
            }
            
            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos)
{
    const { name,main: { temp,temp_max,temp_min }  } = datos;

    //Convierte Kelvin a centigrados
    const centigrados = KelvinACentigrados(temp);
    const max = KelvinACentigrados(temp_max);
    const min = KelvinACentigrados(temp_min);

    //Sacamos la ciudad
    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en: ${name}`;
    nombreCiudad.classList.add("font-bold","text-2xl");

    const actual = document.createElement("p");
    actual.innerHTML = ` ${centigrados} &#8451;`
    actual.classList.add('font-bold',"text-6xl");

    const temperaturaMaxima = document.createElement("p");
    temperaturaMaxima.innerHTML = ` MIN: ${max} &#8451;`
    temperaturaMaxima.classList.add("text-xl");

    const temperaturaMinima = document.createElement("p");
    temperaturaMinima.innerHTML = ` Max: ${min} &#8451;`
    temperaturaMinima.classList.add("text-xl");

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add("text-center","text-white");
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(temperaturaMaxima);
    resultadoDiv.appendChild(temperaturaMinima);
    resultadoDiv.appendChild(nombreCiudad);

    resultado.appendChild(resultadoDiv);
}

const  KelvinACentigrados = grados => parseInt(grados-273.15); //Esto es una funcion

function limpiarHTML()
{
    while (resultado.firstChild) 
    {
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner()
{
    limpiarHTML();

    const divSpinner = document.createElement("div");
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `

    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>

    `;
    resultado.appendChild(divSpinner);
}
