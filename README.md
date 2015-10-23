# TAPoR


## Set up development enviorment

Install RVM and ruby

```
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
rvm install ruby-2.2.0
```

Install bundler and rails

```
rvm 2.2.0
gem install bundler
gem install rails
```

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