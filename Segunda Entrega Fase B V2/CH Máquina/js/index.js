let archivoACargar = document.getElementById("archivoACargar");
let kernel = document.getElementById("kernel");
let contenidoMemoria = document.getElementById("contenidoMemoria");
let operationSection = document.getElementById("operationSection");
let contadorControladorGeneral = 0;

//Variables
let variablesSection = document.getElementById("variablesSection");
let directionVariables = document.getElementById("directionVariables");
let contentVariables = document.getElementById("contentVariables");

//Etiquetas
let directionLabels = document.getElementById("directionLabels");
let contentLabels = document.getElementById("contentLabels");

//Posiciones y epecificaciones del programa
let aiDi = document.getElementById("ID");
let Programa = document.getElementById("Programa");
let Ins = document.getElementById("Ins");
let RB = document.getElementById("RB");
let RLC = document.getElementById("RLC");
let RLP = document.getElementById("RLP");

let playProgram = document.getElementById("playProgram");
let stepByStep = document.getElementById("stepByStep");
let mostrarContMemoria = document.getElementById("mostrarContenidoMemoria");
let tamMemoria = document.getElementById("memoria");
let screenContent = document.getElementById("screenContent");
let imprimir = document.getElementById("imprimir");
let overlay = document.getElementById("overlay");
let cerrarVentImprimir = document.getElementById("cerrarVentImprimir");
let printSection = document.getElementById("printSection");
let sectionAcumulador = document.getElementById("acumulador");

//Crear la memoria  con la que mostraremos Contenido y Dirección 
var memoriaDirection = [];
var memoriaContenido = [];

//Lista que guardara las direcciones de la memoria
var memoriaDirectionMostrar = [];

//Creamos la lista de ID´s
var listId = [];
var numId = 0;

//Creamos la lista de los programas
var listFiles = [];

//Creamos la lista para poner el numero de instrucciones de cada programa
var listInstructions = [];

//Creamos la lista para ver en que posición inicia cada programa
var contPositions = 0;
var listBegining = [];

//Creamos la lista para ver en que posición termina cada programa
var listEnding = [];

//Creamos la lista para ver en que posición termina cada programa con sus variables
var listEndingVar = [];

//Creamos la lista que ejecutará cada instrucción
var listaArchivoGeneral = [];

//Listas para almacenar los nombres y valores de las variables generales
var valoresVariablesGeneral = [];
var nombreVariablesGeneral = [];

//Etiquetas generales
var direccionEtiquetaGeneral = [];
var nombreEtiquetaGeneral = [];

//Creamos las listas generales para la memoria de las variables
var listDirectionVariables = [];
var nombreVariablesAMostrar = [];

//Creamos la listas generales para las etiquetas 
var listDirectionEtiquetas = [];
var nombreEtiquetaAMostrar = [];

//Lista a comprobar General
var listaAComprobarGeneral = [];


//Acumulador
var acumulador = 0;

/*Funciones*/

//Funcion para encender el Sistema Operativo haciendo la comprobación de la memoria
function encender() {
  if ((Number(tamMemoria.value) > 9999)) {
    alert("Error, el espacio de memoria no puede exceder las 9999 posiciones");
    apagar();
  }
  tamMemoria.disabled = true;
  kernel.disabled = true;
  archivoACargar.disabled = false;
  mostrarContMemoria.disabled = false;
  imprimir.disabled = false;
  playProgram.disabled = false;
  stepByStep.disabled = false;
  operationSection.style.visibility = "visible";
  variablesSection.style.visibility = "visible";
  screenContent.style.background = "white";

  //Reservar la primera posición para el acumulador
  memoriaDirection.push("0000");
  memoriaContenido.push("Acumulador");
  //Verificamos que el kernel quepa

  if ((Number(tamMemoria.value)) < (Number(kernel.value) + 1)) {
    alert("Espacio de memoria excedido, insuficiente espacio para el kernel");
    apagar();
  }

  //Ocupar los campos de la memoria para el kernel
  for (let espacio = 1; espacio < Number(kernel.value) + 1; espacio++) {
    memoriaDirection.push(zeroFill(espacio, 4));
    memoriaContenido.push("***CHSOS V2021**");
  }
  //llenamos los array de posiciones vacias
  var memoriaDirection1 = [];
  var memoriaContenido1 = [];
  for (var i = 0; i < memoriaDirection.length; i++) {
    memoriaDirection1.push(memoriaDirection[i]);
    memoriaContenido1.push(memoriaContenido[i]);
  }
  for (let campos = memoriaContenido.length; campos <= (Number(tamMemoria.value) - 1); campos++) {
    memoriaDirection1.push(zeroFill((memoriaDirection1.length), 4));
    memoriaContenido1.push("-");
  }
  //Mostramos las posiciones de memoria con el kernel
  document.getElementById("directionSection").innerHTML = memoriaDirection1.join("<br>")
  document.getElementById("contentSection").innerHTML = memoriaContenido1.join("<br>");
}

