### Created by: Alexandre Fortes Tondello

# Lemon - Eligibility

Not all clients who wish to join Lemon can be accepted at this time. This may be due to regulatory reasons or because it is not beneficial for either the client or Lemon. During the client acquisition process, we perform an eligibility check based on the data in the client's electricity bill. If the client is not eligible, we need to clearly state the reasons. If the client is eligible, we also need to calculate the projected amount of CO2 they would avoid emitting by using clean energy.

### Eligibility Criteria

To determine eligibility, we will apply the following criteria:

- Consumption Class
  - Possible Values: "Comercial", "Residencial", "Industrial", "Poder Público", and "Rural".
  - Eligible: "Comercial", "Residencial" and "Industrial".
- Tariff Mode
  - Possible Values: "Branca", "Azul", "Verde" and "Convencional".
  - Eligible: "Convencional" and "Branca".
- Minimum Consumption
  - The calculation should use the average of the 12 most recent consumption values.
    - Clients with a single-phase connection are eligible if their average consumption is greater than or equal to 400 kWh.
    - Clients with a two-phase connection are eligible if their average consumption is greater than or equal to 500 kWh.
    - Clients with a three-phase connection are eligible if their average consumption is greater than or equal to 750 kWh.

### Carbon emission savings

To calculate the annual CO2 savings projection, we consider that generating 1000 kWh in Brazil emits an average of 84kg of CO2.

## How it works

The SGRN API is built using the [NestJS](https://nestjs.com/) framework, which is a powerful and scalable [Node.js](https://nodejs.org/) framework.

### Endpoints

The API offers the following endpoints:

#### API Endpoints:

1.  `POST /eligibility/verify` - Verifies whether a client qualifies to become a Lemon customer

| Parameter           | Type                    | Description                                    | Example       |
| ------------------- | ----------------------- | ---------------------------------------------- | ------------- |
| numeroDoDocumento   | `string` _(Required)_   | CPF or CNPJ - 11 to 14 decimal characters      | `14041737706` |
| tipoDeConexao       | `string` _(Required)_   | Type of connection <sup>(1)</sup>              | `bifasico`    |
| classeDeConsumo     | `string` _(Required)_   | Consumption class <sup>(2)</sup>               | `industrial`  |
| modalidadeTarifaria | `string` _(Required)_   | Tariff Mode <sup>(3)</sup>                     | `verde`       |
| historicoDeConsumo  | `number[]` _(Required)_ | Historical energy consumption - 3 to 12 values | `[10,20,15]`  |

> <sup>(1)</sup> tiposDeConexao: `monofasico`, `bifasico`, `trifasico`

> <sup>(2)</sup> classesDeConsumo: `residencial`, `industrial`, `comercial`, `rural`, `poderPublico`

> <sup>(3)</sup> modalidadesTarifarias: `azul`, `branca`, `verde`, `convencional`

## How to use it

To run the API locally, follow these steps:

1. Install [Node.js](https://nodejs.org/) (Version 18 or higher is recommended)
2. Install yarn: `npm i -g yarn`
3. Unzip the project's **.zip** file or clone the repository to your local machine
4. Navigate to the project's directory: `cd lemon`
5. Install package dependencies: `yarn`

### Running the Server

1.  Start the API server:

```
yarn start
```

The API server will now be running at `http://localhost:3000`

You can use tools like [Postman](https://www.postman.com/) or [Curl](https://curl.se/) to test the API endpoint at `http://localhost:3000/eligibility/verify`

## Other Information

### Automated Tests

Unit tests and end-to-end tests are written for all major functions and application flows.

To run automated tests:

```
yarn test
```

## Thank you

Thank you for using Lemon API! Happy coding! 🚀
