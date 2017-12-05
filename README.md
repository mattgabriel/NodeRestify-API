# NodeJS/Restify API


## SETUP

https://github.com/Microsoft/TypeScript-Node-Starter#typescript-node-starter	

`npm install typescript --save`



### Install Sublime plugin (optional):

Enable Package Control via tools > developer

Install the TypeScript package: `cmd+shift+P` > type `install` > `TypeScript`


https://github.com/corvisacloud/SummitLinter

Install sublime linter

Install lua: `brew install lua`

Install luacheck: `luarocks install luacheck --local`

Install package: `cmd+shift+P` > type `install` > `SublimeLinter`


To run it: `tslint -c tslint.json -p tsconfig.json`



### Dependencies

`npm install -g concurrently`

`npm install apidoc -g`

`npm install`



## RUN

`npm run build`

`export ENV=develop && npm run serve`



### Lifescyle

*Route*: 

- Requested by clients

- Calls a Controller

- Many Routes can call the same Controller


*Controller*:

- Authenticates the user

- Calls a Service

- Specifies and sends the response


*Service*:

- Business logic

- Calls Models, Helpers and Entities


*Model*:

- Object


*Helpers*:

- Perform a small task

- Abstract methods


*Entity*:

- Database queries






