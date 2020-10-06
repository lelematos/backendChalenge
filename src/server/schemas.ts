import { gql } from "apollo-server";

const typeDefs = gql`
    # o que eu comentei no arquivo resolvers.ts que ficaria em um arquivo .graphql seria isso aqui
    type Planet {
        name: String
        mass: String
        hasStation: Boolean
        numberOfStations: Int
    }

    type Query {
        planets: [Planet]
        # esse parâmetro "name" poderia ser obrigatório, assim você evita tentar acessar alguma propriedade de um objeto undefined/nulo
        # ou poderia tratar no resolver, mas o ideal seria aqui mesmo na exposição da API
        planet(name: String): Planet
        # esse também
        planetsHeavierThan(lowestMass: Float): [Planet]
        suitablePlanets: [Planet]
    }

    type Mutation {
        # esse também
        installStation(name: String): Planet
    }
`

export default typeDefs