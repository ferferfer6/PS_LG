

var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var arrayCategories = [["abscissa"],["total"]];
arrayCategories["abscissa"] = []
arrayCategories["totalPerCategory"] = ["total"]
arrayCategories["totalPerCategory"]["total"] = 0;
var date;
var dateFormated;
var categoryFormated;
var arrayTemp = [];
var totalData ;

function getData(url2, isData1,isData2,isData3) { 

        $.ajax({
            url: url2,
            dataType: 'JSON',
            success: function (data) {
                    console.log("Siguiente function");
                    //Procesamos la información, dependiendo de los flags se procesara de diferentes maneras
                    totalData = classify(data, isData1, isData2, isData3);
                    abscissa = totalData["abscissa"];
                    abscissa.sort(function(a,b) { 
                        return (new Date(a) - new Date(b)) 
                    });
                    jQuery.unique(abscissa);
                    seriesLineChart = [];

                    //Se crean las series para cada categofia
                    for (var i=1; i<totalData.length-1; i++){
                        serie = totalData["CAT "+i];
                        serie.sort(function(a,b) { 
                        return (a[0] - b[0]) 
                        });
                        seriesLineChart = seriesLineChart.concat({
                            name:"CAT "+i,
                            data: serie
                        })
                    }
                    createLinealChart(abscissa,seriesLineChart);

                    //Se crea la primera serie para el grafico de tarta. Este dato estara resaltado
                    seriesPieChart = []
                    total = totalData["totalPerCategory"]["total"];
                    value = totalData["totalPerCategory"]["CAT 1"];
                        value = value * 100/total;
                        seriesPieChart = seriesPieChart.concat({
                            name:"CAT 1",
                            y: value,
                            sliced: true,
                            selected: true
                        })
                    //Se crean el resto de datos    
                    for (var i=2; i<totalData.length-1; i++){
                        value = totalData["totalPerCategory"]["CAT "+i];
                        value = value * 100/total;
                        seriesPieChart = seriesPieChart.concat({
                            name:"CAT "+i,
                            y: value
                        })
                    }
                    createPieChart(seriesPieChart);

            }
        })

};



/**

 * Funcion que recibe los datos de las tres webs y procesa su información. 
 Se generan las categorias dinamicamente, de modo que puede haber mas 4 categorias sin problemas.

 * @method classify

 * @param data1 array Json de datos 

 * @param isData1 flag para saber si los datos son del tipo 1

 * @param isData2 flag para saber si los datos son del tipo 2

 * @param isData3 flag para saber si los datos son del tipo 3

 * @return arrayCategories. Array que contiene en la posicion 0 los valores que iran en el eje de abscisas. Desde la posicion 1 hasta N se rellenera cada una una de ellas con una estructura de la forma{date:fecha, value[posición,valor]}

 */
function classify(data1, isData1, isData2,isData3) { 

var moreData = true;
var moreData1 = isData1;
var moreData2 = isData2;
var moreData3 = isData3;
var cont = 0;

    while (moreData) {

        if(moreData1){
            dateFormated = formatDate(data1[cont].d);
            categoryFormated = data1[cont].cat.toUpperCase();
            data = {date:dateFormated, value:[parseFloat(dateFormated.substring(8,10))-1,data1[cont].value]};
            arrayTemp = arrayCategories[categoryFormated];
            putValue(arrayCategories,dateFormated,categoryFormated,data,arrayTemp);     
        }

        if(moreData2){
            dateFormated = data1[cont].myDate;
            categoryFormated = data1[cont].categ.toUpperCase();
            data = {date:dateFormated, value:[parseFloat(dateFormated.substring(8,10))-1,data1[cont].val]};
            arrayTemp = arrayCategories[categoryFormated];
            putValue(arrayCategories,dateFormated,categoryFormated,data,arrayTemp);            
        }

        if(moreData3){
            dateFormated = validDate(data1[cont].raw);
            categoryFormated = validCategory(data1[cont].raw);
            data = {date:dateFormated, value:[parseFloat(dateFormated.substring(8,10))-1,data1[cont].val]};
            arrayTemp = arrayCategories[categoryFormated];
            putValue(arrayCategories,dateFormated,categoryFormated,data,arrayTemp);            
        }

        cont++;
        if(cont>=data1.length)
            moreData= false;
    }

    return arrayCategories;
};

