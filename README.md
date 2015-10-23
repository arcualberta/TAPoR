# TAPoR


## Set up development enviorment

Clone repo

```
git clone https://github.com/arcualberta/TAPoR.git TAPoR
```

Copy application and database configuration

```
cd TAPoR
cp config/EXAMPLE-application.yml config/application.yml
cp config/EXAMPLE-database.yml config/database.yml
```

Configure database as needed and make appropriate changes on database.yml file.

Initialize database

```
rake db:migrate
rake db:seed
```

Start server and get to it !

``` 
rails s
```