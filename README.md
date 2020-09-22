# Dia 21 de setembro 2118 - O fim da primeira missão
Hoje é dia 21 de setembro de 2118, declaro aqui como concluida a missão que a mim foi passada, fui orientado a, buscando dados na API da Arcsecond, desenvolver um servidor em Node.js usando Apollo GraphQL Server que fornecesse Querys que pudessem ajudar no processo de seleção de planetas do sistema solar com características determinadas. A principal função desenvolvida aqui fora a criação de querys que pudessem assistenciar na buscar planetas que atendessem requisitos referentes a sua massa.  

### Documentação dos principais pacotes utilizados:
- [Arcsecond API] (Utilizada como fonte de informações sobre os planetas do sistema solar)
- [Apollo GraphQL Server] (Servidor GraphQL utilizado tanto para aquisição quanto para apresentação dos dados obtidos)
- [Mongoose] (Serviço de integração entre o servidor Node.js e o banco de dados MongoDB)


### Como rodar a aplicação:
**Observação:** descreverei aqui as instruções e comandos para Windows, mas sinta-se a vontade para aplicar os mesmos passos no seu sistem operacional de preferência.
1) Clone este repositório em sua máquina.
2) Abra a pasta do projeto no seu editor de código de preferência.
3) Ainda na página do projeto abra um aba do terminal de comando (Prompt de Comandos), e vamos começar instalando as dependencias do projeto: 
```sh
$ C:\Users\...\backendChalenge-master> npm install -d
```
4) Agora que todas as dependências do projeto já foram instaladas podemos executar o comando de inicialização para poder começar a testar as Querys. Execute o seguinte comando:
```sh
$ C:\Users\...\backendChalenge-master> npm start
```
Depois de alguns instantes você deve ver a seguinte mensagem no terminal: 
```sh
> server@1.0.0 start C:\Users\lemat\Downloads\backendChalenge-master
> tsnd --transpile-only --ignore-watch node_modules --respawn src/server.ts

ts-node-dev ver. 1.0.0-pre.62 (using ts-node ver. 8.10.2, typescript ver. 4.0.2)
� Server ready at http://localhost:4000/
connected to db
```
5) Agora que esta tudo certo com nosso servidor, o proximo passo é você acessar o endereço http://localhost:4000/. Você acessará a página do GraphQL Playground e é nela que iremos fazer nossas querys.

### Explorando as querys disponíveis:
**Observação:** Todas as Querys buscam resultados somente na primeira página da Arcsecond API.

##### **planets**
A query ***planets*** retorna todos os planetas listados na primeira página da API da Arcsecond, as informações disponíveis para estes planetas são: name, mass.

```javascript
query Planets{
  planets{
    name
    mass
  }
}
```

##### **planet (name: string)**

A query ***planet*** retorna o planeta cujo nome (name) fora fornecido para a Query como parâmetro. Dados disponiveis para consulta nesta Query são: name, mass, hasStation, numberOfStations.

```javascript
query getPlanetByName{
  planet(name: "AD 3116 b"){
    name
    mass
    hasStation
    numberOfStations
  }
}
```

##### **planetsHeavierThan (lowestMass: number)**

A query ***planetsHeavierThan*** retorna os planetas cuja massa é maior do que o parâmetro fornecido (lowestMass). Dados disponiveis para consulta nesta Query são: name, mass.

```javascript
query getPlanetsHeavierThan{
  planetsHeavierThan(lowestMass: 20){
    name
    mass
  }
}
```

##### **suitablePlanets**

A query ***suitablePlanets*** retorna os planetas cuja massa é maior do que 25 M_jup. Dados disponiveis para consulta nesta Query são: name, mass, hasStation, numberOfStations.

```javascript
query suitablePlanets{
  suitablePlanets{
    name
    mass
    hasStation
    numberOfStations
  }
}
```

##### **installStation**

A mutation ***installStation*** tem por função registrar a instalação de uma estação de carregamento em um determinado planeta, neste caso os planetas podem ter mais de uma estação instalada neless, mas neste momento não pode desinstala-las. A mutation recebe como parâmetro o nome do planeta em que se deseja instalar uma estação de carregamento nova. Os dados retornados após a instalação são: name, mass, hasStation.

As informações das estações já instaladas não estarão zeradas uma vez que o banco de dados que está sendo utilizado não fora alterado.

```javascript
mutation installStation{
  installStation(name: "1RXS J235133.3+312720 b"){
    name
    mass
    hasStation
  }
}
```

   [Apollo GraphQL Server]: <https://www.apollographql.com/docs/apollo-server/r>
   [http://localhost:4000/]: <http://localhost:4000/>
   [Mongoose]: <https://mongoosejs.com/docs/guide.html>
   [Arcsecond API]: <https://api.arcsecond.io/swagger/>
