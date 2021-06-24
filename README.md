"# AnthonyCecconato_5_30042021" 

[![DeepScan grade](https://deepscan.io/api/teams/14397/projects/17524/branches/404625/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=14397&pid=17524&bid=404625)
[![Known Vulnerabilities](https://snyk.io/test/github/acecconato/AnthonyCecconato_5_30042021/badge.svg)](https://snyk.io/test/github/acecconato/AnthonyCecconato_5_30042021)

## How to deploy

**Requirements**
- [Nodejs (LTS recommended)](https://nodejs.org/en/)

### Local Development environment

Clone the repository:
> `git clone https://github.com/acecconato/AnthonyCecconato_5_30042021.git`

Move into it
> `cd AnthonyCecconato_5_30042021`

Install the dependencies
> `npm install`

Start the local development server

> `npm run serve` or `yarn serve`

Optionally, you can configure the environment in `assets/js/config/config.js`

---

### Production deployment

Clone the repository:
> `git clone https://github.com/acecconato/AnthonyCecconato_5_30042021.git`
> 
Move into it
> `cd AnthonyCecconato_5_30042021`

Install the dependencies
> `npm install`
> 
Configure the environment
> Open the **assets/js/config/config.js** file

> Change the `basePath` value to your domain (e.g: dw05.anthony-cecconato.fr)
 
> If you're using SSL, change the **http** from the `apiUrl` to **https** (e.g: https://jwdp5.anthony-cecconato.fr/api)

Build the app
> `npm run start` or `yarn start`