function apagar() {
  tamMemoria.disabled = false;
  kernel.disabled = false;
  archivoACargar.disabled = true;
  contenidoMemoria.style.visibility = "hidden";
  operationSection.style.visibility = "hidden";
  variablesSection.style.visibility = "hidden";
  location.reload();
}

function mostrarContenidoMemoria() {
  contenidoMemoria.style.visibility = "visible";
}

function ocultarContenidoMemoria() {
  contenidoMemoria.style.visibility = "hidden";
}

archivoACargar.addEventListener("change", leerArchivo);

function leerArchivo(evento) {
  for (let inst = 0; inst < evento.target.files.length; inst++) {
    let archivo = evento.target.files[inst];

    //Procesamos el archivo cargado
    procesarArchivo(archivo, function (result) {
      let listaArchivo = [];
      listaArchivo = result.split("\n");  //Cargamos el elemento a un Array y lo dividimos por linea

      //Eliminamos espacios en blanco del final
      for (let elemento = 0; elemento < listaArchivo.length; elemento++) {

        if (listaArchivo[elemento] == "" || listaArchivo[elemento].length == 1) {
          listaArchivo.splice(elemento, 1);
          elemento--;
        }

        if (listaArchivo[elemento].includes("//")) {
          listaArchivo.splice(elemento, 1);
          elemento--;
        }

        if (listaArchivo[elemento] != undefined) {
          listaArchivo[elemento] = listaArchivo[elemento].trim();
        }

      }

      //Cargamos listaArchivo a listaArchivoGeneral para acumular las instrucciones de varios programas
      cantidadLineas = listaArchivoGeneral.length;
      for (let elemento = 0; elemento < listaArchivo.length; elemento++) {

        listaArchivoGeneral.push(listaArchivo[elemento]);

      }

      //verificar Sintaxis
      let listaAComprobar = [];
      for (let linea = cantidadLineas; linea < listaArchivoGeneral.length; linea++) {
        listaArchivoGeneral[linea] = listaArchivoGeneral[linea].trim();
        listaAComprobar.push(listaArchivoGeneral[linea].split(" "));
      }

      for (let i = 0; i < listaAComprobar.length; i++) {
        for (let j = 0; j < listaAComprobar[i].length; j++) {
          if (listaAComprobar[i][j] == "") {
            listaAComprobar[i].splice(j, 1)
            j--;
          } else {
            listaAComprobar[i][j] = (listaAComprobar[i][j]).trim();
          }
        }
      }

      //Canridad de Memoria antes de cargar un nuevo archivo
      cantidadLineasContMemoria = memoriaContenido.length;

      let [errores, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, acumulador] = verificarSintaxis(listaAComprobar);

      //Agregamos variables y atiquetas a listas generales
      for (let i = 0; i < nombreVariables.length; i++) {

        nombreVariablesGeneral.push(nombreVariables[i]);
        valoresVariablesGeneral.push(valoresVariables[i]);

      }

      for (let j = 0; j < nombreEtiqueta.length; j++) {

        nombreEtiquetaGeneral.push(nombreEtiqueta[j]);
        direccionEtiquetaGeneral.push(direccionEtiqueta[j]);

      }

      if (errores.length === 0) {

        //Ocupar los campos de la memoria para las instrucciones
        let posicionLisDir = memoriaDirection.length;
        for (let instruccion = 0; instruccion < listaArchivo.length; instruccion++) {
          memoriaDirection.push(zeroFill((Number(posicionLisDir) + instruccion), 4));
          memoriaContenido.push(listaArchivo[instruccion]);
        }

        //Contador antes de añadir variables
        contAntVarContMemo = memoriaContenido.length;

        //Añadimos las variables a la memoria
        let posicionLisDir2 = memoriaDirection.length;
        for (let variable = 0; variable < valoresVariables.length; variable++) {
          memoriaDirection.push(zeroFill((Number(posicionLisDir2) + variable), 4));
          memoriaContenido.push(valoresVariables[variable]);
        }

        var memoriaDirection2 = [];
        var memoriaContenido2 = [];

        for (var i = 0; i < memoriaDirection.length; i++) {
          memoriaDirection2.push(memoriaDirection[i]);
          memoriaContenido2.push(memoriaContenido[i]);
        }

        for (let campos = memoriaContenido.length; campos <= (Number(tamMemoria.value) - 1); campos++) {
          memoriaDirection2.push(zeroFill((memoriaDirection2.length), 4));
          memoriaContenido2.push("-");
        }

        var posInicial;

        for (let variable = cantidadLineasContMemoria; variable < memoriaContenido.length; variable++) {

          if (listaArchivo[0] == memoriaContenido[variable]) {
            posInicial = variable;
          }

        }

        for (let c = posInicial; c < (memoriaContenido.length - nombreVariables.length); c++) {
          memoriaDirectionMostrar.push(memoriaDirection[c]);
        }

        //Verificar que no se exceda el tamaño de la memoria
        if (((Number(listaArchivoGeneral.length) + Number(kernel.value)) > (Number(tamMemoria.value) - 1)) || (memoriaDirection.length >= Number(tamMemoria.value))) {
          alert("Espacio de memoria excedido, insufieciente espacio para las instrucciones");
        }

        //Imprimimos el contenido de la memoria
        document.getElementById("positionOnMemory").innerHTML = memoriaDirectionMostrar.join("<br>")
        document.getElementById('operations').innerHTML = listaArchivoGeneral.join('<br>');
        document.getElementById("directionSection").innerHTML = memoriaDirection2.join("<br>")
        document.getElementById("contentSection").innerHTML = memoriaContenido2.join("<br>");

        //Imprimir Variables y Etiquetas

        for (let variableList = 0; variableList < listaAComprobar.length; variableList++) {
          for (let variableEtiquetas = 0; variableEtiquetas < nombreEtiqueta.length; variableEtiquetas++) {

            if (listaAComprobar[variableList][0] == "etiqueta" && listaAComprobar[variableList][1] == (nombreEtiqueta[variableEtiquetas])) {
              listDirectionEtiquetas.push(memoriaDirectionMostrar[Number(listaAComprobar[variableList][2]) - 1]);
            }

          }
        }

        for (let variableList = contAntVarContMemo; variableList < memoriaContenido.length; variableList++) {
          for (let variableVariables = 0; variableVariables < valoresVariablesGeneral.length; variableVariables++) {

            if (memoriaContenido[variableList] == valoresVariablesGeneral[variableVariables]) {
              listDirectionVariables.push(memoriaDirection2[variableList]);
              break;
            }

          }
        }

        variableCeros = "0000";

        for (let variable = 0; variable < nombreVariablesGeneral.length; variable++) {
          nombreVariablesAMostrar[variable] = `${variableCeros}${nombreVariablesGeneral[variable]}`;
        }

        for (let variable = 0; variable < nombreEtiquetaGeneral.length; variable++) {
          nombreEtiquetaAMostrar[variable] = `${variableCeros}${nombreEtiquetaGeneral[variable]}`;
        }

        //Mostrar etiquetas
        directionLabels.innerHTML = listDirectionEtiquetas.join("<br>");
        contentLabels.innerHTML = nombreEtiquetaAMostrar.join("<br>");

        //Mostrar variables
        directionVariables.innerHTML = listDirectionVariables.join("<br>");
        contentVariables.innerHTML = nombreVariablesAMostrar.join("<br>");

        //Mostrar especificaciones
        //ID
        let contId = "000";
        listId.push(`${contId}${numId}`);
        numId++;

        //Programa
        listFiles.push(archivo.name);

        //#Inst
        listInstructions.push(listaArchivo.length);

        //RB y RLC
        finalPosition = listaArchivo.length - 1;

        for (let posicion = contPositions; posicion < memoriaContenido2.length; posicion++) {

          if (listaArchivo[0] == memoriaContenido2[posicion]) {
            listBegining.push(posicion);
          }
          if (listaArchivo[finalPosition] == memoriaContenido2[posicion]) {
            listEnding.push(posicion);
            listEndingVar.push(posicion + valoresVariables.length);
          }

        }
        contPositions = memoriaContenido.length;
        aiDi.innerHTML = listId.join("<br>");
        Programa.innerHTML = listFiles.join("<br>");
        Ins.innerHTML = listInstructions.join("<br>");
        RB.innerHTML = listBegining.join("<br>");
        RLC.innerHTML = listEnding.join("<br>");
        RLP.innerHTML = listEndingVar.join("<br>");

        for (let linea = 0; linea < listaAComprobar.length; linea++) {

          listaAComprobarGeneral.push(listaAComprobar[linea]);

        }

      } else {

        for (let err = 0; err < errores.length; err++) {
          alert(errores[err]);
        }

      }

    }
    )
  }
}

