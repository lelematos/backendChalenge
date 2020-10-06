import { RESTDataSource } from "apollo-datasource-rest";
import { response } from "express";
import { Mongoose, MongooseDocument } from "mongoose";
import db from "../database/connection";
import { Planet } from "../database/schemas/planets";

interface PlanetData {
    name: string,
    mass: {
        value: number,
        unit: string,
    }
}
// equivalente ao controller
class ArcAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL = 'https://api.arcsecond.io/'
    }

    // GET METHODS
    
    // seria legal tipar o retorno das funções também
    async getAllData() {
        // aqui você consegue tipar a response da api, exemplo:
        // se você sabe que ela retorna um objeto assim: { results?: Array<Planets> }, pode criar um tipo pra isso
        // e fazer 
        // interface PlanetData = { ...as coisas q tem no planets }
        // interface ExoplanetsQueryResponse = { results?: Array<PlanetData> };
        // this.get<ExoplanetsQueryResponse>('exoplanets');
        const { results } = await this.get('exoplanets')

        return Array.isArray(results)
            ? results.map(planet => this.allDataReducer(planet))
            : []
    }
    // vi que algumas funções você só usa internamente nessa classe, uma boa seria botar como private :)
    allDataReducer(planet: PlanetData) {
        const mass = planet.mass ? planet.mass.value : null

        if (mass === null) return

        return {
            name: planet.name,
            // poderia separar a mass da unit pra facilitar na getPlanetsHeavierThan
            mass: `${mass} ${planet.mass.unit}`,
        }
    }

    async getPlanetsHeavierThan(lowestMass: number) {
        // daí com a tipagem q eu falei na função getAllData, vc sabe que results é opcional e evita o tratamento do Array.isarray


        // Daqui até a linha 57 você poderia tratar de outras duas formas, sabendo que o results é opcional:
        // --
        // fazer um if (!results) throw new Error('seu erro bonitinho') ## mas fica incoerente com a getAllData
        // --
        // Ou usar a função que você já faz a query exoplanets, substituindo todas essas linhas por this.getAllData()
        // e fazendo um filter nela, ao invés desse reducer:
        // const planets = await this.getAllData();
        // return plantes.filter(planet => planet.mass > lowestMass);
        // (isso se separasse a mass da unit)
        let { results } = await this.get('exoplanets')
        // esse nome não ficou muito descritivo, até mesmo porque ele não retorna null em nenhum caso :/
        const nullableData = Array.isArray(results)
            ? results.map(planet => this.planetsHeavierThanReducer(planet, lowestMass))
            : []

        // das duas formas que falei acima não precisaria desse for, mas mesmo assim, poderias utilizar um for..of
        // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/for...of
        const responseData = []
        for (var i = 0; i < nullableData.length; i++) {
            if (nullableData[i] !== undefined) {
                responseData.push(nullableData[i])
            }
        }
        return responseData
    }

    planetsHeavierThanReducer(planet: PlanetData, lowestMass: number) {
        const mass = planet.mass ? planet.mass.value : null

        if (mass === null) return

        if (mass > lowestMass) {
            return {
                name: planet.name,
                mass: `${mass} ${planet.mass.unit}`,
            }
        }
    }

    async getSuitablePlanets() {
        // da mesma forma que a getPlanetsHeavierThan() você poderia utilizar o this.getAllData pra te poupar
        // esforço nesse tratamento de nullability
        // e dava pra fazer aquele mesmo esquema:
        // const planets = await this.getAllData();
        // return plantes.filter(planet => planet.unit == 'M_JUP' && planet.mass > lowestMass);
        // (isso se separasse a mass da unit)
        let { results } = await this.get('exoplanets')
        var responseData = []
        if (Array.isArray(results)) {
            // dai aqui se usasse aquele filter ali podia fazer o reducer
            // aqui podia ser um for...of também
            for (var i = 0; i < results.length; i++) {
                const planet = await this.suitablePlanetsReducer(results[i])
                if (planet !== undefined) {
                    responseData.push(planet)
                }
            }
        }
        return responseData
    }

    // esse reducer podia ser um map só pra adicionar o hasStation e numberOfStations
    async suitablePlanetsReducer(planet: PlanetData) {
        const mass = planet.mass ? planet.mass.value : null
        // utilizar var não é tão legal por causa de uns comportamentos bizarros que o javascript tem com hoisting
        // recomendo dar uma lida nesse post da alura que é bem completo :)
        // https://www.alura.com.br/artigos/entenda-diferenca-entre-var-let-e-const-no-javascript
        var hasStation = false
        var numberOfStations = 0

        if (mass === null) return

        // checar no db se existe algum registro do planeta que esta sendo checado, se existir, 
        // se existir -----> alterar o valor da variável hasStation para o valor que esta no 
        // banco de dados bem como o numero de estações em cada planeta.

        if (mass > 25) {
            try {
                const planetWithStation = await Planet.find({ name: planet.name })
                if (planetWithStation.length > 0) {
                    console.log('Temos um planeta igual a este com estações já instaladas.', planetWithStation.length)

                    // essa parte ficou meio confusa, não entendi se podem existir planetas com o mesmo nome,
                    // se for o caso, ok, se não poderia ser um findOne na linha 32 e resolveria esses problemas abaixo
                    const thisPlanet = planetWithStation[0]
                    // considerando que um dia poderemos desinstalar estações, faz sentido considerer que o valor 
                    // salvo no banco de dados poderá ser false
                    hasStation = thisPlanet.hasStation
                    numberOfStations = planetWithStation.length
                }
            } catch (error) {
                console.log(error)
            }
            // esse retorno pode estar dentro do try sem problemas :)
            return {
                name: planet.name,
                mass: `${mass} ${planet.mass.unit}`,
                hasStation: hasStation,
                numberOfStations: numberOfStations
            }
        }
    }

    async getPlanetByName(name: string) {
        // buscar primeiro no banco de dados
        try {
            const planetWithStation = await Planet.find({ name: name })
            console.log('Temos um planeta igual a este com estações já instaladas.', planetWithStation.length)

            const planet = planetWithStation[0]
            return {
                name: planet.name,
                mass: planet.mass,
                hasStation: planet.hasStation,
                numberOfStations: planetWithStation.length
            }
        } catch {
            // como você utilizou o atlas não consegui testar se ele realmente só busca na api se não tiver no banco
            // já que não tem um throw dentro do try, ele nunca entraria nesse catch
            // e talvez não seria nem necessário buscar no banco, e já ir direto pra api mesmo
            try {
                // não tendo encontrado nada no banco de dados, buscar na api
                const response = await this.get(`exoplanets/${name}/`)

                return this.allDataReducer(response)
            } catch (error) {
                return error
            }
        }
    }

    // POST METHODS

    async installStation(name: string) {
        const planetData = await this.getPlanetByName(name)
        if (!planetData) return

        const newStation = new Planet({
            name: planetData.name,
            mass: planetData.mass,
            hasStation: true,
        })
        // como tem uma promise ali na linha 188, esse try/catch poderia englobar a função toda, moveria esse "try { " pra 
        // pra linha 188
        try {
            const createdStation = newStation.save()
            return (createdStation)
        } catch (error) {
            // como o createdStation é uma promise, acredito que ele não vai cair nesse catch também,
            // não tenho certeza pra falar a verdade, teria que testar
            console.log(error)
            return
        }
    }
}

export default ArcAPI