## applied patterns:

#### done:


#### observations:
- **controllers/:** repeats try-catch a ton, one service is uniquely used in one controller, "storage" repeats a ton. *only used in index.ts*
- **middleware/:** config is used in all of the middlewares
- **models/**: user uses a string to check states. PortfolioHolding is not being used other than for Portfolio
- **routes/:** unless i make a route group, or do the checking after the routes that don't require auth
- **storage/:** i can separate the methods in groups. (user, assets, transactions, orders, portfolios, marketData)
- **index.ts**: each controller is only used in one place at a time

##### requirements:
- at least 3 patterns
- at least 2 are going to be combined
- justify my decision

---

#### notes: 

- **Creational patterns:** provide various object creation mechanisms
- **Structural patterns:** explain how to assemble objects and classes into larger structures while keeping these structures flexible and efficient
- **Behavioral patterns:** concerned with algorithms and the assignment of responsibilities between objects



**currently viewing: services/**

- ***MarketSimulationService:***
  - **simulateMarketEvent**: apply state pattern???

- ***MarketAnalysisService:***
  - **analyzePortfolioRisk**: apply state pattern + facade?