/**

 * Ordena un valor dentro del array categoria. En caso de no existir la categoria se crea. Si existe se comprueba si la fecha existe, Si existe se suman los valores, si no crea una nueva entrada para esa fecha.

 * @method putValue

 * @param arrayCategories. Array que contiene en la posicion 0 los valores que iran en el eje de abscisas. Desde la posicion 1 hasta N se rellenera cada una una de ellas con una estructura de la forma{date:fecha, value[posición,valor]}

 * @param dataFormated fecha en formato yyyy-mm-dd

* @param categoryFormated categoria en formato CAT N , donde N es un numero entero positivo

* @param data datos que se guardaran en cada array categoria. Es un registro con la forma {date: dateFormated, value:[dd,valor]}

* @param arrayTemp array con la informacion de una categoria concreta

 */
function putValue(arrayCategories,dateFormated,categoryFormated,data,arrayTemp){
    dateFormated2 = formatDateMonthDay(dateFormated);
    if(arrayTemp==undefined){
            arrayCategories.push([categoryFormated]);
            arrayTemp =[data.value];
            arrayTempAbscissa = arrayCategories["abscissa"];
            arrayTempAbscissa = arrayTempAbscissa.concat([dateFormated2]);
            arrayCategories["abscissa"] = arrayTempAbscissa;
            arrayCategories["totalPerCategory"].push([categoryFormated]);
            arrayCategories["totalPerCategory"][categoryFormated] = data.value[1];
            total = arrayCategories["totalPerCategory"]["total"];
            arrayCategories["totalPerCategory"]["total"] =  total + data.value[1];

        }else{

            var found = false;
            var contInternal = 0;
            var day = parseFloat(dateFormated.substring(8,10))-1;
            while(!found && contInternal<arrayTemp.length){
                var otherDay = arrayTemp[contInternal]
                if( otherDay[0]== day){
                    found = true;
                }else{
                    contInternal++;
                }
            }
            if(found){
                valueNumber = arrayTemp[contInternal];
                valueNumber = valueNumber[1];
                valueToAdd =  data.value[1];
                valueTotal = valueNumber +valueToAdd;
                arrayTemp[contInternal][1] = valueTotal;
            }else{
                arrayTempAbscissa = arrayCategories["abscissa"];
                arrayTempAbscissa = arrayTempAbscissa.concat([dateFormated2]);
                arrayCategories["abscissa"] = arrayTempAbscissa;
                arrayTemp =arrayTemp.concat([data.value]);
            }

            acumulatedPerCategory = arrayCategories["totalPerCategory"][categoryFormated];
            arrayCategories["totalPerCategory"][categoryFormated] = acumulatedPerCategory + data.value[1];
            total = arrayCategories["totalPerCategory"]["total"];
            arrayCategories["totalPerCategory"]["total"] =  total + data.value[1];
        }
        arrayCategories[categoryFormated] = arrayTemp;
}

/**

 * Genera una fecha con un formato determinado

 * @method formatDate

 * @param date valor en formato string 

 * @return fecha en formato yyyy-mm-dd

 */
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth()),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

/**

 * Genera una fecha con un formato determinado

 * @method formatDateMonthDay

 * @param date valor en formato string 

 * @return fecha en formato dia.Mes

 */
function formatDateMonthDay(date) {
    var d = new Date(date);
        month = d.getMonth();
        day = d.getDate();
        d = day+"."+ month_names_short[parseFloat(month)];
    return d;
}


/**

 * Busca dentro de una cadena de caracteres una cadena del tipo yyyy-mm-dd

 * @method validDate

 * @param cadena donde se quiere buscar

 * @return valor encontrado

 */
function validDate(dateString) {
  var regEx = /\d{4}-\d{2}-\d{2}/;
  return  regEx.exec(dateString)[0];
  
}


/**

 * Busca dentro de una cadena de caracteres una cadena del tipo CAT N , donde N es un numero entero positivo

 * @method validDate

 * @param cadena donde se quiere buscar

 * @return valor encontrado

 */
function validCategory(dateString) {
  var regEx = /CAT \d/;
  return regEx.exec(dateString)[0];
}




/**

* Metodo principal que se encarga de ejecutar las acciones necesarias para mostrar las graficas

* @method main

*/
function main(){
	   data1 = getData("https://s3.amazonaws.com/logtrust-static/test/test/data1.json",true,false,false);
       data2 = getData("https://s3.amazonaws.com/logtrust-static/test/test/data2.json",false,true,false);
       data3 = getData("https://s3.amazonaws.com/logtrust-static/test/test/data3.json",false,false,true);



        
};


