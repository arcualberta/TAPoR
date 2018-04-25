#!/Users/orodrigu/.rvm/rubies/ruby-2.1.0/bin/ruby
#/home/orodrigu/.rvm/rubies/ruby-2.2.2/bin/ruby

require 'csv'
require_relative '../../config/environment'

# print File.expand_path(File.dirname(__FILE__))

tapor_tool_count = 0
dirt_tool_count = 0

CSV.foreach(File.expand_path(File.dirname(__FILE__)) + "/dirt.csv") do |row|
	tool_name = row[0]
	# print tool_name + "\n"
	tool = Tool.where(name: tool_name).first()
	if tool
		# print "TAPoR: " + tool.name + "\n"

		print "VVV\n"
		print tool.detail
		print "\n===\n"
		print row[1]
		print "\n^^^\n"

		tapor_tool_count += 1
	end 
	# print "Dirt: " + tool_name + "\n"
	dirt_tool_count += 1
	
end

print "TAPoR tools: " + tapor_tool_count.to_s + "\n"
print "Dirt tools: " + dirt_tool_count.to_s + "\n"


