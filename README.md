# TAPoR


## Set up development enviorment


Install Homebrew

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install Xapian development files

```
brew install xapian
```

Clone repo and move into working directory

```
git clone https://github.com/arcualberta/TAPoR.git TAPoR
cd TAPoR
```

Install gems

```
bundle install
```

Copy application and database configuration

```
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