function procesarArchivo(ch, callback) {
  var reader = new FileReader();
  reader.readAsText(ch);
  reader.onload = function () {
    callback(reader.result);
  }
}

function verificarSintaxis(lista) {

  //Errores
  let errores = [];

  //Listas para almacenar los nombres y valores de las variables
  let valoresVariables = [];
  let nombreVariables = [];

  //Etiquetas
  let direccionEtiqueta = [];
  let nombreEtiqueta = [];

  for (let instruccion = 0; instruccion < lista.length; instruccion++) {

    let linea = "";

    for (let index = 0; index < lista[instruccion].length; index++) {
      linea += " " + lista[instruccion][index];
    }

    if (lista[instruccion][0].trim().toLowerCase() == 'nueva') {

      if (lista[instruccion].length < 3) {
        errores.push("Error de sintaxis, menos de 3 operadores especificados: " + linea);
      }

      switch (lista[instruccion][2].toUpperCase()) {

        case "C":
          let cadena = "";
          if (lista[instruccion].length > 4) {

            for (let variable = 3; variable < lista[instruccion].length; variable++) {
              cadena += (lista[instruccion][variable]);
            }

            valoresVariables.push(cadena);
          } else if (lista[instruccion].length == 3) {
            valoresVariables.push("");
          }
          break;

        case "I":
          if (lista[instruccion].length > 4) {
            errores.push("Error de sintaxis, más de 4 operadores especificados: " + linea);
            break;
          } else if (lista[instruccion].length == 4) {
            let num = lista[instruccion][3];
            let verificList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
            for (let i = 0; i < lista[instruccion].length; i++) {
              if (!(verificList.includes(Number(num)))) {
                errores.push("Error de sintaxis, el tipo de dato no es un entero: " + linea);
                break;
              }
            }
          } else {
            valoresVariables.push("0");
          }
          break;

        case "R":
          if (lista[instruccion].length > 4) {
            errores.push("Error de sintaxis, más de 4 operadores especificados: " + linea);
            break;
          } else if (lista[instruccion].length > 3) {
            let num = lista[instruccion][3];
            let verificList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."]
            for (let i = 0; i < lista[instruccion].length; i++) {
              if (!((verificList.includes(num)))) {
                errores.push("Error de sintaxis, el tipo de dato no es un Real/Decimal: " + linea);
                break;
              }
            }
          } else {
            valoresVariables.push("0");
          }
          break;

        case "L":
          if (lista[instruccion].length > 4) {
            errores.push("Error de sintaxis, más de 4 operadores especificados: " + linea);
            break;
          } else if (lista[instruccion].length > 3) {
            if (!(lista[instruccion][3] == ("0")) && !(lista[instruccion][3] == ("1"))) {
              errores.push("Error de sintaxis, el tipo de dato no es un Boolean: " + linea);
              break;
            }

          } else {
            valoresVariables.push("0");
          }
          break;

        default:
          errores.push("Error de sintaxis, no se reconoce el tipo de variable: " + linea);
          break;
      }

      nombreVariables.push(lista[instruccion][1]);
      if (lista[instruccion].length == 4) {
        valoresVariables.push(lista[instruccion][3]);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'lea') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }

      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada :" + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'cargue') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada: " + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'almacene') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada :" + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'vaya') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'vayasi') {

      if (lista[instruccion].length > 3) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 3) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'etiqueta') {

      if (lista[instruccion].length > 3) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 3) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }

      let num = lista[instruccion][2];
      let verificList = "1234567890";
      for (let i = 0; i < num.length; i++) {
        if (!(verificList.includes(num[i]))) {
          errores.push("Error de sintaxis, el tipo de dato no es un número: " + linea);
        }
      }
      direccionEtiqueta.push(lista[instruccion][2]);
      nombreEtiqueta.push(lista[instruccion][1]);

    } else if (lista[instruccion][0].trim().toLowerCase() == 'sume') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada  :" + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'reste') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada :" + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'multiplique') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada :" + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'divida') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada  :" + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'potencia') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada :" + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'modulo') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada :" + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'concatene') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada :" + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'elimine') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada: " + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'Y') {

      if (lista[instruccion].length > 4) {
        errores.push("Error de sintaxis, más de 4 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 4) {
        errores.push("Error de sintaxis, menos de 4 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada: " + linea);
      } else {
        if (!(nombreVariables.includes(lista[instruccion][2]))) {
          errores.push("La variable " + lista[instruccion][2] + " no ha sido creada: " + linea);
        } else {
          if (!(nombreVariables.includes(lista[instruccion][3]))) {
            errores.push("La variable " + lista[instruccion][3] + " no ha sido creada: " + linea);
          }
        }
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'O') {

      if (lista[instruccion].length > 4) {
        errores.push("Error de sintaxis, más de 4 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 4) {
        errores.push("Error de sintaxis, menos de 4 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada:" + linea);
      } else {
        if (!(nombreVariables.includes(lista[instruccion][2]))) {
          errores.push("La variable " + lista[instruccion][2] + " no ha sido creada: " + linea);
        } else {
          if (!(nombreVariables.includes(lista[instruccion][3]))) {
            errores.push("La variable " + lista[instruccion][3] + " no ha sido creada: " + linea);
          }
        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'NO') {

      if (lista[instruccion].length > 3) {
        errores.push("Error de sintaxis, más de 3 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 3) {
        errores.push("Error de sintaxis, menos de 4 operadores especificados: " + linea);
      }
      if (!(lista[instruccion].includes(lista[instruccion][1]))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada: " + linea);
      } else {
        if (!(lista[instruccion].includes(lista[instruccion][2]))) {
          errores.push("La variable " + lista[instruccion][2] + " no ha sido creada: " + linea);
        }
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'muestre') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1])) && !(lista[instruccion][1] == ("acumulador"))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada: " + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'imprima') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 2) {
        errores.push("Error de sintaxis, menos de 2 operadores especificados: " + linea);
      }
      if (!(nombreVariables.includes(lista[instruccion][1])) && !(lista[instruccion][1] == ("acumulador"))) {
        errores.push("La variable " + lista[instruccion][1] + " no ha sido creada: " + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'retorne') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 1) {
        errores.push("Error de sintaxis, menos de 1 operadores especificados: " + linea);
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'extraiga') {

      if (lista[instruccion].length > 2) {
        errores.push("Error de sintaxis, más de 2 operadores especificados: " + linea);
      }
      if (lista[instruccion].length < 1) {
        errores.push("Error de sintaxis, menos de 1 operadores especificados: " + linea);
      }

    } else {
      errores.push("No se reconoce la intrucción: " + linea);
    }
  }

  return [errores, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, acumulador];

}
var c = 0;
function ejecutarPrograma(lista, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, inicio, fin,) {

  for (let instruccion = inicio; instruccion < fin; instruccion++) {
    console.log(acumulador + "acum");
    if (lista[instruccion][0].trim().toLowerCase() == 'cargue') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {
          acumulador = valoresVariables[variable];
        }

      }
      sectionAcumulador.value = acumulador;

    } else if (lista[instruccion][0].trim().toLowerCase() == 'almacene') {
      
      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {
          valoresVariables[variable] = acumulador;
        }

      }
      
    } else if (lista[instruccion][0].trim().toLowerCase() == 'reste') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {
          acumulador = acumulador - Number(valoresVariables[variable]);
        } else if (lista[instruccion][1] == 'acumulador') {
          acumulador = 0;
        }

      }
      sectionAcumulador.value = acumulador;

    } else if (lista[instruccion][0].trim().toLowerCase() == 'multiplique') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {
          acumulador = acumulador * Number(valoresVariables[variable]);
          console.log(acumulador, valoresVariables, nombreVariables + "f");
        }

      }
      sectionAcumulador.value = acumulador;

    } else if (lista[instruccion][0].trim().toLowerCase() == 'vaya') {

      for (let variable = 0; variable < nombreEtiqueta.length; variable++) {

        if (lista[instruccion][1] == nombreEtiqueta[variable] && direccionEtiqueta[variable] < lista.length) {

          if (direccionEtiqueta[variable] <= instruccion) {
            ejecutarPrograma(lista, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, direccionEtiqueta[variable] - 1, instruccion - 1, acumulador);
          } else {
            ejecutarPrograma(lista, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, direccionEtiqueta[variable] - 1, lista.length, acumulador);
          }


        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'vayasi') {

      if (acumulador > 0) {

        for (let variable = 0; variable < nombreEtiqueta.length; variable++) {

          if (lista[instruccion][1] == nombreEtiqueta[variable] && direccionEtiqueta[variable] < lista.length - 1 && c<20) {
            instruccion = direccionEtiqueta[variable] - 1;
            c+=1;
            console.log(acumulador);
          }

        }

      } else if (acumulador < 0) {

        for (let variable = 0; variable < nombreEtiqueta.length; variable++) {

          if (lista[instruccion][2] == nombreEtiqueta[variable] && direccionEtiqueta[variable] < lista.length) {
            instruccion = direccionEtiqueta[variable] - 1;
          }

        }
      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'muestre') {

      if (lista[instruccion][1] == "acumulador") {
        screenContent.innerHTML = "El valor del acumulador es " + lista[0];
      } else {

        for (let variable = 0; variable < nombreVariables.length; variable++) {

          if (lista[instruccion][1] == nombreVariables[variable]) {
            screenContent.innerHTML = `El valor de ${lista[instruccion][1]} es ${valoresVariables[variable]}`;
          }

        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'lea') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {
          let nuevoValor = prompt(`Ingrese el valor de la variable ${lista[instruccion][1]}`);
          valoresVariables[variable] = nuevoValor;
        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'sume') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {
          acumulador = acumulador + Number(valoresVariables[variable]);
        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'divida') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {
          acumulador = acumulador / Number(valoresVariables[variable]);
        }

      }
      sectionAcumulador.value = acumulador;

    } else if (lista[instruccion][0].trim().toLowerCase() == 'potencia') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable] && valoresVariables[variable].isInteger()) {
          acumulador = acumulador ** Number(valoresVariables[variable]);
        }

      }
      sectionAcumulador.value = acumulador;

    } else if (lista[instruccion][0].trim().toLowerCase() == 'modulo') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {

          let modulo = acumulador % valoresVariables[variable];
          alert(`El modulo de ${acumulador} % ${v.valor} es igual a: ${modulo}`);

        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'concatene') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {

          let cadena = acumulador + " " + valoresVariables[variable];
          sectionAcumulador.type = 'text';
          acumulador = cadena;
          sectionAcumulador.value = acumulador;

        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'elimine') {

      let eliminar = lista[instruccion][1];
      acumulador = acumulador.replaceAll(eliminar, "");
      sectionAcumulador.value = acumulador;

    } else if (lista[instruccion][0].trim().toLowerCase() == 'extraiga') {

      let extraer = [];
      for (let variable = 0; variable < Number(lista[instruccion][1]); variable++) {
        extraer.push(acumulador[variable]);
      }
      acumulador = extraer.join("");
      sectionAcumulador.value = acumulador;

    } else if (lista[instruccion][0].trim().toLowerCase() == 'Y') {

      let primerOperando = 0;
      let segundoOperando = 0;

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {
          primerOperando = valoresVariables[variable];
        }
        if (lista[instruccion][2] == nombreVariables[variable]) {
          primerOperando = valoresVariables[variable];
        }
        if (lista[instruccion][3] == nombreVariables[variable]) {

          if (primerOperando && segundoOperando == 1) {
            valoresVariables[variable] = 1;
          } else if (primerOperando && segundoOperando == 0) {
            valoresVariables[variable] = 0;
          }

        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'O') {

      let primerOperando = 0;
      let segundoOperando = 0;

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[instruccion][1] == nombreVariables[variable]) {
          primerOperando = valoresVariables[variable];
        }
        if (lista[instruccion][2] == nombreVariables[variable]) {
          primerOperando = valoresVariables[variable];
        }
        if (lista[instruccion][3] == nombreVariables[variable]) {

          if (primerOperando || segundoOperando == 1) {
            valoresVariables[variable] = 1;
          } else if (primerOperando || segundoOperando == 0) {
            valoresVariables[variable] = 0;
          }

        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'NO') {

    } else if (lista[instruccion][0].trim().toLowerCase() == 'muestre') {

      if (lista[instruccion][1] == "acumulador") {
        screenContent.innerHTML = `El valor de ${lista[instruccion][2]} es igual a: ${acumulador}`;
      } else {

        for (let variable = 0; variable < nombreVariables.length; variable++) {

          if (lista[instruccion][1] == nombreVariables[variable]) {
            screenContent.innerHTML = `El valor de ${lista[instruccion][2]} es igual a: ${v.valor}`;
          }

        }

      }

    } else if (lista[instruccion][0].trim().toLowerCase() == 'imprima') {

      if (lista[instruccion][1] == "acumulador") {
        screenContent.innerHTML = `El valor de ${lista[instruccion][1]} es igual a: ${acumulador}`;
      } else {

        for (let variable = 0; variable < nombreVariables.length; variable++) {

          if (lista[instruccion][1] == nombreVariables[variable]) {
            screenContent.innerHTML = `El valor de ${lista[instruccion][1]} es igual a: ${valoresVariables[variable]}`;
          }

        }

      }
    }
    // confirm("continuar?");
  }
}

