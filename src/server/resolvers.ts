const resolvers = {
    Query: {
        // não sei como definir o type para dataSources por conta da desestruturação
        /**
         *   
         * Opa, então mestre, existe uma lib chamada graphql-code-generator que você consegue
         * definir seu schema do graphql em um arquivo .graphql e gerar os tipos automáticamente.
         * daí você poderia fazer assim:
         * const Query: QueryResolvers = { // aqui você teria todo o auto-complete e tipagem de tudo }
         * 
         * A gente utiliza essa lib em nossos projetos, então você vai entender melhor em breve kkk
         * https://graphql-code-generator.com/
         **/ 
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

