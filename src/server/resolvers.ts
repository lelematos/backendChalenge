const resolvers = {
    Query: {
        // não sei como definir o type para dataSources por conta da desestruturação
        planets: (_, __, { dataSources }) => dataSources.arcAPI.getAllData(),
        planet: (_, { name }, { dataSources }) => dataSources.arcAPI.getPlanetByName(name),
        planetsHeavierThan: (_, { lowestMass }, { dataSources }) => dataSources.arcAPI.getPlanetsHeavierThan(lowestMass),
        suitablePlanets: (_, __, { dataSources }) => dataSources.arcAPI.getSuitablePlanets(),
    },
    Mutation: {
        installStation: (_, { name }, { dataSources }) => dataSources.arcAPI.installStation(name)
    }
}

export default resolvers