function ejecutarProgramaPasoAPaso(lista, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, contadorControlador, fin) {
 
  if (contadorControlador < fin) {

    if (lista[contadorControlador][0].trim().toLowerCase() == 'nueva') {

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);
      
    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'cargue') {
      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {
          acumulador = valoresVariables[variable];
        }

      }
      sectionAcumulador.value = acumulador;

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'almacene') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {
          valoresVariables[variable] = acumulador;
        }

      }
      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'reste') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {
          acumulador = acumulador - Number(valoresVariables[variable]);
        } else if (lista[contadorControlador][1] == 'acumulador') {
          acumulador = 0;
        }

      }
      sectionAcumulador.value = acumulador;

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'multiplique') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {
          acumulador = acumulador * Number(valoresVariables[variable]);
        }

      }
      sectionAcumulador.value = acumulador;

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'vaya') {

      for (let variable = 0; variable < nombreEtiqueta.length; variable++) {

        if (lista[contadorControlador][1] == nombreEtiqueta[variable] && direccionEtiqueta[variable] < lista.length) {

          if (direccionEtiqueta[variable] <= contadorControlador) {
            ejecutarProgramaPasoAPaso(lista, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, direccionEtiqueta[variable] - 1, contadorControlador - 1);
          } else {
            ejecutarProgramaPasoAPaso(lista, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, direccionEtiqueta[variable] - 1, lista.length - 1);
          }

        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'vayasi') {

      if (acumulador > 0) {
        
        for (let variable = 0; variable < nombreEtiqueta.length; variable++) {

          if (lista[contadorControlador][1] == nombreEtiqueta[variable] && direccionEtiqueta[variable] < lista.length) {
            // console.log(direccionEtiqueta[variable]);
            contadorControladorGeneral = direccionEtiqueta[variable] -1;

          }

        }

      } else if (acumulador < 0) {

        for (let variable = 0; variable < nombreEtiqueta.length; variable++) {

          if (lista[contadorControlador][2] == nombreEtiqueta[variable] && direccionEtiqueta[variable] < lista.length) {

            if (direccionEtiqueta[variable] <= contadorControlador) {
              ejecutarProgramaPasoAPaso(lista, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, direccionEtiqueta[variable] - 1, contadorControlador - 1);
            } else {
              ejecutarProgramaPasoAPaso(lista, nombreVariables, valoresVariables, nombreEtiqueta, direccionEtiqueta, direccionEtiqueta[variable] - 1, lista.length - 1);
            }

          }

        }
      }
      
      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'muestre') {

      if (lista[contadorControlador][1] == "acumulador") {
        screenContent.innerHTML = "El valor del acumulador es " + lista[0];
      } else {

        for (let variable = 0; variable < nombreVariables.length; variable++) {

          if (lista[contadorControlador][1] == nombreVariables[variable]) {
            screenContent.innerHTML = `El valor de ${lista[contadorControlador][1]} es ${valoresVariables[variable]}`;
          }

        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'lea') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {
          let nuevoValor = prompt(`Ingrese el valor de la variable ${lista[contadorControlador][1]}`);
          valoresVariables[variable] = nuevoValor;
        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'sume') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {
          acumulador = acumulador + Number(valoresVariables[variable]);
        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'divida') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {
          acumulador = acumulador / Number(valoresVariables[variable]);
        }

      }
      sectionAcumulador.value = acumulador;

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'potencia') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable] && valoresVariables[variable].isInteger()) {
          acumulador = acumulador ** Number(valoresVariables[variable]);
        }

      }
      sectionAcumulador.value = acumulador;

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'modulo') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {

          let modulo = acumulador % valoresVariables[variable];
          alert(`El modulo de ${acumulador} % ${v.valor} es igual a: ${modulo}`);

        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'concatene') {

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {

          let cadena = acumulador + " " + valoresVariables[variable];
          sectionAcumulador.type = 'text';
          acumulador = cadena;
          sectionAcumulador.value = acumulador;

        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'elimine') {

      let eliminar = lista[contadorControlador][1];
      acumulador = acumulador.replaceAll(eliminar, "");
      sectionAcumulador.value = acumulador;

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'extraiga') {

      let extraer = [];
      for (let variable = 0; variable < Number(lista[contadorControlador][1]); variable++) {
        extraer.push(acumulador[variable]);
      }
      acumulador = extraer.join("");
      sectionAcumulador.value = acumulador;

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'Y') {

      let primerOperando = 0;
      let segundoOperando = 0;

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {
          primerOperando = valoresVariables[variable];
        }
        if (lista[contadorControlador][2] == nombreVariables[variable]) {
          primerOperando = valoresVariables[variable];
        }
        if (lista[contadorControlador][3] == nombreVariables[variable]) {

          if (primerOperando && segundoOperando == 1) {
            valoresVariables[variable] = 1;
          } else if (primerOperando && segundoOperando == 0) {
            valoresVariables[variable] = 0;
          }

        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'O') {

      let primerOperando = 0;
      let segundoOperando = 0;

      for (let variable = 0; variable < nombreVariables.length; variable++) {

        if (lista[contadorControlador][1] == nombreVariables[variable]) {
          primerOperando = valoresVariables[variable];
        }
        if (lista[contadorControlador][2] == nombreVariables[variable]) {
          primerOperando = valoresVariables[variable];
        }
        if (lista[contadorControlador][3] == nombreVariables[variable]) {

          if (primerOperando || segundoOperando == 1) {
            valoresVariables[variable] = 1;
          } else if (primerOperando || segundoOperando == 0) {
            valoresVariables[variable] = 0;
          }

        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'NO') {

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'muestre') {

      if (lista[contadorControlador][1] == "acumulador") {
        screenContent.innerHTML = `El valor de ${lista[contadorControlador][2]} es igual a: ${acumulador}`;
      } else {

        for (let variable = 0; variable < nombreVariables.length; variable++) {

          if (lista[contadorControlador][1] == nombreVariables[variable]) {
            screenContent.innerHTML = `El valor de ${lista[contadorControlador][2]} es igual a: ${v.valor}`;
          }

        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    } else if (lista[contadorControlador][0].trim().toLowerCase() == 'imprima') {

      if (lista[contadorControlador][1] == "acumulador") {
        screenContent.innerHTML = `El valor de ${lista[contadorControlador][1]} es igual a: ${acumulador}`;
      } else {

        for (let variable = 0; variable < nombreVariables.length; variable++) {

          if (lista[contadorControlador][1] == nombreVariables[variable]) {
            screenContent.innerHTML = `El valor de ${lista[contadorControlador][1]} es igual a: ${valoresVariables[variable]}`;
          }

        }

      }

      //Mostrar Mensaje
      let unSpace = lista[contadorControlador].toString().replaceAll(",", " ");
      confirm(`La instruccion es ${unSpace}`);

    }
    // console.log(contadorControladorGeneral);
    contadorControladorGeneral += 1;

  }
}

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // siempre devuelve tipo cadena
}

function mostrarImpresora() {
  overlay.style.display = "block";
  cerrarVentImprimir.style.display = "block";
  cerrarVentImprimir.disabled = false;
  printSection.style.opacity = "1";
  printSection.style.transform = "translateY(0)";
}

function cerrarVentanaImprimir() {
  overlay.style.display = "none";
  cerrarVentImprimir.style.display = "none";
  cerrarVentImprimir.disabled = true;
  printSection.style.opacity = "0";
  printSection.style.transform = "translateY(-100rem) ";
}

function correrPrograma() {
  // Ejecutar las funciones del archivo
  ejecutarPrograma(listaAComprobarGeneral, nombreVariablesGeneral, valoresVariablesGeneral, nombreEtiquetaGeneral, direccionEtiquetaGeneral, 0, listaAComprobarGeneral.length);
}

function correrProgramaPasoAPaso() {
  ejecutarProgramaPasoAPaso(listaAComprobarGeneral, nombreVariablesGeneral, valoresVariablesGeneral, nombreEtiquetaGeneral, direccionEtiquetaGeneral, contadorControladorGeneral, listaAComprobarGeneral.length)
}
