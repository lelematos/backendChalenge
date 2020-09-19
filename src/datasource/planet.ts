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

    async getAllData() {
        const { results } = await this.get('exoplanets')

        return Array.isArray(results)
            ? results.map(planet => this.allDataReducer(planet))
            : []
    }

    allDataReducer(planet: PlanetData) {
        const mass = planet.mass ? planet.mass.value : null

        if (mass === null) return

        return {
            name: planet.name,
            mass: `${mass} ${planet.mass.unit}`,
        }
    }

    async getPlanetsHeavierThan(lowestMass: number) {
        let { results } = await this.get('exoplanets')

        const nullableData = Array.isArray(results)
            ? results.map(planet => this.planetsHeavierThanReducer(planet, lowestMass))
            : []

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
        let { results } = await this.get('exoplanets')

        var responseData = []
        if (Array.isArray(results)) {
            for (var i = 0; i < results.length; i++) {
                const planet = await this.suitablePlanetsReducer(results[i])
                if (planet !== undefined) {
                    responseData.push(planet)
                }
            }
        }
        return responseData
    }

    async suitablePlanetsReducer(planet: PlanetData) {
        const mass = planet.mass ? planet.mass.value : null
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

                    const thisPlanet = planetWithStation[0]
                    // considerando que um dia poderemos desinstalar estações, faz sentido considerer que o valor 
                    // salvo no banco de dados poderá ser false
                    hasStation = thisPlanet.hasStation
                    numberOfStations = planetWithStation.length
                }
            } catch (error) {
                console.log(error)
            }
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
        try {
            const createdStation = newStation.save()
            return (createdStation)
        } catch (error) {
            console.log(error)
            return
        }
    }
}

export default ArcAPI