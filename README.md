# TAPoR


## Set up development enviorment

Install RVM and ruby

```
rvm install ruby-2.2.0
```

Install bundler and rails

```
rvm 2.2.0
gem install bundler
gem install mysql
gem install rails
```

Install Homebrew

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install dependencies

```
brew install xapian
brew install imagemagick
brew install mysql
brew install npm
```

Install bower

```
npm install -g bower
```

Start MySQL database

```
mysql.server start
```

Clone repo and move into working directory

```
git clone https://github.com/arcualberta/TAPoR.git TAPoR
cd TAPoR
```

Install vendor assets

```
bower install
```

Generate special case assets

```
cd vendor/assets/components/ui.bootstrap
npm install
grunt
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