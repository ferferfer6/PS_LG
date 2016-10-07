import sys

def readNumber():
    print "Este script determina si los numeros introducidos son perfectos, abundantes o defectivos" 
    var = raw_input("Introduza los valores a examanar separados por coma :")
    return var

def isCorrectNumber(input):
    try:
        x = int(input)
        evaluate(x)
    except ValueError:
        print "El valor",input,"no tiene el formato correcto"

def evaluate(input):
    number = int(input)
    lowerValue = 1
    topValue = number/2
    suma = 0
    while(lowerValue<topValue):
        if((number%lowerValue)==0):
            suma = suma + lowerValue
        if((number%topValue)==0):
            suma = suma + topValue
        if(suma>number):
            print number,"es abundante"
            break
        lowerValue = lowerValue+1
        topValue = topValue-1
        
    if(lowerValue==topValue):
        if((number%topValue)==0):
            suma = suma+topValue
    if(suma == number):
        print number,"es perfecto"
    else:
        if(suma<number):
            print number,"es defectivo"

    
if __name__ == "__main__":
    listOfNumbers = readNumber()
    arrayListOfNumbers = listOfNumbers.split(",")
    for x in range(0,len(arrayListOfNumbers)):
        isCorrectNumber(arrayListOfNumbers[x])
