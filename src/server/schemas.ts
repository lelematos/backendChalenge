import { gql } from "apollo-server";

const typeDefs = gql`
    type Planet {
        name: String
        mass: String
        hasStation: Boolean
        numberOfStations: Int
    }

    type Query {
        planets: [Planet]
        planet(name: String): Planet
        planetsHeavierThan(lowestMass: Float): [Planet]
        suitablePlanets: [Planet]
    }

    type Mutation {
        installStation(name: String): Planet
    }
`

export default typeDefs