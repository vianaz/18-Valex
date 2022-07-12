<br clear="both">

<div align="center">
  <img height="200" src="https://cdn2.iconfinder.com/data/icons/flat-seo-web-ikooni/128/flat_seo2-21-256.png"  />
</div>

###

<h3 align="center">Build With</h3>

###

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" width="52" alt="nodejs logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" width="52" alt="typescript logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="40" width="52" alt="express logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" height="40" width="52" alt="jest logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" height="40" width="52" alt="postgresql logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg" height="40" width="52" alt="heroku logo"  />
</div>

###

## Features

- Get the card statement
- Creates cards
- Activate / Block / Unblock a card
- Recharges a card
- Make card payments
## Lessons Learned

In this project I learned a lot about how to structure an API with TypeScript. Also mocks/tests API and SOLID 
principle.

</br>

## API Reference

### Create a card

```http
  POST /card
```

#### Request:

####

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

| Body        | Type      | Description           |
| :---------- | :-------- | :-------------------- |
| `emploeeId` | `integer` | **Required**. user Id |
| `type`      | `string`  | **Required**. user Id |

`Valid types: [groceries, restaurant, transport, education, health]`

</br>

#### Response:

```json
{
  "cardholderName": "NAME N NAME",
  "number": "1111-1111-1111-1111",
  "cvv": "111",
  "expirationDate": "01/27",
  "type": "card type"
}
```

#

### Activate a card

```http
  POST /card/:cardId/activate
```

#### Request:

| Body       | Type     | Description                  |
| :--------- | :------- | :--------------------------- |
| `cvv`      | `string` | **Required**. card cvc       |
| `password` | `string` | **Required**. user full name |

`Password max length: 4`

`Cvv max length: 3`

#

### Block a card

```http
  POST /card/:cardId/block
```

#### Request:

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `password` | `string` | **Required**. card password |

#

### Unblock a card

```http
  POST /card/:id/unblock
```

#### Request:

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `password` | `string` | **Required**. card password |

#

### Recharge a card

```http
  POST /recharge/:cardId
```

#### Request:

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####

| Body     | Type      | Description                   |
| :------- | :-------- | :---------------------------- |
| `amount` | `integer` | **Required**. recharge amount |

#

### Card payment

```http
  POST /buy/:cardId
```

#### Request:

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `password`       | `string`  | **Required**. card password        |
| `businessId`     | `integer` | **Required**. business Id          |
| `amount`         | `integer` | **Required**. payment amount       |

#

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`

`PROD_MODE = boolean #recommended:false`

`PORT = number #recommended:5000`

`CRYPT_KEY = any string`

</br>

## Run Locally

Clone the project

```bash
  git clone https://github.com/vianaz/18-Valex
```

Go to the project directory

```bash
  cd 18-Valex/
```

Install dependencies

```bash
  yarn add
```

Create database

```bash
  yarn prisma generate
```

```bash
  yarn prisma db push
```

```bash
  yarn prisma db seed
```

Start the server

```bash
  yarn start
```

</br>

</br>

## Authors

- [@vianaz](https://www.github.com/vianaz)
