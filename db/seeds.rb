# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
AttributeType.create(name: "Background processing", possible_values: "Doesn't run in background|Not applicable|Runs in background", is_multiple: false);
AttributeType.create(name: "Warning", possible_values: "Complex and difficult|Limited uses|Prototype|Still in development|Time consuming", is_multiple: true);